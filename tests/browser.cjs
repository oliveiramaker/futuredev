/* Fluxos do curso autenticado, com PostgreSQL de teste e Python real. */
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { chromium } = require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES ? path.join(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES,'playwright') : 'playwright');
let BASE=process.env.FUTUREDEV_BASE_URL;
const root=path.resolve(__dirname,'..');
const siteRoot=path.join(root,'dist');

(async()=>{
 const {buildSite}=await import('../scripts/build.mjs');
 await buildSite({SUPABASE_URL:'https://futuredev-test.supabase.co',SUPABASE_PUBLISHABLE_KEY:'sb_publishable_synthetic_futuredev_test'});
 const {createSupabaseFixture}=await import('./supabase-fixture.js');
 const fixture=await createSupabaseFixture();
 const {defaults}=await import('../js/store.js');
 let server;
 if(!BASE){
  const http=require('node:http');
  const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.woff2':'font/woff2','.webmanifest':'application/manifest+json','.py':'text/plain'};
  server=http.createServer(async(req,res)=>{try{let name=decodeURIComponent(new URL(req.url,'http://localhost').pathname).replace(/^\/futuredev\//,'');if(!name||name==='/')name='index.html';const file=path.resolve(siteRoot,name);if(!file.startsWith(siteRoot+path.sep)){res.writeHead(403);return res.end();}const content=await fs.readFile(file);res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream'});res.end(content);}catch{res.writeHead(404);res.end('Not found');}});
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));BASE=`http://127.0.0.1:${server.address().port}/futuredev/`;
 }
 const {lessons,quizzes,diagnostic}=await import(pathToFileURL(path.join(root,'js/curriculum.js')).href);
 const proxyUrl=process.env.HTTPS_PROXY||process.env.HTTP_PROXY;
 const browser=await chromium.launch({headless:true,executablePath:process.env.FUTUREDEV_CHROMIUM||undefined,args:['--no-sandbox','--disable-dev-shm-usage'],proxy:proxyUrl?{server:proxyUrl,bypass:'127.0.0.1,localhost'}:undefined});
 const context=await browser.newContext({viewport:{width:1440,height:1050},acceptDownloads:true});
 await context.route('https://futuredev-test.supabase.co/**',async route=>{const req=route.request();let body={};try{body=req.postDataJSON()||{};}catch{}await route.fulfill(await fixture.handle(req.url(),req.method(),req.headers(),body));});
 if(process.env.FUTUREDEV_RUNTIME_CACHE){
  // O espelho de teste usa os mesmos bytes do CDN, baixados com TLS validado.
  // Isso evita depender da configuração de certificados do Chromium de CI.
  const {execFile}=require('node:child_process');const {promisify}=require('node:util');const exec=promisify(execFile);
  const cache=process.env.FUTUREDEV_RUNTIME_CACHE;await fs.mkdir(cache,{recursive:true});
  await context.route('https://cdn.jsdelivr.net/pyodide/v0.28.3/full/**',async route=>{
   const url=route.request().url(),file=path.join(cache,path.basename(new URL(url).pathname));
   try{await fs.access(file);}catch{await exec('curl',['--fail','--silent','--show-error','--location','--max-time','60',url,'-o',file]);}
   const ext=path.extname(file);await route.fulfill({status:200,path:file,contentType:ext==='.js'?'text/javascript':ext==='.wasm'?'application/wasm':ext==='.json'?'application/json':'application/octet-stream',headers:{'Access-Control-Allow-Origin':'*'}});
  });
 }
 const page=await context.newPage();const errors=[];
 page.on('pageerror',error=>errors.push(error.message));
 page.on('console',msg=>{if(msg.type()==='error')console.log('Browser:',msg.text());});
 page.on('requestfailed',req=>console.log('Request failed:',req.url(),req.failure()?.errorText));
 await page.addInitScript(()=>{const NativeWorker=Worker;window.Worker=class extends NativeWorker {constructor(...args){super(...args);this.addEventListener('message',({data})=>{if(data.type==='init-error')console.error('Python loader:',data.message);});}};});
 await fs.mkdir(path.join(root,'test-results'),{recursive:true});
 const output=path.join(root,'test-results');
 const go=async hash=>{await page.goto(`${BASE}#${hash}`);await page.locator('main h1').waitFor();};
 const state=async()=>{await page.waitForFunction(()=>document.querySelector('#draft-status')?.textContent!=='Salvando rascunho…');await page.locator('[data-sync-status]').filter({hasText:'Salvo na sua conta'}).waitFor();return (await fixture.progress(fixture.users[0].id))?.state||defaults();};
 const run=async verified=>{
  await page.locator(`[data-action="${verified?'test':'run'}"]`).click();
  await page.waitForFunction(()=>{const s=document.querySelector('#execution-label')?.textContent;return ['Testes concluídos','Executado','Erro na execução','Interrompido'].includes(s);},{},{timeout:120000});
 };
 await page.goto(BASE);await page.locator('#auth-email').fill(fixture.users[0].email);await page.locator('#auth-password').fill('SenhaTeste!2026');await page.locator('#auth-form button[type=submit]').click();await page.locator('.sidebar').waitFor();
 await go('inicio');assert.ok((await page.locator('main').innerText()).includes('Seu próximo passo em Python.'));
 await page.evaluate(()=>document.fonts.ready);assert.ok(await page.evaluate(()=>[...document.fonts].some(f=>f.family==='Space Grotesk'&&f.status==='loaded')),'A fonte local deve carregar.');
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 await page.screenshot({path:path.join(output,'desktop-inicio.png'),fullPage:true});
 if(!process.env.FUTUREDEV_UI_ONLY){
 await go(`aula/${lessons[0].id}`);await page.locator('#code-editor').fill('print("Oi")');
 console.log('Carregando Python real no navegador…');await run(true);
 assert.ok((await page.locator('#test-feedback').innerText()).includes('Ainda temos algo para ajustar.'),await page.locator('#console-output').innerText());
 assert.equal(Object.keys((await state()).completed).length,0);
 await run(true);assert.ok((await page.locator('main').innerText()).includes('Comparar com uma solução'));
 await page.locator('#code-editor').fill(lessons[0].solution);await run(true);assert.equal((await state()).xp,60);
 await run(true);assert.equal((await state()).xp,60);
 await page.reload();await page.locator('#code-editor').waitFor();assert.equal(await page.locator('#code-editor').inputValue(),lessons[0].solution);assert.equal((await state()).xp,60);
 console.log('Correção e persistência verificadas.');
 await go('avaliacao/diagnostico');
 for(let i=0;i<diagnostic.length;i++)await page.locator(`#question-${i}-${(diagnostic[i].answer+1)%diagnostic[i].options.length}`).check();
 await page.locator('#quiz-form button[type=submit]').click();assert.equal((await state()).diagnostic.score,0);assert.equal(Object.keys((await state()).questionReviews).length,10);
 await go('avaliacao/m01');for(let i=0;i<quizzes.m01.length;i++)await page.locator(`#question-${i}-${quizzes.m01[i].answer}`).check();await page.locator('#quiz-form button[type=submit]').click();assert.equal((await state()).quizResults.m01.best,100);
 await go('avaliacao/revisao');const reviewIds=Object.keys((await state()).questionReviews);
 for(let i=0;i<reviewIds.length;i++){const q=Object.values(quizzes).flat().find(q=>q.id===reviewIds[i]);await page.locator(`#question-${i}-${q.answer}`).check();}await page.locator('#quiz-form button[type=submit]').click();
 assert.ok(Object.values((await state()).questionReviews).every(q=>q.level===1));
 console.log('Diagnóstico, avaliação e revisão verificados.');
 await go('laboratorio');await page.locator('#code-editor').fill('nome = input("Nome: ")\nprint(f"Olá, {nome}!")');await page.locator('.input-details summary').click();await page.locator('#python-inputs').fill('Matheus');await run(false);assert.ok((await page.locator('#console-output').innerText()).includes('Olá, Matheus!'));
 await page.locator('#code-editor').fill('while True:\n    pass');await page.locator('[data-action=run]').click();await page.locator('[data-action=stop]').waitFor({state:'visible'});await page.locator('[data-action=stop]').click();await page.waitForFunction(()=>document.querySelector('#console-output').textContent.includes('interrompida'));
 assert.equal(await page.locator('#code-editor').inputValue(),'while True:\n    pass');
 await page.locator('#code-editor').fill('print(2 + 3)');await run(false);assert.equal((await page.locator('#console-output').innerText()).trim(),'5');
 console.log('Entrada e interrupção de laços verificadas.');
 for(const lesson of lessons){await go(`aula/${lesson.id}`);await page.locator('#code-editor').fill(lesson.solution);await run(true);const feedback=await page.locator('#test-feedback').innerText();assert.ok(!feedback.includes('Ainda temos algo'),`${lesson.id}: ${feedback}\n${await page.locator('#console-output').innerText()}`);assert.ok((await state()).completed[lesson.id],lesson.id);}
 assert.equal(Object.keys((await state()).completed).length,48);
 console.log('48 exercícios e 173 casos passaram no Python do navegador.');
 }
 await go('plano');await page.locator('#name').fill('Dev de teste');await page.locator('#minutes').selectOption('60');await page.locator('#days').selectOption('6');await page.locator('#profile-form button[type=submit]').click();assert.equal((await state()).profile.days,6);assert.equal((await state()).profile.name,'Dev de teste');
 await go('projetos/margem');for(const checkbox of await page.locator('#project-form input[type=checkbox]').all())await checkbox.check();await page.locator('#project-url').fill('https://github.com/exemplo/calculadora');await page.locator('#project-notes').fill('Verifiquei as regras e o README.');await page.locator('#project-form button[type=submit]').click();assert.equal((await state()).projectProgress.margem.checks.length,6);
 await go('carreira');await page.locator('[data-career-check=github]').check();await page.locator('#interview-answer').fill('print exibe na saída. return entrega um valor ao chamador.');await page.locator('#interview-form button[type=submit]').click();
 await page.locator('[data-action=new-application]').first().click();await page.locator('#application-company').fill('Empresa de teste');await page.locator('#application-role').fill('Python júnior');await page.locator('#application-next').fill('Enviar currículo');await page.locator('#application-form button[type=submit]').click();await page.locator('[data-application]').selectOption('entrevista');assert.equal((await state()).applications[0].status,'entrevista');
 await go('preferencias');const downloadPromise=page.waitForEvent('download');await page.getByRole('button',{name:'Exportar progresso',exact:true}).click();const backup=await downloadPromise;await backup.saveAs(path.join(output,'backup.json'));const original=await state();
 await page.reload();await page.locator('main h1').waitFor();await page.locator('#backup-file').setInputFiles(path.join(output,'backup.json'));await page.locator('[data-action=confirm-import]').click();assert.deepEqual(await state(),original);
 const badFile=path.join(output,'invalido.json');await fs.writeFile(badFile,'{"app":"other","schema":1}');await page.locator('#backup-file').setInputFiles(badFile);assert.deepEqual(await state(),original);
 console.log('Plano, projetos, carreira, candidaturas e backup verificados.');
 await go('inicio');await page.locator('[data-action=theme]').click();assert.equal(await page.evaluate(()=>document.documentElement.dataset.theme),'light');await page.screenshot({path:path.join(output,'desktop-claro.png'),fullPage:true});
 await page.locator('[data-action=theme]').click();
 for(const theme of ['dark','light']){
  if(await page.evaluate(()=>document.documentElement.dataset.theme)!==theme)await page.locator('[data-action=theme]').click();
 for(const width of [390,320,768,1440]){
  await page.setViewportSize({width,height:900});
  if(width<=760)assert.ok(await page.getByRole('link',{name:'Preferências',exact:true}).isVisible(),'As preferências devem continuar acessíveis no celular.');
  for(const route of ['inicio','trilha','trilha/m01','aula/m03-dicionarios','laboratorio','projetos','projetos/api','carreira','plano','preferencias','avaliacao/m02','revisoes']){
   await go(route);
   const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
   if(overflow){await page.screenshot({path:path.join(output,'overflow.png'),fullPage:true});console.log(await page.evaluate(()=>[...document.querySelectorAll('main *')].map(e=>({tag:e.tagName,class:e.className,right:e.getBoundingClientRect().right,width:e.getBoundingClientRect().width})).filter(e=>e.right>innerWidth+1).slice(0,15)));}
   assert.equal(overflow,false,`Overflow em ${width}px (${theme}): ${route}`);
  }
 }
 }
 await context.clearCookies();await page.reload();await page.setViewportSize({width:390,height:844});await go('inicio');await page.screenshot({path:path.join(output,'mobile-inicio.png'),fullPage:true});
 await go('aula/m03-dicionarios');await page.screenshot({path:path.join(output,'mobile-aula.png'),fullPage:true});
 await page.setViewportSize({width:1440,height:1050});await go('inicio');await page.screenshot({path:path.join(output,'desktop-inicio.png'),fullPage:true});
 await page.locator('[data-action=theme]').click();await page.screenshot({path:path.join(output,'desktop-claro.png'),fullPage:true});await page.locator('[data-action=theme]').click();
 await page.goto(`${BASE}#aula/__proto__`);await page.locator('main h1').waitFor();await page.goto(`${BASE}#avaliacao/toString`);await page.locator('main h1').waitFor();
 assert.deepEqual(errors,[]);
 await page.waitForFunction(()=>navigator.serviceWorker.controller!==null,{},{timeout:10000});await context.setOffline(true);assert.ok(await page.locator('main').innerText());await context.setOffline(false);
 console.log('Layouts 320–1440px, tema claro, rotas inválidas e leitura offline verificados.');
 await browser.close();if(server)await new Promise(resolve=>server.close(resolve));await fixture.close();
})().catch(error=>{console.error(error);process.exit(1);});
