import { modules, lessons, lessonMap, quizzes, diagnostic } from './curriculum.js';
import { projects, careerChecks, interviewQuestions } from './content.js';

export const STORAGE_KEY = 'futuredev:v1';
export const SCHEMA = 1;
export const allQuestions = Object.assign(Object.create(null), Object.fromEntries(Object.values(quizzes).flat().map(q => [q.id, q])));
const intervals = [1, 3, 7, 14, 30, 60];
export function today(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {timeZone:'America/Sao_Paulo',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(now);
  const p = Object.fromEntries(parts.map(v => [v.type, v.value]));
  return `${p.year}-${p.month}-${p.day}`;
}
export function addDays(day, count) {
  const d = new Date(`${day}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + count);
  return d.toISOString().slice(0,10);
}
export const validDate = value => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T12:00:00Z`)) && new Date(`${value}T12:00:00Z`).toISOString().slice(0,10) === value;
export function defaults() {
  return {schema:SCHEMA,app:'futuredev',profile:{name:'Matheus',minutes:45,days:5,target:`${Number(today().slice(0,4))+1}-12-31`,level:'iniciante',focus:'backend'},completed:{},attempts:{},drafts:{},quizResults:{},questionReviews:{},diagnostic:null,projectProgress:{},careerChecks:[],interviewAnswers:{},applications:[],activity:{},xp:0,focusSeconds:0,theme:'dark',lastLesson:lessons[0].id,createdAt:new Date().toISOString()};
}
const text = (value, max = 1000) => typeof value === 'string' ? value.slice(0,max) : '';
const integer = (value, low, high, fallback = low) => Number.isFinite(Number(value)) ? Math.max(low,Math.min(high,Math.round(Number(value)))) : fallback;
export function safeUrl(value, githubOnly = false) {
  try { const u = new URL(value); if(u.protocol !== 'https:' || u.username || u.password) return ''; if(githubOnly && (u.hostname !== 'github.com' || u.pathname.split('/').filter(Boolean).length < 2)) return ''; return u.href.slice(0,1500); } catch { return ''; }
}
export function sanitize(input) {
  if(!input || input.app !== 'futuredev' || input.schema !== SCHEMA || Array.isArray(input)) throw new Error('Este arquivo não é um backup FutureDev compatível.');
  const s=defaults(), p=input.profile || {};
  s.profile={name:text(p.name,60).trim() || 'Dev',minutes:integer(p.minutes,15,240,45),days:integer(p.days,1,7,5),target:validDate(p.target)?p.target:s.profile.target,level:['iniciante','basico','intermediario'].includes(p.level)?p.level:'iniciante',focus:['backend','automacao','dados'].includes(p.focus)?p.focus:'backend'};
  for(const [id,v] of Object.entries(input.completed || {})) if(lessonMap[id] && v && validDate(v.at)) s.completed[id]={at:v.at,due:validDate(v.due)?v.due:addDays(v.at,1),level:integer(v.level,0,5)};
  for(const [id,v] of Object.entries(input.attempts || {})) if(lessonMap[id]) s.attempts[id]=integer(v,0,100000);
  for(const [id,v] of Object.entries(input.drafts || {})) if(id === 'lab' || lessonMap[id]) s.drafts[id]=text(v,60000);
  for(const [id,v] of Object.entries(input.quizResults || {})) if(Object.hasOwn(quizzes,id) && v) s.quizResults[id]={best:integer(v.best,0,100),last:integer(v.last,0,100),attempts:integer(v.attempts,0,100000),date:validDate(v.date)?v.date:today(),wrong:Array.isArray(v.wrong)?v.wrong.filter(k=>allQuestions[k]).slice(0,5):[]};
  for(const [id,v] of Object.entries(input.questionReviews || {})) if(allQuestions[id] && v) s.questionReviews[id]={due:validDate(v.due)?v.due:today(),level:integer(v.level,0,5)};
  if(input.diagnostic && typeof input.diagnostic==='object') s.diagnostic={score:integer(input.diagnostic.score,0,100),date:validDate(input.diagnostic.date)?input.diagnostic.date:today(),wrong:Array.isArray(input.diagnostic.wrong)?input.diagnostic.wrong.filter(k=>diagnostic.some(q=>q.id===k)).slice(0,10):[]};
  for(const project of projects) {const v=input.projectProgress?.[project.id]; if(v && typeof v === 'object') s.projectProgress[project.id]={checks:Array.isArray(v.checks)?[...new Set(v.checks.filter(n=>Number.isInteger(n)&&n>=0&&n<project.requirements.length))]:[],url:safeUrl(v.url,true),notes:text(v.notes,5000)};}
  s.careerChecks=Array.isArray(input.careerChecks)?[...new Set(input.careerChecks.filter(id=>careerChecks.some(c=>c.id===id)))]:[];
  for(const [id,v] of Object.entries(input.interviewAnswers||{})) if(interviewQuestions.some(q=>q.id===id)) s.interviewAnswers[id]=text(v,5000);
  s.applications=Array.isArray(input.applications)?input.applications.slice(0,200).filter(v=>v&&typeof v==='object').map((v,i)=>({id:text(v.id,100)||`restored-${i}`,company:text(v.company,100),role:text(v.role,150),url:safeUrl(v.url),status:['preparando','enviada','entrevista','encerrada','oferta'].includes(v.status)?v.status:'preparando',date:validDate(v.date)?v.date:today(),next:text(v.next,500)})):[];
  for(const [id,v] of Object.entries(input.activity||{})) if(validDate(id)) s.activity[id]=integer(v,0,100000);
  s.xp=integer(input.xp,0,1000000); s.focusSeconds=integer(input.focusSeconds,0,100000000); s.theme=input.theme==='light'?'light':'dark';
  s.lastLesson=lessonMap[input.lastLesson]?input.lastLesson:lessons[0].id;
  if(typeof input.createdAt==='string'&&!Number.isNaN(Date.parse(input.createdAt))) s.createdAt=input.createdAt;
  return s;
}
export function touch(s, day=today()) {s.activity[day]=(s.activity[day]||0)+1;}
export function recordLesson(s, id, passed, day=today()) {
  if(!lessonMap[id]) throw new Error('Aula não encontrada.');
  s.attempts[id]=(s.attempts[id]||0)+1;
  s.lastLesson=id; touch(s,day);
  if(!passed) return {first:false,review:false};
  const old=s.completed[id];
  if(!old) {s.completed[id]={at:day,due:addDays(day,1),level:0};s.xp+=60;return {first:true,review:false};}
  if(old.due<=day) {old.level=Math.min(5,old.level+1);old.due=addDays(day,intervals[old.level]);s.xp+=10;return {first:false,review:true};}
  return {first:false,review:false};
}
export function grade(questions, answers) {
  if(answers.length!==questions.length || answers.some((a,i)=>!Number.isInteger(a)||a<0||a>=questions[i].options.length)) throw new Error('Responda todas as perguntas antes de corrigir.');
  const results=questions.map((q,i)=>({question:q,answer:answers[i],correct:answers[i]===q.answer}));
  const correct=results.filter(r=>r.correct).length;
  return {score:Math.round(correct/questions.length*100),correct,total:questions.length,results};
}
export function recordQuiz(s, id, result, day=today()) {
  const old=s.quizResults[id];
  if(!Object.hasOwn(quizzes,id)) throw new Error('Avaliação não encontrada.');
  const wrong=result.results.filter(r=>!r.correct).map(r=>r.question.id);
  s.quizResults[id]={best:Math.max(old?.best||0,result.score),last:result.score,attempts:(old?.attempts||0)+1,date:day,wrong};
  if(result.score>=80 && (old?.best||0)<80) s.xp+=40;
  for(const r of result.results) if(!r.correct) s.questionReviews[r.question.id]={due:day,level:0};
  touch(s,day);
}
export function recordDiagnostic(s,result,day=today()) {
  s.diagnostic={score:result.score,date:day,wrong:result.results.filter(r=>!r.correct).map(r=>r.question.id)};
  for(const id of s.diagnostic.wrong) s.questionReviews[id]={due:day,level:0};
  touch(s,day);
}
export function recordQuestionReview(s,id,correct,day=today()) {
  if(!allQuestions[id]) return;
  const old=s.questionReviews[id]||{level:0};
  const level=correct?Math.min(5,old.level+1):0;
  s.questionReviews[id]={level,due:addDays(day,correct?intervals[level]:1)};touch(s,day);
}
export function streak(s,day=today()) {
  let count=0,cursor=s.activity[day]?day:addDays(day,-1);
  while(s.activity[cursor]) {count++;cursor=addDays(cursor,-1);if(count>10000)break;}
  return count;
}
export function moduleProgress(s,id) {const ls=lessons.filter(l=>l.module===id);return {done:ls.filter(l=>s.completed[l.id]).length,total:ls.length,passed:(s.quizResults[id]?.best||0)>=80};}
export const nextLesson = s => lessons.find(l=>!s.completed[l.id]) || lessons[lessons.length-1];
export function dueReviews(s,day=today()) {return {lessons:lessons.filter(l=>s.completed[l.id]?.due<=day),questions:Object.entries(s.questionReviews).filter(([,r])=>r.due<=day).map(([id])=>allQuestions[id]).filter(Boolean)};}
export function projectDone(s,p) {const v=s.projectProgress[p.id];return !!v && p.requirements.every((_,i)=>v.checks.includes(i)) && !!safeUrl(v.url,true);}
export function readiness(s) {
  const complete=lessons.filter(l=>s.completed[l.id]).length;
  const passed=modules.filter(m=>moduleProgress(s,m.id).passed).length;
  const portfolio=projects.filter(p=>projectDone(s,p)).length;
  const career=s.careerChecks.length;
  const score=Math.round((complete/lessons.length*30)+(passed/modules.length*25)+(portfolio/projects.length*35)+(career/careerChecks.length*10));
  return {score,complete,passed,portfolio,career};
}
export function makePlan(s,day=today()) {
  const weekly=s.profile.minutes*s.profile.days/60;
  const remainingModules=modules.map(m=>({...m,remaining:m.hours*(1-moduleProgress(s,m.id).done/4)}));
  const remainingProjects=projects.filter(p=>!projectDone(s,p));
  const remainingHours=remainingModules.reduce((a,m)=>a+m.remaining,0)+remainingProjects.reduce((a,p)=>a+p.hours,0)+8;
  const weeks=Math.ceil(remainingHours/weekly);
  const end=addDays(day,weeks*7);
  const targetDays=Math.floor((new Date(`${s.profile.target}T12:00:00Z`)-new Date(`${day}T12:00:00Z`))/86400000);
  let offset=0;
  const phases=['Fundamentos','Construção','Profissional','Primeira vaga'].map(name=>{
    const ms=remainingModules.filter(m=>m.stage===name);
    const ps=remainingProjects.filter(p=>p.level===name);
    const hours=ms.reduce((a,m)=>a+m.remaining,0)+ps.reduce((a,p)=>a+p.hours,0)+(name==='Primeira vaga'?8:0);
    const start=addDays(day,Math.ceil(offset/weekly)*7);
    const startWeek=Math.ceil(offset/weekly);offset+=hours;
    const endWeek=Math.ceil(offset/weekly);
    return {name,hours:Math.round(hours),weeks:endWeek-startWeek,start,end:addDays(day,endWeek*7),modules:ms};
  });
  return {weekly,remainingHours:Math.round(remainingHours),weeks,end,targetDays,onTime:targetDays>=weeks*7,phases};
}
export class Store {
  constructor(storage) {
    this.storage=storage;this.error='';this.state=defaults();
    try { const raw=storage?.getItem(STORAGE_KEY);if(raw)this.state=sanitize(JSON.parse(raw)); }
    catch {this.error='Não foi possível carregar o progresso salvo. Preserve um backup antes de fazer novas alterações.';this.loadFailed=true;}
  }
  update(fn) {fn(this.state);return this.save();}
  save() {
    if(this.loadFailed) {this.error='O progresso anterior não pôde ser lido. Exporte a sessão atual ou restaure um backup antes de substituir os dados.';return false;}
    try {this.storage.setItem(STORAGE_KEY,JSON.stringify(this.state));this.error='';return true;}
    catch {this.error='O navegador não conseguiu salvar. Exporte um backup para preservar esta sessão.';return false;}
  }
  restore(value) {const next=sanitize(value);this.state=next;this.loadFailed=false;return this.save();}
}
