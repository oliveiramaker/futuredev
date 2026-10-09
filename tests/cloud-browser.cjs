const assert=require('node:assert/strict');
const fs=require('node:fs/promises');
const path=require('node:path');
const http=require('node:http');
const {chromium}=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES?path.join(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES,'playwright'):'playwright');

(async()=>{
  const {buildSite}=await import('../scripts/build.mjs');
  await buildSite({SUPABASE_URL:'https://futuredev-test.supabase.co',SUPABASE_PUBLISHABLE_KEY:'sb_publishable_synthetic_futuredev_test'});
  const {createSupabaseFixture}=await import('./supabase-fixture.js');
  const browser=await chromium.launch({headless:true,executablePath:process.env.FUTUREDEV_CHROMIUM||undefined,args:['--no-sandbox','--disable-dev-shm-usage']});
  const fixture=await createSupabaseFixture();
  const root=path.resolve(__dirname,'../dist');
  const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.woff2':'font/woff2','.webmanifest':'application/manifest+json'};
  const server=http.createServer(async(req,res)=>{
    try{const pathname=new URL(req.url,'http://localhost').pathname;const file=path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));if(!file.startsWith(root+path.sep))throw new Error('path');const bytes=await fs.readFile(file);res.writeHead(200,{'Content-Type':types[path.extname(file)]||'text/plain'});res.end(bytes);}catch{res.writeHead(404);res.end('Not found');}
  });
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const base=`http://127.0.0.1:${server.address().port}/`;
  const errors=[];const contexts=[];let primaryPage;
  const context=async(width=1440)=>{
    const value=await browser.newContext({viewport:{width,height:1000},acceptDownloads:true});contexts.push(value);
    await value.route('https://futuredev-test.supabase.co/**',async route=>{
      const req=route.request();let body={};try{body=req.postDataJSON()||{};}catch{}
      const result=await fixture.handle(req.url(),req.method(),req.headers(),body);await route.fulfill(result);
    });
    return value;
  };
  const page=async(ctx)=>{const value=await ctx.newPage();value.on('pageerror',error=>errors.push(error.message));return value;};
  const login=async(value,email)=>{await value.locator('#auth-email').fill(email);await value.locator('#auth-password').fill('SenhaTeste!2026');await value.locator('#auth-form button[type=submit]').click();await value.locator('.sidebar').waitFor();};
  const synced=async value=>{await value.locator('[data-sync-status]').filter({hasText:'Salvo na sua conta'}).waitFor();};
  await fs.mkdir(path.resolve(__dirname,'../test-results'),{recursive:true});
  try{
    const {defaults}=await import('../js/store.js');
    const legacy=defaults();legacy.profile.name='Progresso anterior';legacy.xp=60;legacy.drafts.lab='print("anterior")';
    const ctxA=await context(), a=await page(ctxA);primaryPage=a;
    await a.addInitScript(value=>{if(location.protocol!=='http:'&&location.protocol!=='https:')return;if(!localStorage.getItem('futuredev:v1'))localStorage.setItem('futuredev:v1',JSON.stringify(value));},legacy);
    await a.goto(base+'#plano');await a.locator('#auth-form').waitFor();assert.equal(await a.locator('.sidebar').count(),0);
    await a.screenshot({path:path.resolve(__dirname,'../test-results/login-desktop.png'),fullPage:true});
    await a.locator('#auth-email').fill('errado@example.test');await a.locator('#auth-password').fill('errada');await a.locator('#auth-form button[type=submit]').click();await a.getByText('E-mail ou senha incorretos.',{exact:true}).waitFor();
    await login(a,fixture.users[0].email);
    await a.locator('#name').fill('Ana Python');await a.locator('#minutes').selectOption('60');await a.locator('#profile-form button[type=submit]').click();await synced(a);
    assert.equal((await fixture.progress(fixture.users[0].id)).state.profile.name,'Ana Python');
    assert.equal(await a.evaluate(()=>JSON.parse(localStorage.getItem('futuredev:v1')).profile.name),'Progresso anterior');
    const ctxSecond=await context(), second=await page(ctxSecond);await second.goto(base+'#plano');await login(second,fixture.users[0].email);assert.equal(await second.locator('#name').inputValue(),'Ana Python');
    await a.goto(base+'#laboratorio');await a.locator('#code-editor').fill('print("salvo na conta")');await a.locator('#draft-status').filter({hasText:'Salvo na sua conta'}).waitFor();await synced(a);
    assert.equal((await fixture.progress(fixture.users[0].id)).state.drafts.lab,'print("salvo na conta")');
    await second.locator('#name').fill('Alteração antiga');await second.locator('#profile-form button[type=submit]').click();await second.locator('[data-cloud-alert]').waitFor();assert.equal((await fixture.progress(fixture.users[0].id)).state.profile.name,'Ana Python');
    await second.locator('[data-action=reload-cloud]').click();await second.locator('[data-action=confirm-reload-cloud]').click();await second.locator('#dialog').waitFor({state:'hidden'});assert.equal(await second.locator('#name').inputValue(),'Ana Python');
    fixture.offline=true;await a.locator('#code-editor').fill('print("pendente")');await a.locator('[data-cloud-alert]').waitFor();assert.equal((await fixture.progress(fixture.users[0].id)).state.drafts.lab,'print("salvo na conta")');
    fixture.offline=false;await a.locator('[data-action=sync-now]').click();await synced(a);assert.equal((await fixture.progress(fixture.users[0].id)).state.drafts.lab,'print("pendente")');
    await a.goto(base+'#preferencias');await a.locator('[data-action=import-local]').click();await a.locator('[data-action=confirm-import]').click();await synced(a);assert.equal((await fixture.progress(fixture.users[0].id)).state.xp,60);
    const backupPromise=a.waitForEvent('download');backupPromise.catch(()=>{});await a.getByRole('button',{name:'Exportar progresso',exact:true}).click();const backup=await backupPromise;const restored=JSON.parse(await fs.readFile(await backup.path(),'utf8'));assert.equal(restored.xp,60);
    await a.locator('[data-action=logout]').click();await a.locator('#auth-form').waitFor();assert.equal(await a.locator('.sidebar').count(),0);assert.equal(await a.getByText('Progresso anterior',{exact:true}).count(),0);
    await login(a,fixture.users[1].email);await a.goto(base+'#plano');assert.equal(await a.locator('#name').inputValue(),'Bruno');
    assert.equal(await fixture.progress(fixture.users[1].id),undefined);
    await a.locator('#name').fill('Bruno Dev');await a.locator('#profile-form button[type=submit]').click();await synced(a);assert.equal((await fixture.progress(fixture.users[0].id)).state.profile.name,'Progresso anterior');assert.equal((await fixture.progress(fixture.users[1].id)).state.profile.name,'Bruno Dev');
    await a.goto(base+'#preferencias');await a.locator('[data-action=logout]').click();await a.locator('#auth-form').waitFor();await a.locator('[data-action=auth-signup]').click();await a.locator('#auth-name').fill('Nova conta');await a.locator('#auth-email').fill('novo@example.test');await a.locator('#auth-password').fill('SenhaTeste!2026');await a.locator('#auth-confirm').fill('SenhaTeste!2026');await a.locator('#auth-form button[type=submit]').click();await a.getByText('Confira seu e-mail para confirmar a conta. Depois entre com sua senha.',{exact:true}).waitFor();
    await a.locator('[data-action=auth-forgot]').click();await a.locator('#auth-email').fill('ana@example.test');await a.locator('#auth-form button[type=submit]').click();await a.getByText('Se houver uma conta com esse e-mail, você receberá um link para criar uma nova senha.',{exact:true}).waitFor();assert.equal(fixture.recoveries,1);
    await a.goto('about:blank');await a.goto(base+`#access_token=${fixture.token(fixture.users[0].id)}&refresh_token=synthetic-${fixture.users[0].id}&expires_in=3600&token_type=bearer&type=recovery`);await a.getByText('Escolha uma nova senha.',{exact:true}).waitFor();assert.equal(await a.locator('.sidebar').count(),0);await a.locator('#auth-password').fill('NovaSenhaTeste!2026');await a.locator('#auth-confirm').fill('NovaSenhaTeste!2026');await a.locator('#auth-form button[type=submit]').click();await a.locator('.sidebar').waitFor();
    const mobileCtx=await context(390), mobile=await page(mobileCtx);await mobile.goto(base);await mobile.locator('#auth-form').waitFor();await mobile.screenshot({path:path.resolve(__dirname,'../test-results/login-mobile.png'),fullPage:true});
    for(const width of [320,390,768,1440]){await mobile.setViewportSize({width,height:900});assert.equal(await mobile.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth),true,`login overflow ${width}`);}
    await a.goto(base+'#inicio');await a.screenshot({path:path.resolve(__dirname,'../test-results/cloud-dashboard.png'),fullPage:true});
    assert.deepEqual(errors,[]);console.log('Browser + SDK Supabase + PostgreSQL: login, cadastro, recuperação, migração, duas contas, dois aparelhos, conflito, falha de rede, backup e layout passaram.');
  }catch(error){if(primaryPage){console.log((await primaryPage.locator('body').innerText()).slice(-1800));await primaryPage.screenshot({path:path.resolve(__dirname,'../test-results/cloud-failure.png'),fullPage:true});}throw error;}
  finally{await browser.close();await new Promise(resolve=>server.close(resolve));await fixture.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
