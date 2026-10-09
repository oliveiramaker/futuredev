/* Python roda em uma thread separada. Terminar o Worker interrompe loops infinitos. */
let python;
const BASE = 'https://cdn.jsdelivr.net/pyodide/v0.28.3/full/';
async function initialize() {
  self.postMessage({type:'status',message:'Carregando o interpretador Python…'});
  importScripts(`${BASE}pyodide.js`);
  python = await loadPyodide({indexURL:BASE});
  const response = await fetch(new URL('../assets/checker.py', self.location.href));
  if(!response.ok) throw new Error('Não foi possível carregar o avaliador.');
  const source=await response.text();
  await python.loadPackagesFromImports(source);
  await python.runPythonAsync(source);
  self.postMessage({type:'ready',version:python.runPython('sys.version.split()[0]')});
}
const ready = initialize().catch(error => {self.postMessage({type:'init-error',message:error.message});return false;});
self.onmessage = async ({data}) => {
  if(data.type!=='execute') return;
  try {
    await ready;
    self.postMessage({type:'status',message:'Preparando bibliotecas…'});
    await python.loadPackagesFromImports(data.code);
    python.globals.set('_fd_code',data.code);
    python.globals.set('_fd_tests',JSON.stringify(data.tests));
    python.globals.set('_fd_inputs',JSON.stringify(data.inputs));
    const raw=await python.runPythonAsync('json.dumps(await futuredev_execute(_fd_code, json.loads(_fd_tests), json.loads(_fd_inputs)), ensure_ascii=False)');
    self.postMessage({type:'result',id:data.id,result:JSON.parse(raw)});
  } catch(error) {self.postMessage({type:'result',id:data.id,result:{output:'',error:error.message,tests:[]}});}
  finally {if(python){python.globals.delete('_fd_code');python.globals.delete('_fd_tests');python.globals.delete('_fd_inputs');}}
};
