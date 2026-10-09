import {modules,lessons,lessonMap,quizzes,diagnostic} from './curriculum.js';
import {projects,interviewQuestions} from './content.js';
import {Store,today,touch,recordLesson,grade,recordQuiz,recordDiagnostic,recordQuestionReview,dueReviews,safeUrl,sanitize,validDate} from './store.js';
import {PythonRunner} from './runner.js';
import {icon,esc} from './ui.js';
import {shell,dashboard,trail,lessonView,lab,assessment,reviews,projectView,career,planView,settings} from './views.js?v=1.1.0';

let localStorageAdapter;
try {localStorageAdapter=window.localStorage;} catch {localStorageAdapter={getItem:()=>null,setItem:()=>{throw new Error('Armazenamento indisponível');}};}
const store=new Store(localStorageAdapter);
const app=document.querySelector('#app');
const dialog=document.querySelector('#dialog');
const ui={route:'inicio',arg:'',quizResult:null,reviewQuestions:null,interviewId:interviewQuestions[0].id,lastExecution:null,runtime:{type:'idle',message:'Python no navegador'},inputs:{}};
let draftTimer,toastTimer,focusSession=null,focusInterval=null;
const runner=new PythonRunner((type,message)=>{ui.runtime={type,message};runtimeStatus();});

