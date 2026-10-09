import {createClient} from '@supabase/supabase-js';
import {esc, icon} from './ui.js';

export const syncLabels = {
  loading: 'Carregando sua conta…', synced: 'Salvo na sua conta',
  pending: 'Alterações aguardando sincronização', saving: 'Salvando na sua conta…',
  error: 'Sincronização pendente', conflict: 'Progresso atualizado em outro aparelho'
};
export function createAccountClient(config) {
  return createClient(config.url, config.key, {
    auth: {persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, flowType: 'implicit'},
    global: {headers: {'X-Client-Info': 'futuredev/2.0.0'}}
  });
}
export function authMessage(error) {
  const messages = {
    invalid_credentials: 'E-mail ou senha incorretos.',
    email_not_confirmed: 'Confirme seu e-mail antes de entrar. Verifique também a caixa de spam.',
    user_already_exists: 'Já existe uma conta com este e-mail. Entre ou recupere sua senha.',
    weak_password: 'Use uma senha mais forte, com pelo menos 8 caracteres.',
    over_email_send_rate_limit: 'O limite de envio de e-mails foi atingido. Aguarde para tentar novamente.',
    email_address_not_authorized: 'O envio de e-mails ainda precisa ser configurado pelo responsável pela plataforma.',
    signup_disabled: 'O cadastro ainda não está disponível. Tente mais tarde.',
    bad_jwt: 'Sua sessão expirou. Entre novamente.'
  };
  return messages[error?.code] || 'Não foi possível concluir agora. Verifique sua conexão e tente novamente.';
}
export function accountGate(mode = 'login', message = '', busy = false) {
  const signup = mode === 'signup', forgot = mode === 'forgot', recovery = mode === 'recovery';
  const setup = mode === 'setup', loading = mode === 'loading', failed = mode === 'failed';
  const title = setup ? 'Sua plataforma está sendo conectada.' : loading ? 'Carregando sua jornada…' : failed ? 'Não conseguimos carregar sua conta.' : recovery ? 'Escolha uma nova senha.' : forgot ? 'Vamos recuperar seu acesso.' : signup ? 'Seu futuro começa aqui.' : 'Bom te ver por aqui.';
  return `<main id="main" class="auth-page"><section class="auth-story"><a class="brand" href="#inicio"><span class="brand-mark">f<span>_</span></span><span>FutureDev<small>ESCREVA SEU FUTURO</small></span></a><div><span class="eyebrow">UMA AULA DE CADA VEZ</span><h1>De onde você estiver.<br>Até sua primeira vaga.</h1><p>Aprenda Python, pratique com desafios reais e continue sua jornada no celular ou no computador.</p><div class="auth-orbit" aria-hidden="true"><img src="./assets/orbit-arrow.svg" alt="" width="180" height="180"></div></div><span class="auth-story-foot">Aprender. Praticar. Construir.</span></section><section class="auth-panel"><div class="auth-card"><span class="eyebrow">SEU ESPAÇO</span><h2>${title}</h2><p>${setup ? 'O login será liberado quando a configuração do Supabase estiver concluída.' : loading ? 'Buscando seu plano e seu progresso com segurança.' : failed ? 'Seu progresso permanece na conta. Tente novamente quando a conexão estiver disponível.' : recovery ? 'Use uma senha que você não utiliza em outros sites.' : forgot ? 'Informe seu e-mail para receber o link de recuperação.' : signup ? 'Crie sua conta para guardar cada passo da sua evolução.' : 'Entre para continuar de onde você parou.'}</p>${message ? `<div class="notice compact" role="status">${esc(message)}</div>` : ''}
  ${setup || loading ? '' : failed ? '<button class="button primary full" data-action="retry-account">Tentar novamente</button><button class="button outline full" data-action="logout">Sair da conta</button>' : `<form id="auth-form" data-mode="${mode}">
  ${signup ? '<label class="field-label" for="auth-name">Como podemos te chamar?</label><input id="auth-name" name="name" autocomplete="given-name" maxlength="60" required placeholder="Seu nome">' : ''}
  ${!recovery ? '<label class="field-label" for="auth-email">E-mail</label><input id="auth-email" name="email" type="email" autocomplete="email" required maxlength="254" placeholder="voce@exemplo.com">' : ''}
  ${!forgot ? `<label class="field-label" for="auth-password">${recovery ? 'Nova senha' : 'Senha'}</label><input id="auth-password" name="password" type="password" autocomplete="${signup || recovery ? 'new-password' : 'current-password'}" ${signup || recovery ? 'minlength="8"' : ''} maxlength="256" required placeholder="${signup || recovery ? 'Pelo menos 8 caracteres' : 'Sua senha'}">` : ''}
  ${signup || recovery ? '<label class="field-label" for="auth-confirm">Confirmar senha</label><input id="auth-confirm" name="confirm" type="password" autocomplete="new-password" minlength="8" maxlength="256" required>' : ''}
  <button type="submit" class="button primary full" ${busy ? 'disabled' : ''}>${busy ? 'Aguarde…' : recovery ? 'Salvar nova senha' : forgot ? 'Enviar link de recuperação' : signup ? 'Criar minha conta' : 'Entrar na minha conta'} ${icon('chevron',18)}</button>
  </form>${mode === 'login' ? '<button class="text-link" data-action="auth-forgot">Esqueci minha senha</button><div class="auth-switch">Ainda não tem conta? <button class="text-link" data-action="auth-signup">Criar conta</button></div>' : !recovery ? '<div class="auth-switch"><button class="text-link" data-action="auth-login">Voltar para entrar</button></div>' : ''}`}
  <p class="auth-privacy">Seu progresso pertence à sua conta. Sua senha é protegida pelo Supabase Auth.</p></div></section></main>`;
}
export function accountPanel(user, cloud, legacyAvailable) {
  return `<section class="card account-card"><div class="section-title"><h2>Sua conta</h2><span class="pill">${esc(syncLabels[cloud.status])}</span></div><p>${esc(user.email || '')}</p><p>Aulas, rascunhos, avaliações, projetos e plano ficam salvos na sua conta e acompanham você em outros aparelhos.</p><div class="account-actions"><button class="button outline small" data-action="sync-now">Sincronizar agora</button><button class="button outline small" data-action="logout">Sair da conta</button></div>${legacyAvailable ? '<div class="notice"><div><strong>Tem progresso salvo neste navegador?</strong><p>Você pode transferir os dados da versão anterior para esta conta. Se estiver vindo do Pages, exporte o backup lá e use Restaurar backup abaixo.</p><button class="button outline small" data-action="import-local">Importar progresso deste navegador</button></div></div>' : ''}</section>`;
}
