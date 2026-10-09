import test from 'node:test';
import assert from 'node:assert/strict';
import {modules,lessons,quizzes,diagnostic,lessonMap} from '../js/curriculum.js';
import {projects} from '../js/content.js';
import {defaults,today,addDays,recordLesson,grade,recordQuiz,recordDiagnostic,recordQuestionReview,dueReviews,streak,sanitize,makePlan,projectDone,safeUrl,Store,STORAGE_KEY} from '../js/store.js';

test('Currículo completo e contratos de exercícios e avaliações',()=>{
 assert.equal(lessons.length,48);assert.equal(modules.length,12);assert.equal(projects.length,6);assert.equal(new Set(lessons.map(l=>l.id)).size,48);
 for(const m of modules){assert.equal(lessons.filter(l=>l.module===m.id).length,4);assert.equal(quizzes[m.id].length,5);}
 for(const l of lessons){assert.ok(l.tests.length>=3);assert.ok(l.concept.length>100);assert.ok(l.walkthrough.length>100);assert.ok(l.solution);assert.ok(l.task);}
 for(const q of Object.values(quizzes).flat()){assert.ok(q.answer>=0&&q.answer<q.options.length);assert.ok(q.explanation);}
 assert.equal(lessonMap.__proto__,undefined);
});
test('Uma tentativa errada não conclui a aula e acertos repetidos não duplicam XP',()=>{
 const s=defaults(),id=lessons[0].id;recordLesson(s,id,false,'2026-10-09');assert.equal(s.completed[id],undefined);assert.equal(s.xp,0);
 recordLesson(s,id,true,'2026-10-09');assert.equal(s.xp,60);assert.equal(s.completed[id].due,'2026-10-10');
 recordLesson(s,id,true,'2026-10-09');assert.equal(s.xp,60);assert.equal(s.attempts[id],3);
 recordLesson(s,id,true,'2026-10-10');assert.equal(s.xp,70);assert.equal(s.completed[id].due,'2026-10-13');
 recordLesson(s,id,true,'2026-10-10');assert.equal(s.xp,70);
});
test('Avaliação exige todas as respostas, guarda melhor nota e cria revisão de erros',()=>{
 const s=defaults(),qs=quizzes.m01;assert.throws(()=>grade(qs,[0]));assert.throws(()=>grade(qs,[null,1,0,1,1]));
 const answers=qs.map(q=>q.answer);answers[0]=(answers[0]+1)%qs[0].options.length;
 const result=grade(qs,answers);assert.equal(result.score,80);recordQuiz(s,'m01',result,'2026-10-09');assert.equal(s.xp,40);assert.equal(dueReviews(s,'2026-10-09').questions.length,1);
 recordQuiz(s,'m01',grade(qs,qs.map(q=>q.answer)),'2026-10-09');assert.equal(s.xp,40);assert.equal(s.quizResults.m01.best,100);
 recordQuiz(s,'m01',grade(qs,qs.map(q=>(q.answer+1)%q.options.length)),'2026-10-09');assert.equal(s.quizResults.m01.best,100);assert.equal(s.quizResults.m01.last,0);
});
test('Diagnóstico não conclui módulos; erro revisado ajusta intervalo',()=>{
 const s=defaults();const result=grade(diagnostic,diagnostic.map(q=>(q.answer+1)%q.options.length));recordDiagnostic(s,result,'2026-10-09');
 assert.equal(Object.keys(s.completed).length,0);assert.equal(s.xp,0);assert.equal(dueReviews(s,'2026-10-09').questions.length,10);
 const id=diagnostic[0].id;recordQuestionReview(s,id,true,'2026-10-09');assert.equal(s.questionReviews[id].due,'2026-10-12');
 recordQuestionReview(s,id,false,'2026-10-12');assert.equal(s.questionReviews[id].due,'2026-10-13');assert.equal(s.questionReviews[id].level,0);
});
test('Datas e sequência usam São Paulo e aceitam continuidade até ontem',()=>{
 assert.equal(today(new Date('2026-10-09T02:59:00Z')),'2026-10-08');assert.equal(today(new Date('2026-10-09T03:00:00Z')),'2026-10-09');
 assert.equal(addDays('2028-02-28',1),'2028-02-29');
 const s=defaults();s.activity={'2026-10-07':1,'2026-10-08':2};assert.equal(streak(s,'2026-10-09'),2);assert.equal(streak(s,'2026-10-10'),0);
});
test('Plano usa o trabalho restante e mantém a data final das fases consistente',()=>{
 const s=defaults(),initial=makePlan(s,'2026-10-09');assert.equal(initial.end,initial.phases.at(-1).end);assert.equal(initial.phases.reduce((n,p)=>n+p.weeks,0),initial.weeks);
 s.profile.minutes=90;const faster=makePlan(s,'2026-10-09');assert.ok(faster.weeks<initial.weeks);
 recordLesson(s,lessons[0].id,true,'2026-10-09');assert.ok(makePlan(s,'2026-10-09').remainingHours<faster.remainingHours);
});
test('Projetos exigem todos os critérios e um link de repositório HTTPS',()=>{
 const s=defaults(),p=projects[0];s.projectProgress[p.id]={checks:[0],url:'https://github.com/a/b'};assert.equal(projectDone(s,p),false);
 s.projectProgress[p.id].checks=p.requirements.map((_,i)=>i);assert.equal(projectDone(s,p),true);
 s.projectProgress[p.id].url='javascript:alert(1)';assert.equal(projectDone(s,p),false);
 assert.equal(safeUrl('https://github.com',true),'');assert.equal(safeUrl('https://user:pass@github.com/a/b',true),'');
});
test('Backup valida esquema, limita campos e recusa nomes herdados e URLs ativas',()=>{
 assert.throws(()=>sanitize({schema:2,app:'futuredev'}));const s=defaults();recordLesson(s,lessons[0].id,true,'2026-10-09');s.drafts.lab='print("backup")';s.profile.minutes=9999;s.applications=[{company:'Teste',url:'javascript:alert(1)'}];
 const raw=JSON.parse(JSON.stringify(s));raw.completed.__proto__={at:'2026-10-09'};raw.completed.fake={at:'2026-10-09'};
 const restored=sanitize(raw);assert.ok(restored.completed[lessons[0].id]);assert.equal(Object.keys(restored.completed).length,1);assert.equal(restored.drafts.lab,s.drafts.lab);assert.equal(restored.profile.minutes,240);assert.equal(restored.applications[0].url,'');
 assert.deepEqual(sanitize(JSON.parse(JSON.stringify(restored))),restored);
});
test('Falha no armazenamento fica visível e não substitui progresso ilegível',()=>{
 let written=false;const broken=new Store({getItem:()=>'{bad',setItem:()=>{written=true;}});assert.ok(broken.error);assert.equal(broken.save(),false);assert.equal(written,false);
 const full=new Store({getItem:()=>null,setItem:()=>{throw new Error('quota');}});assert.equal(full.update(s=>s.xp=60),false);assert.ok(full.error);assert.equal(full.state.xp,60);
 const memory={value:null,getItem(){return this.value;},setItem(key,value){assert.equal(key,STORAGE_KEY);this.value=value;}};const store=new Store(memory);store.update(s=>s.drafts.lab='print(1)');const loaded=new Store(memory);assert.equal(loaded.state.drafts.lab,'print(1)');
});