function toast(message) {const el=document.querySelector('#toast');el.textContent=message;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),5000);}
function persistedToast(ok,message) {toast(ok?message:store.error);}
function currentId() {return ui.route==='aula'&&lessonMap[ui.arg]?ui.arg:ui.route==='laboratorio'?'lab':null;}
function saveDraft() {
 clearTimeout(draftTimer);
 const id=currentId(),editor=document.querySelector('#code-editor');
 if(!id||!editor)return true;
 ui.inputs[id]=document.querySelector('#python-inputs')?.value||'';
 return store.update(s=>{s.drafts[id]=editor.value;if(id!=='lab')s.lastLesson=id;});
}
function runtimeStatus() {
 const label=document.querySelector('#runtime-status');if(label){label.textContent=ui.runtime.message;label.className=`runtime-status ${ui.runtime.type}`;}
 document.querySelectorAll('[data-action="run"], [data-action="test"]').forEach(b=>b.disabled=runner.busy);
 const stop=document.querySelector('[data-action="stop"]');if(stop)stop.hidden=!runner.busy;
}
function render() {
 const s=store.state;document.documentElement.dataset.theme=s.theme;
 document.querySelector('meta[name="theme-color"]')?.setAttribute('content',s.theme==='dark'?'#11152a':'#f7f4ec');
 const view=ui.route==='inicio'?dashboard(s):ui.route==='trilha'?trail(s,ui.arg):ui.route==='aula'?lessonView(s,ui.arg):ui.route==='laboratorio'?lab(s):ui.route==='avaliacao'?assessment(s,ui.arg,ui):ui.route==='revisoes'?reviews(s):ui.route==='projetos'?projectView(s,ui.arg):ui.route==='carreira'?career(s,ui):ui.route==='plano'?planView(s):settings(s);
 app.innerHTML=shell(s,ui.route,view,store.error);
 document.title=`${ui.route==='aula'&&lessonMap[ui.arg]?lessonMap[ui.arg].title:ui.route==='laboratorio'?'Laboratório Python':ui.route==='carreira'?'Sua primeira vaga':'Sua jornada em Python'} · FutureDev`;
 const id=currentId();if(id&&ui.inputs[id])document.querySelector('#python-inputs').value=ui.inputs[id];
 if(ui.lastExecution?.id===id)displayResult(ui.lastExecution);
 runtimeStatus();drawFocus();
}
function route() {
 saveDraft();if(runner.busy)runner.stop();
 const [page,arg='']=location.hash.replace(/^#\/?/,'').split('/');
 const allowed=['inicio','trilha','aula','laboratorio','avaliacao','revisoes','projetos','carreira','plano','preferencias'];
 let next=allowed.includes(page)?page:'inicio';
 if(next==='aula'&&!lessonMap[arg])next='trilha';
 if(next==='avaliacao'&&!['diagnostico','revisao'].includes(arg)&&!Object.hasOwn(quizzes,arg))next='trilha';
 if(next!==ui.route||arg!==ui.arg){ui.quizResult=null;ui.lastExecution=null;}
 ui.route=next;ui.arg=arg;
 if(next==='avaliacao'&&arg==='revisao')ui.reviewQuestions=dueReviews(store.state).questions.slice(0,20);
 render();window.scrollTo(0,0);
}
function refreshPreservingScroll() {saveDraft();const y=window.scrollY;render();window.scrollTo(0,y);}
function modal(html) {document.querySelector('#dialog-content').innerHTML=html;dialog.showModal();}
function closeModal(){dialog.close();}
function download(name,content,type='text/plain;charset=utf-8') {
 const url=URL.createObjectURL(new Blob([content],{type}));const link=document.createElement('a');link.href=url;link.download=name;document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),10000);
}
async function copy(value) {
 try {if(navigator.clipboard)await navigator.clipboard.writeText(value);else{const field=document.createElement('textarea');field.value=value;document.body.append(field);field.select();if(!document.execCommand('copy'))throw new Error('clipboard');field.remove();}toast('Exemplo copiado.');}
 catch {toast('Não foi possível copiar automaticamente. Selecione o exemplo e copie pelo navegador.');}
}
function insertText(text) {
 const editor=document.querySelector('#code-editor');if(!editor)return;
 editor.focus();editor.setRangeText(text,editor.selectionStart,editor.selectionEnd,'end');editor.dispatchEvent(new Event('input',{bubbles:true}));
}
function exportBackup() {saveDraft();download(`futuredev-progresso-${today()}.json`,JSON.stringify({...store.state,exportedAt:new Date().toISOString()},null,2),'application/json');toast('Backup exportado. Guarde uma cópia do arquivo.');}
function errorHint(error) {
 if(error.includes('IndentationError'))return 'Confira a indentação. Cada bloco usa quatro espaços e deve ter pelo menos uma instrução.';
 if(error.includes('SyntaxError'))return 'Confira a linha indicada: aspas, parênteses e dois-pontos precisam estar completos.';
 if(error.includes('NameError'))return 'Um nome foi usado antes de ser definido. Confira a grafia e onde a variável ou função é criada.';
 if(error.includes('TypeError'))return 'Confira os tipos e os argumentos. input() fornece texto; converta quando a regra precisar de números.';
 if(error.includes('ValueError'))return 'Um valor não atende à conversão ou à regra esperada. Teste uma entrada pequena e confira a validação.';
 if(error.includes('EOFError'))return 'Preencha as entradas de input(), uma linha por chamada, no painel abaixo do editor.';
 if(error.includes('ModuleNotFoundError')||error.includes('No known package'))return 'Essa biblioteca não está disponível nesse ambiente. As aulas de FastAPI e ambiente virtual têm uma prática própria no computador.';
 if(error.includes('IndexError'))return 'O índice está fora da lista. Lembre que o primeiro é 0 e o último é len(lista) - 1.';
 if(error.includes('KeyError'))return 'A chave não existe no dicionário. Confira os nomes dos campos e considere get() quando o campo for opcional.';
 return '';
}
function displayResult(execution) {
 const {result,verified,outcome}=execution;
 const output=document.querySelector('#console-output');if(!output)return;
 const hint=errorHint(result.error||'');
 output.innerHTML=`${result.output?`<pre>${esc(result.output)}</pre>`:!result.error?'<p class="console-placeholder">Execução concluída sem saída. Use print() se quiser observar um valor.</p>':''}${result.error?`<pre class="error-output">${esc(result.error)}</pre>`:''}${hint?`<div class="error-hint">${esc(hint)}</div>`:''}`;
 const label=document.querySelector('#execution-label');if(label)label.textContent=result.error?'Erro na execução':verified?'Testes concluídos':'Executado';
 const feedback=document.querySelector('#test-feedback');if(!feedback)return;
 if(!verified){feedback.innerHTML='';return;}
 const tests=result.tests||[],correct=tests.filter(t=>t.passed).length;
 const passed=!result.error&&tests.length===lessonMap[execution.id].tests.length&&tests.every(t=>t.passed);
 feedback.innerHTML=`<div class="feedback-heading ${passed?'':'failed'}">${icon(passed?'check':'info',22)}<div><strong>${passed?(outcome?.first?'Aula concluída! +60 XP':outcome?.review?'Revisão concluída! +10 XP':'Todos os testes passaram.'):'Ainda temos algo para ajustar.'}</strong><p>${passed?'Você aplicou a regra nos casos verificados. Explique a solução com suas palavras.':`${correct} de ${lessonMap[execution.id].tests.length} casos passaram. Leia o resultado, ajuste e tente novamente.`}</p></div></div>${tests.map(t=>`<div class="test-case ${t.passed?'passed':''}">${icon(t.passed?'check':'close',16)}<div>${esc(t.label)}${t.error?`<small>${esc(t.error)}</small>`:''}</div></div>`).join('')}`;
}
async function execute(verified=false) {
 const id=currentId();if(!id)return;
 const l=lessonMap[id],source=document.querySelector('#code-editor').value;
 const inputText=document.querySelector('#python-inputs')?.value||'';
 const inputs=inputText?inputText.replace(/\r/g,'').split('\n'):[];
 saveDraft();ui.lastExecution=null;
 document.querySelector('#console-output').innerHTML='<p class="console-placeholder">Preparando a execução… Você pode interromper pelo botão Parar.</p>';
 document.querySelector('#execution-label').textContent='Executando…';
 document.querySelector('#test-feedback').innerHTML='';
 const began=performance.now();
 try {
  const result=await runner.execute(source,verified&&l?l.tests:[],inputs);
  let outcome=null;
  const allPassed=!result.error&&result.tests.length===(l?.tests.length||0)&&result.tests.every(t=>t.passed);
  const saved=store.update(s=>{if(verified&&l)outcome=recordLesson(s,id,allPassed);else touch(s);});
  if(currentId()!==id)return;
  ui.lastExecution={id,result,verified:!!(verified&&l),outcome,elapsed:Math.round(performance.now()-began)};
  const y=window.scrollY;render();window.scrollTo(0,y);
  if(!saved)toast(store.error);else if(outcome?.first)toast('Mais um passo construído. Aula concluída e progresso salvo.');
 } catch(error) {
  if(currentId()===id){document.querySelector('#console-output').innerHTML=`<pre class="error-output">${esc(error.message)}</pre>`;document.querySelector('#execution-label').textContent='Interrompido';}
 } finally {runtimeStatus();}
}

