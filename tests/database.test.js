import test from 'node:test';
import assert from 'node:assert/strict';
import {createDatabase, USER_A, USER_B} from './database-fixture.js';
import {defaults} from '../js/store.js';

test('Migração PostgreSQL: RLS isola contas, bloqueia acesso anônimo e RPC protege revisões', async () => {
  const fixture=await createDatabase(), {as,db}=fixture;
  const snapshot=defaults();snapshot.profile.name='Conta A';
  const save=(conn,state,revision)=>conn.query('select public.save_futuredev_progress($1::jsonb,$2::bigint) as result',[JSON.stringify(state),revision]);
  try{
    const first=await as(USER_A,c=>save(c,snapshot,0));assert.equal(first.rows[0].result.revision,1);
    const foreign=await as(USER_B,c=>c.query('select * from public.futuredev_progress'));assert.equal(foreign.rows.length,0);
    await assert.rejects(as(null,c=>c.query('select * from public.futuredev_progress'),'anon'),/permission denied/);
    await assert.rejects(as(null,c=>save(c,snapshot,0),'anon'),/permission denied/);
    await assert.rejects(as(null,c=>save(c,snapshot,0)),/Authentication required/);
    await assert.rejects(as(USER_B,c=>c.query('insert into public.futuredev_progress(user_id,state) values ($1,$2::jsonb)',[USER_A,JSON.stringify(snapshot)])),/row-level security/);
    const editOther=await as(USER_B,c=>c.query('update public.futuredev_progress set revision=99 where user_id=$1 returning *',[USER_A]));assert.equal(editOther.rows.length,0);
    await assert.rejects(as(USER_A,c=>c.query('update public.futuredev_progress set user_id=$1 where user_id=$2',[USER_B,USER_A])),/row-level security/);
    await assert.rejects(as(USER_A,c=>save(c,snapshot,0)),error=>error.code==='PT409');
    snapshot.drafts.lab='print("salvo")';const second=await as(USER_A,c=>save(c,snapshot,1));assert.equal(second.rows[0].result.revision,2);
    await assert.rejects(as(USER_A,c=>save(c,defaults(),1)),error=>error.code==='PT409');
    const saved=await as(USER_A,c=>c.query('select state,revision from public.futuredev_progress'));assert.equal(saved.rows[0].state.drafts.lab,snapshot.drafts.lab);assert.equal(saved.rows[0].revision,2);
    await assert.rejects(as(USER_A,c=>save(c,{app:'futuredev'},2)),/check constraint/);
    await assert.rejects(as(USER_A,c=>save(c,{...snapshot,drafts:{lab:'x'.repeat(5300000)}},2)),/check constraint/);
    await db.query('delete from auth.users where id=$1',[USER_A]);assert.equal((await db.query('select * from public.futuredev_progress')).rows.length,0);
  }finally{await fixture.close();}
});
