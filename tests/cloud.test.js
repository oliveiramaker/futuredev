import test from 'node:test';
import assert from 'node:assert/strict';
import {CloudStore} from '../js/cloud-store.js';
import {defaults} from '../js/store.js';
import {publicConfig} from '../scripts/build.mjs';

const copy = value => JSON.parse(JSON.stringify(value));
const fixture = () => {
  let row = null;
  return {
    get row() {return row;},
    async read() {return row ? copy(row) : null;},
    async write(state, revision) {
      if (revision !== (row?.revision || 0)) throw {code:'PT409'};
      row = {state:copy(state), revision:revision+1};
      return copy(row);
    }
  };
};

test('Progresso vem da conta e não depende de armazenamento local', async () => {
  const api = fixture(), first = new CloudStore(api,'a',()=>{},100000);
  await first.load('Ana'); first.update(s=>{s.drafts.lab='print(42)';s.profile.days=6;});
  assert.equal(await first.flush(),true);assert.equal(first.status,'synced');
  const second = new CloudStore(api,'a');await second.load();
  assert.equal(second.state.profile.name,'Ana');assert.equal(second.state.profile.days,6);assert.equal(second.state.drafts.lab,'print(42)');
  first.close();second.close();
});
test('Duas sessões detectam conflito e preservam a tentativa sem sobrescrever a conta', async () => {
  const api=fixture(), a=new CloudStore(api,'a',()=>{},100000), b=new CloudStore(api,'a',()=>{},100000);
  await a.load();await b.load();a.update(s=>s.profile.name='Primeiro');assert.equal(await a.flush(),true);
  b.update(s=>s.profile.name='Segundo');assert.equal(await b.flush(),false);assert.equal(b.status,'conflict');
  assert.equal(b.state.profile.name,'Segundo');assert.equal(api.row.state.profile.name,'Primeiro');
  assert.equal(await b.flush(),false);await b.reload();assert.equal(b.state.profile.name,'Primeiro');assert.equal(b.dirty,false);
  a.close();b.close();
});
test('Falha de rede preserva alterações e permite reenviar sem duplicar a revisão', async () => {
  const api=fixture(), write=api.write;let offline=true;
  api.write=async (...args)=>{if(offline)throw new Error('offline');return write(...args);};
  const s=new CloudStore(api,'a',()=>{},100000);await s.load();s.update(v=>v.xp=60);
  assert.equal(await s.flush(),false);assert.equal(s.dirty,true);assert.equal(s.state.xp,60);
  offline=false;assert.equal(await s.flush(),true);assert.equal(s.revision,1);assert.equal(await s.flush(),true);assert.equal(s.revision,1);s.close();
});
test('Alterações feitas durante uma gravação são enviadas depois da resposta', async () => {
  const api=fixture(), write=api.write;let release;
  api.write=async (...args)=>{await new Promise(resolve=>release=resolve);return write(...args);};
  const s=new CloudStore(api,'a',()=>{},100000);await s.load();s.update(v=>v.xp=60);const flushing=s.flush();
  s.update(v=>v.xp=70);release();await new Promise(resolve=>setTimeout(resolve,0));release();
  assert.equal(await flushing,true);assert.equal(api.row.state.xp,70);assert.equal(s.revision,2);s.close();
});
test('Atualização remota não substitui uma edição feita enquanto a leitura estava em andamento', async () => {
  const api=fixture(), s=new CloudStore(api,'a',()=>{},100000);await s.load();s.update(v=>v.xp=60);await s.flush();
  let release;api.read=()=>new Promise(resolve=>release=resolve);const refreshing=s.refresh();s.update(v=>v.xp=70);
  release({state:defaults(),revision:2});assert.equal(await refreshing,false);assert.equal(s.state.xp,70);s.close();
});
test('Uma resposta atrasada de uma conta encerrada não altera a nova sessão', async () => {
  let release;const s=new CloudStore({read:()=>new Promise(resolve=>release=resolve)},'a');const loading=s.load();s.close();release({state:defaults(),revision:9});await loading;assert.equal(s.ready,false);assert.equal(s.revision,0);
});
test('Compilação recusa chaves privadas e aceita apenas configuração pública', () => {
  const url='https://example.supabase.co';
  assert.throws(()=>publicConfig({}),/Configure/);
  assert.throws(()=>publicConfig({SUPABASE_URL:url,SUPABASE_PUBLISHABLE_KEY:'sb_secret_test'}),/publishable/);
  const jwt=role=>`x.${Buffer.from(JSON.stringify({role})).toString('base64url')}.x`;
  assert.throws(()=>publicConfig({SUPABASE_URL:url,SUPABASE_PUBLISHABLE_KEY:jwt('service_role')}),/publishable/);
  assert.equal(publicConfig({SUPABASE_URL:url,SUPABASE_PUBLISHABLE_KEY:jwt('anon')}).url,url);
});