function drawFocus() {
 const dock=document.querySelector('#focus-dock');if(!dock)return;
 if(!focusSession){dock.hidden=true;return;}
 const remaining=focusSession.paused?focusSession.remaining:Math.max(0,Math.ceil((focusSession.end-Date.now())/1000));
 if(remaining===0){finishFocus(true);return;}
 dock.hidden=false;dock.innerHTML=`${icon('clock',18)}<span>${focusSession.paused?'Pausado':'Em foco'}</span><strong>${String(Math.floor(remaining/60)).padStart(2,'0')}:${String(remaining%60).padStart(2,'0')}</strong><button class="icon-button" data-action="pause-focus" aria-label="${focusSession.paused?'Retomar foco':'Pausar foco'}">${icon(focusSession.paused?'play':'stop',17)}</button><button class="icon-button" data-action="finish-focus" aria-label="Encerrar sessão de foco">${icon('close',17)}</button>`;
}
function startFocus(minutes) {
 if(focusSession){toast('Sua sessão já está em andamento. Use os controles no contador.');return;}
 const seconds=Math.min(240,Math.max(1,Number(minutes)||45))*60;
 focusSession={total:seconds,remaining:seconds,end:Date.now()+seconds*1000,paused:false};focusInterval=setInterval(drawFocus,1000);drawFocus();toast('Sessão iniciada. Escolha uma aula e pratique.');
}
function finishFocus(completed=false,silent=false) {
 if(!focusSession)return;
 const remaining=focusSession.paused?focusSession.remaining:Math.max(0,Math.ceil((focusSession.end-Date.now())/1000));
 const elapsed=Math.max(0,Math.min(focusSession.total,focusSession.total-remaining));
 const saved=store.update(s=>{s.focusSeconds+=elapsed;if(elapsed>=60)touch(s);});
 focusSession=null;clearInterval(focusInterval);drawFocus();
 if(!silent){if(!saved)toast(store.error);else toast(completed?'Sessão concluída. Faça uma pausa antes de continuar.':`${Math.floor(elapsed/60)} minutos registrados nesta sessão.`);}
}

