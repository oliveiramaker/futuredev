import {createDatabase, USER_A, USER_B} from './database-fixture.js';

// Synthetic Auth endpoints for browser tests, connected to the actual
// PostgreSQL migration and RLS through PGlite. No live users or credentials.
export async function createSupabaseFixture() {
  const database=await createDatabase();
  const users=[{id:USER_A,email:'ana@example.test',name:'Ana'},{id:USER_B,email:'bruno@example.test',name:'Bruno'}];
  const user=value=>({id:value.id,email:value.email,aud:'authenticated',role:'authenticated',created_at:new Date().toISOString(),app_metadata:{provider:'email',providers:['email']},user_metadata:{name:value.name}});
  const token=id=>`${Buffer.from(JSON.stringify({alg:'HS256',typ:'JWT'})).toString('base64url')}.${Buffer.from(JSON.stringify({sub:id,role:'authenticated',aud:'authenticated',exp:Math.floor(Date.now()/1000)+3600,iat:Math.floor(Date.now()/1000)})).toString('base64url')}.synthetic-test-signature`;
  const session=value=>({access_token:token(value.id),refresh_token:`synthetic-${value.id}`,expires_in:3600,token_type:'bearer',user:user(value)});
  let offline=false, writeCount=0, recoveryRequests=0;
  const reply=(status,body)=>({status,body:JSON.stringify(body),contentType:'application/json',headers:{'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'*','Access-Control-Allow-Methods':'GET,POST,PUT,OPTIONS','Access-Control-Expose-Headers':'X-Supabase-Api-Version','X-Supabase-Api-Version':'2024-01-01'}});
  return {
    users,session,token,database,
    set offline(value){offline=value;},
    get writes(){return writeCount;},
    get recoveries(){return recoveryRequests;},
    async handle(url,method,headers,body) {
      const path=new URL(url).pathname;
      if(method==='OPTIONS')return reply(200,{});
      if(path==='/auth/v1/token'){
        const selected=users.find(v=>v.email===body.email||`synthetic-${v.id}`===body.refresh_token);
        return selected&&(body.password==='SenhaTeste!2026'||body.refresh_token) ? reply(200,session(selected)) : reply(400,{code:'invalid_credentials',message:'Invalid login credentials'});
      }
      if(path==='/auth/v1/signup')return reply(200,user({id:USER_A,email:body.email,name:body.data?.name||'Dev'}));
      if(path==='/auth/v1/recover'){recoveryRequests++;return reply(200,{});}
      if(path==='/auth/v1/logout')return reply(200,{});
      let id;
      try{id=JSON.parse(Buffer.from((headers.authorization||'').split('.')[1],'base64url').toString()).sub;}catch{return reply(401,{message:'Authentication required'});}
      const selected=users.find(v=>v.id===id);if(!selected)return reply(401,{message:'Invalid user'});
      if(path==='/auth/v1/user')return reply(200,user(selected));
      if(offline)return reply(503,{code:'offline_test',message:'Simulated network failure'});
      try{
        if(path==='/rest/v1/futuredev_progress'){
          const requested=new URL(url).searchParams.get('user_id')?.replace(/^eq\./,'');
          const rows=await database.as(id,async db=>(await db.query('select state,revision,updated_at from public.futuredev_progress where user_id=$1',[requested||id])).rows);
          return reply(200,rows);
        }
        if(path==='/rest/v1/rpc/save_futuredev_progress'){
          const result=await database.as(id,async db=>(await db.query('select public.save_futuredev_progress($1::jsonb,$2::bigint) as result',[JSON.stringify(body.p_state),body.p_expected_revision])).rows[0].result);
          writeCount++;return reply(200,result);
        }
        return reply(404,{message:'Unknown fixture endpoint'});
      }catch(error){return reply(error.code==='PT409'?409:400,{code:error.code,message:error.message});}
    },
    async progress(id){return database.as(id,async db=>(await db.query('select state,revision from public.futuredev_progress where user_id=$1',[id])).rows[0]);},
    async close(){await database.close();}
  };
}
