import {defaults, sanitize} from './store.js';

// The server is authoritative. Pending edits stay in memory, never in a shared
// localStorage progress key. Revision checks prevent cross-device lost updates.
export class CloudStore {
  constructor(api, userId, onChange = () => {}, delay = 500) {
    this.api = api;
    this.userId = userId;
    this.onChange = onChange;
    this.delay = delay;
    this.state = defaults();
    this.revision = 0;
    this.sequence = 0;
    this.savedSequence = 0;
    this.status = 'loading';
    this.error = '';
    this.ready = false;
    this.closed = false;
  }
  get dirty() { return this.sequence !== this.savedSequence; }
  notify(status, error = '') {
    this.status = status;
    this.error = error;
    if (!this.closed) this.onChange(this);
  }
  async load(name = 'Dev') {
    const row = await this.api.read(this.userId);
    if (this.closed) return;
    if (row) { this.state = sanitize(row.state); this.revision = Number(row.revision); }
    else this.state.profile.name = String(name || 'Dev').slice(0, 60);
    this.ready = true;
    this.notify('synced');
  }
  update(fn) {
    if (!this.ready || this.closed) return false;
    fn(this.state);
    return this.save();
  }
  save() {
    if (!this.ready || this.closed) return false;
    this.sequence++;
    if (this.status === 'conflict') return false;
    this.notify('pending');
    clearTimeout(this.timer);
    this.timer = setTimeout(() => { void this.flush(); }, this.delay);
    return true;
  }
  restore(value) { this.state = sanitize(value); return this.save(); }
  async flush() {
    clearTimeout(this.timer);
    if (this.closed || !this.ready || this.status === 'conflict') return false;
    if (this.inFlight) return this.inFlight;
    if (!this.dirty) return true;
    this.inFlight = this.send();
    try { return await this.inFlight; } finally { this.inFlight = null; }
  }
  async send() {
    while (this.dirty && !this.closed) {
      const sequence = this.sequence;
      const snapshot = sanitize(JSON.parse(JSON.stringify(this.state)));
      this.notify('saving');
      try {
        const row = await this.api.write(snapshot, this.revision);
        if (this.closed) return false;
        this.revision = Number(row.revision);
        this.savedSequence = sequence;
      } catch (error) {
        if (this.closed) return false;
        this.notify(error.code === 'PT409' ? 'conflict' : 'error', error.code === 'PT409'
          ? 'Há uma versão mais recente na sua conta. Exporte esta tentativa e carregue o progresso da conta antes de continuar.'
          : 'Não foi possível sincronizar. Suas alterações estão nesta sessão. Tente novamente ou exporte um backup antes de fechar.');
        return false;
      }
    }
    if (!this.closed) this.notify('synced');
    return !this.closed;
  }
  async refresh() {
    if (!this.ready || this.closed || this.dirty || this.inFlight) return false;
    const sequence = this.sequence;
    const row = await this.api.read(this.userId);
    if (this.closed || this.dirty || sequence !== this.sequence) return false;
    if (row && Number(row.revision) > this.revision) {
      this.state = sanitize(row.state);
      this.revision = Number(row.revision);
      this.notify('synced');
      return true;
    }
    return false;
  }
  async reload() {
    if (this.inFlight) await this.inFlight;
    const row = await this.api.read(this.userId);
    if (this.closed) return;
    if (!row) throw new Error('O progresso ainda não está disponível na conta.');
    this.state = sanitize(row.state);
    this.revision = Number(row.revision);
    this.savedSequence = this.sequence;
    this.notify('synced');
  }
  close() { this.closed = true; clearTimeout(this.timer); }
}

export function progressAPI(client) {
  return {
    async read(userId) {
      const {data, error} = await client.from('futuredev_progress')
        .select('state,revision,updated_at').eq('user_id', userId)
        .abortSignal(AbortSignal.timeout(15000)).maybeSingle();
      if (error) throw error;
      return data;
    },
    async write(state, revision) {
      const {data, error} = await client.rpc('save_futuredev_progress', {
        p_state: state, p_expected_revision: revision
      }).abortSignal(AbortSignal.timeout(15000));
      if (error) throw error;
      if (!data || !Number.isSafeInteger(Number(data.revision))) throw new Error('Resposta de sincronização inválida.');
      return data;
    }
  };
}