const labExamples={
 calc:'\n# Cálculo de lucro\ndef lucro(preco, custo, taxa):\n    return preco - custo - preco * taxa\n\nprint(f"Lucro: R$ {lucro(20, 8, 0.10):.2f}")\n',
 csv:'\n# Agrupar vendas por SKU\nimport csv\nfrom io import StringIO\n\ndados = "sku;quantidade\\nA;2\\nB;3\\nA;4\\n"\ntotais = {}\nfor linha in csv.DictReader(StringIO(dados), delimiter=";"):\n    sku = linha["sku"]\n    totais[sku] = totais.get(sku, 0) + int(linha["quantidade"])\nprint(totais)\n',
 json:'\n# Ler dados JSON\nimport json\n\ntexto = \'[{"sku":"A","quantidade":2},{"sku":"B","quantidade":3}]\'\npedidos = json.loads(texto)\nprint(sum(p["quantidade"] for p in pedidos))\n'
};
document.addEventListener('click',async event=>{
 const button=event.target.closest('[data-action]');if(!button||button.disabled)return;
 const action=button.dataset.action;
 if(action==='theme'){saveDraft();store.update(s=>s.theme=s.theme==='dark'?'light':'dark');refreshPreservingScroll();}
 else if(action==='run')await execute(false);
 else if(action==='test')await execute(true);
 else if(action==='stop')runner.stop();
 else if(action==='insert')insertText(button.dataset.text);
 else if(action==='focus-editor'){document.querySelector('.practice-column')?.scrollIntoView({behavior:'smooth',block:'start'});document.querySelector('#code-editor')?.focus({preventScroll:true});}
 else if(action==='copy-example')copy(lessonMap[ui.arg]?.example||'');
 else if(action==='download-code'){const id=currentId();if(id){saveDraft();download(id==='lab'?'futuredev-laboratorio.py':`${id}.py`,document.querySelector('#code-editor').value);toast('Código Python baixado.');}}
 else if(action==='reset-code')modal(`<h2>Restaurar o código inicial?</h2><p>O código atual deste editor será substituído. Baixe uma cópia se quiser guardá-lo.</p><div class="modal-actions"><button class="button outline" data-action="close-modal">Cancelar</button><button class="button primary" data-action="confirm-reset-code">Restaurar código</button></div>`);
 else if(action==='confirm-reset-code'){const id=currentId();if(id){document.querySelector('#code-editor').value=lessonMap[id]?.starter||'# Seu laboratório Python\nprint("Olá, FutureDev!")\n';document.querySelector('#code-editor').dispatchEvent(new Event('input',{bubbles:true}));saveDraft();ui.lastExecution=null;closeModal();refreshPreservingScroll();toast('Código inicial restaurado.');}}
 else if(action==='lab-example'){const editor=document.querySelector('#code-editor');editor.selectionStart=editor.selectionEnd=editor.value.length;insertText(labExamples[button.dataset.example]||'');editor.scrollTop=editor.scrollHeight;saveDraft();}
 else if(action==='retry-quiz'){ui.quizResult=null;render();window.scrollTo(0,0);}
 else if(action==='focus')startFocus(button.dataset.minutes);
 else if(action==='pause-focus'){if(focusSession){if(focusSession.paused){focusSession.end=Date.now()+focusSession.remaining*1000;focusSession.paused=false;}else{focusSession.remaining=Math.max(0,Math.ceil((focusSession.end-Date.now())/1000));focusSession.paused=true;}drawFocus();}}
 else if(action==='finish-focus')finishFocus();
 else if(action==='export')exportBackup();
 else if(action==='import')document.querySelector('#backup-file')?.click();
 else if(action==='confirm-import'){try{persistedToast(store.restore(ui.importedBackup),'Backup restaurado. Sua jornada está aqui.');ui.importedBackup=null;closeModal();ui.lastExecution=null;render();}catch(error){toast(error.message);}}
 else if(action==='close-modal')closeModal();
 else if(action==='project-starter'){const p=projects.find(p=>p.id===button.dataset.id);if(p)download(`futuredev-${p.id}-starter.py`,p.starter);}
 else if(action==='project-brief'){const p=projects.find(p=>p.id===button.dataset.id);if(p)download(`futuredev-${p.id}-briefing.md`,`# ${p.title}\n\n${p.description}\n\n## O problema\n${p.problem}\n\n## Critérios de entrega\n${p.requirements.map(r=>'- [ ] '+r).join('\n')}\n\n## Entrega\n${p.deliverable}\n\n## Autoavaliação\n${p.rubric}\n\n## Instalação\nDescreva os comandos e dependências do seu projeto.\n\n## Uso\nInclua um exemplo de entrada e saída.\n\n## Testes\nDescreva como executar a suíte.\n`);}
 else if(action==='new-application'){if(store.state.applications.length>=200){toast('O limite é 200 candidaturas. Exporte um backup e remova registros antigos para continuar.');return;}modal(`<h2>Nova candidatura</h2><p>Registre a oportunidade e o que pretende fazer a seguir.</p><form id="application-form"><label class="field-label" for="application-company">Empresa</label><input name="company" id="application-company" required maxlength="100" placeholder="Nome da empresa"><label class="field-label" for="application-role">Cargo</label><input name="role" id="application-role" required maxlength="150" placeholder="Desenvolvedor Python júnior"><label class="field-label" for="application-url">Link da vaga (opcional)</label><input name="url" id="application-url" type="url" maxlength="1500" placeholder="https://…"><label class="field-label" for="application-next">Próximo passo</label><textarea name="next" id="application-next" rows="2" maxlength="500" placeholder="Revisar currículo e enviar até sexta-feira"></textarea><div class="modal-actions"><button type="button" class="button outline" data-action="close-modal">Cancelar</button><button type="submit" class="button primary">Salvar candidatura</button></div></form>`);}
 else if(action==='delete-application'){ui.deleteApplication=button.dataset.id;modal(`<h2>Excluir esta candidatura?</h2><p>O registro será removido do seu acompanhamento.</p><div class="modal-actions"><button class="button outline" data-action="close-modal">Cancelar</button><button class="button primary" data-action="confirm-delete-application">Excluir registro</button></div>`);}
 else if(action==='confirm-delete-application'){persistedToast(store.update(s=>s.applications=s.applications.filter(a=>a.id!==ui.deleteApplication)),'Candidatura removida.');closeModal();render();}
});

