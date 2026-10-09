export class PythonRunner {
  constructor(onStatus=()=>{}) {this.onStatus=onStatus;this.worker=null;this.ready=null;this.pending=null;this.id=0;this.busy=false;this.version='';}
  initialize() {
    if(this.ready) return this.ready;
    this.onStatus('loading','Na primeira execução, o Python precisa ser baixado. Isso pode levar um minuto.');
    this.worker=new Worker(new URL('./python-worker.js',import.meta.url));
    this.ready=new Promise((resolve,reject)=>{
      this.initReject=reject;
      this.initTimer=setTimeout(()=>this.fail('O Python demorou para carregar. Confira a conexão e tente novamente.'),90000);
      this.worker.onmessage=({data})=>{
        if(data.type==='ready') {clearTimeout(this.initTimer);this.version=data.version;this.initReject=null;resolve();}
        else if(data.type==='init-error') this.fail('Não foi possível carregar o Python. Confira a conexão e tente novamente.');
        else if(data.type==='status') this.onStatus(this.busy?'running':'loading',data.message);
        else if(data.type==='result'&&this.pending?.id===data.id) {const pending=this.pending;clearTimeout(this.runTimer);this.pending=null;this.busy=false;this.onStatus('ready',`Python ${this.version} pronto`);pending.resolve(data.result);}
      };
      this.worker.onerror=()=>this.fail('O interpretador foi interrompido. Tente executar novamente.');
    });
    return this.ready;
  }
  async execute(code,tests=[],inputs=[]) {
    if(this.busy) throw new Error('Já existe uma execução em andamento.');
    if(code.length>60000) throw new Error('O código excedeu o limite de 60 mil caracteres.');
    this.busy=true;
    try {
      await this.initialize();
      this.onStatus('running','Executando Python…');
      return await new Promise((resolve,reject)=>{
        const id=++this.id;this.pending={id,resolve,reject};
        this.runTimer=setTimeout(()=>this.fail('Execução interrompida após 12 segundos. Verifique a condição de parada dos seus laços.'),12000);
        this.worker.postMessage({type:'execute',id,code,tests,inputs});
      });
    } catch(error) {this.busy=false;throw error;}
  }
  fail(message) {
    const initReject=this.initReject,pending=this.pending;
    this.initReject=null;this.pending=null;this.worker?.terminate();this.worker=null;this.ready=null;this.busy=false;
    clearTimeout(this.initTimer);clearTimeout(this.runTimer);
    initReject?.(new Error(message));pending?.reject(new Error(message));this.onStatus('error',message);
  }
  stop() {this.fail('Execução interrompida. Seu código continua salvo no editor.');}
}