document.addEventListener('submit',event=>{
 const form=event.target;if(!form.id)return;
 event.preventDefault();const data=new FormData(form);
 if(form.id==='quiz-form'){
  const id=form.dataset.quiz;const questions=id==='diagnostico'?diagnostic:id==='revisao'?ui.reviewQuestions:quizzes[id];
  const answers=questions.map((_,i)=>data.has(`q-${i}`)?Number(data.get(`q-${i}`)):null);
  try {
   const result=grade(questions,answers);
   const saved=store.update(s=>{if(id==='diagnostico')recordDiagnostic(s,result);else if(id==='revisao')result.results.forEach(r=>recordQuestionReview(s,r.question.id,r.correct));else recordQuiz(s,id,result);});
   ui.quizResult={id,result};render();window.scrollTo(0,0);persistedToast(saved,'Respostas corrigidas e progresso salvo.');
  } catch(error){toast(error.message);}
 } else if(form.id==='profile-form'){
  const target=data.get('target');if(!validDate(target)||target<today()){toast('Escolha uma data de meta válida, a partir de hoje.');return;}
  const ok=store.update(s=>{s.profile={name:String(data.get('name')).trim()||'Dev',minutes:Number(data.get('minutes')),days:Number(data.get('days')),target,level:data.get('level'),focus:data.get('focus')};});
  render();persistedToast(ok,'Plano salvo. A previsão foi atualizada.');
 } else if(form.id==='project-form'){
  const raw=String(data.get('url')||'').trim(),url=safeUrl(raw,true);
  if(raw&&!url){const field=form.querySelector('[name="url"]');field.setCustomValidity('Use um link HTTPS de repositório no GitHub.');field.reportValidity();return;}
  const id=form.dataset.id,checks=data.getAll('requirement').map(Number);
  const ok=store.update(s=>s.projectProgress[id]={checks,url,notes:String(data.get('notes')||'')});render();persistedToast(ok,'Projeto salvo. Os critérios registram sua autoavaliação.');
 } else if(form.id==='interview-form'){
  persistedToast(store.update(s=>s.interviewAnswers[form.dataset.id]=String(data.get('answer')||'')),'Resposta salva. Compare com os critérios e pratique em voz alta.');
 } else if(form.id==='application-form'){
  const raw=String(data.get('url')||'').trim(),url=safeUrl(raw);
  if(raw&&!url){const field=form.querySelector('[name="url"]');field.setCustomValidity('Use um link HTTPS sem credenciais.');field.reportValidity();return;}
  const company=String(data.get('company')).trim(),role=String(data.get('role')).trim();if(!company||!role){toast('Informe a empresa e o cargo.');return;}
  const id=globalThis.crypto?.randomUUID?.()||`application-${Date.now()}`;
  const ok=store.update(s=>s.applications.unshift({id,company,role,url,status:'preparando',date:today(),next:String(data.get('next')||'')}));closeModal();render();persistedToast(ok,'Candidatura registrada.');
 }
});
document.addEventListener('input',event=>{
 const target=event.target;if(target.setCustomValidity)target.setCustomValidity('');
 if(target.id==='code-editor'){
  document.querySelector('#line-numbers').textContent=target.value.split('\n').map((_,i)=>i+1).join('\n');
  if(ui.lastExecution){ui.lastExecution=null;document.querySelector('#test-feedback').innerHTML='';document.querySelector('#execution-label').textContent='Código alterado';}
  const label=document.querySelector('#draft-status');label.textContent='Salvando rascunho…';clearTimeout(draftTimer);
  draftTimer=setTimeout(()=>{const ok=saveDraft();const label=document.querySelector('#draft-status');if(label)label.textContent=ok?'Rascunho salvo neste navegador':'Não salvo. Exporte um backup.';},350);
 }
});
document.addEventListener('scroll',event=>{if(event.target.id==='code-editor')document.querySelector('#line-numbers').scrollTop=event.target.scrollTop;},true);
document.addEventListener('keydown',event=>{
 if(event.target.id!=='code-editor')return;
 const editor=event.target;
 if(event.key==='Enter'&&(event.ctrlKey||event.metaKey)){event.preventDefault();if(!runner.busy)execute(false);return;}
 if(event.key==='Tab'){
  event.preventDefault();
  const start=editor.selectionStart,end=editor.selectionEnd;
  if(start!==end||event.shiftKey){const lineStart=editor.value.lastIndexOf('\n',start-1)+1;const selected=editor.value.slice(lineStart,end);const updated=selected.split('\n').map(line=>event.shiftKey?line.replace(/^ {1,4}/,''):'    '+line).join('\n');editor.setRangeText(updated,lineStart,end,'select');}
  else editor.setRangeText('    ',start,end,'end');
  editor.dispatchEvent(new Event('input',{bubbles:true}));
 } else if(event.key==='Enter'){
  event.preventDefault();const start=editor.selectionStart,lineStart=editor.value.lastIndexOf('\n',start-1)+1,line=editor.value.slice(lineStart,start),indent=line.match(/^ */)[0]+(line.trimEnd().endsWith(':')?'    ':'');editor.setRangeText('\n'+indent,start,editor.selectionEnd,'end');editor.dispatchEvent(new Event('input',{bubbles:true}));
 }
});
document.addEventListener('change',async event=>{
 const target=event.target;
 if(target.dataset.careerCheck){const id=target.dataset.careerCheck;store.update(s=>{s.careerChecks=target.checked?[...new Set([...s.careerChecks,id])]:s.careerChecks.filter(c=>c!==id);});refreshPreservingScroll();}
 else if(target.dataset.application){persistedToast(store.update(s=>{const a=s.applications.find(a=>a.id===target.dataset.application);if(a)a.status=target.value;}),'Status atualizado.');}
 else if(target.id==='interview-select'){const form=document.querySelector('#interview-form');store.update(s=>s.interviewAnswers[form.dataset.id]=document.querySelector('#interview-answer').value);ui.interviewId=target.value;const y=window.scrollY;render();window.scrollTo(0,y);}
 else if(target.id==='backup-file'){
  const file=target.files?.[0];if(!file)return;
  try {if(file.size>5*1024*1024)throw new Error('O backup excede o limite de 5 MB.');const value=JSON.parse(await file.text());ui.importedBackup=sanitize(value);modal(`<h2>Restaurar este backup?</h2><p>Backup de <strong>${esc(ui.importedBackup.profile.name)}</strong>, com ${Object.keys(ui.importedBackup.completed).length} aulas concluídas.</p><p>O progresso atual deste navegador será substituído. Exporte uma cópia antes se quiser preservá-lo.</p><div class="modal-actions"><button class="button outline" data-action="close-modal">Cancelar</button><button class="button primary" data-action="confirm-import">Restaurar backup</button></div>`);}catch(error){toast(error instanceof SyntaxError?'O arquivo não contém um JSON válido.':error.message);}finally{target.value='';}
 }
});
dialog.addEventListener('click',event=>{if(event.target===dialog){const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)closeModal();}});
window.addEventListener('hashchange',route);
window.addEventListener('pagehide',()=>{saveDraft();finishFocus(false,true);});
window.addEventListener('offline',()=>toast('Você está offline. As aulas já carregadas continuam disponíveis; carregar Python precisa de conexão.'));
window.addEventListener('online',()=>toast('Conexão recuperada.'));
route();
if('serviceWorker' in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
