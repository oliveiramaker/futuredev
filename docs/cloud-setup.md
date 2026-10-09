# FutureDev: Supabase + Vercel

## O que já está implementado

- Cadastro com nome, e-mail, senha e confirmação de e-mail.
- Login, saída da conta e recuperação de senha.
- Progresso vinculado a `auth.users.id`, protegido por RLS no PostgreSQL.
- Aulas, revisões, avaliações, códigos, projetos, plano, preferências, foco e candidaturas na conta.
- Sincronização automática e atualização ao retomar a janela.
- Controle de revisão: uma sessão antiga não sobrescreve silenciosamente outra.
- Importação explícita do progresso anterior e backup JSON.
- Build estático para Vercel; somente URL e chave pública no navegador.

O banco usa `futuredev_progress`: uma linha por conta, com um snapshot JSONB
versionado do progresso. O snapshot mantém compatibilidade com os backups da
versão anterior. E-mail, senha e sessões ficam sob responsabilidade do Supabase
Auth. O snapshot não contém senhas, tokens de acesso ou refresh tokens.

## 1. Criar um projeto Supabase exclusivo

Crie `futuredev` na organização escolhida, preferencialmente na região São Paulo
(`sa-east-1`). Verifique os limites e custos antes de criar. Não pause, altere
ou reutilize outro aplicativo sem escolher essa opção explicitamente.

Abra o SQL Editor do novo projeto e execute:

`supabase/migrations/20261009181916_futuredev_user_progress.sql`

Também é possível aplicar a migração pelo Supabase CLI, depois de autenticar e
vincular o CLI ao projeto correto. Nunca use uma senha de banco ou chave
`service_role` na aplicação frontend.

Depois confira no banco:

```sql
select relrowsecurity, relforcerowsecurity
from pg_class where oid = 'public.futuredev_progress'::regclass;

select policyname, cmd, roles, qual, with_check
from pg_policies where schemaname = 'public'
and tablename = 'futuredev_progress';

select has_table_privilege('anon', 'public.futuredev_progress', 'SELECT') as anon_read,
       has_table_privilege('authenticated', 'public.futuredev_progress', 'SELECT') as user_read;
```

As duas primeiras flags devem ser `true`; `anon_read` deve ser `false` e
`user_read` deve ser `true`. Confira também os Security Advisors do projeto.

## 2. Configurar Auth

Mantenha o provedor de e-mail/senha e a confirmação de e-mail habilitados.
Em **Authentication → URL Configuration**:

- Site URL: URL de produção exibida pela Vercel após o deploy.
- Redirect URLs: a mesma URL, com `/` ao final, e o endereço local de desenvolvimento
  se você for testar localmente.

Use somente endereços exatos que você controla. Ao adicionar um domínio próprio,
cadastre esse novo endereço também. Não autorize todas as URLs de preview por
meio de um curinga amplo usando o banco de produção.

Configure **SMTP personalizado** para liberar cadastro e recuperação a usuários
reais. O serviço padrão do Supabase tem limites e restrições de destinatários;
ele não substitui a configuração de e-mail de produção. Faça um teste real de
cadastro, confirmação, recuperação e novo login.

## 3. Configurar a Vercel

Importe `oliveiramaker/futuredev`. A configuração está em `vercel.json`:

| Campo | Valor |
| --- | --- |
| Framework | Other |
| Build Command | `npm run build` |
| Install Command | `npm ci` |
| Output Directory | `dist` |
| Node.js | 24.x |

Na Vercel, adicione as variáveis públicas:

| Variável | Origem |
| --- | --- |
| `SUPABASE_URL` | URL do projeto Supabase |
| `SUPABASE_PUBLISHABLE_KEY` | Chave publishable; uma chave anon legada também é aceita |

Use um projeto Supabase de teste em Preview/Development. Não compartilhe
credenciais privadas por chat, Git ou logs. O build rejeita variáveis ausentes e
chaves `secret`/`service_role`, em vez de publicar um login sem configuração.

Enquanto o banco e o acesso à Vercel não estiverem disponíveis, mantenha a
alteração na branch `feat/supabase-auth`. Faça primeiro um deploy dessa branch,
teste com duas contas reais e então integre à `main` para publicar a versão final.

## 4. Levar o progresso antigo

1. No Pages atual, abra **Preferências → Exportar progresso**.
2. Crie sua conta no novo endereço, confirme o e-mail e entre.
3. Abra **Preferências → Restaurar backup** e selecione o JSON exportado.
4. Confira o status **Salvo na sua conta**.
5. Entre na mesma conta em outro aparelho e confira o progresso.

Se a nova versão estiver no mesmo endereço, o botão **Importar progresso deste
navegador** detecta a cópia antiga. A transferência exige sua escolha e confirma
o e-mail da conta de destino. O aplicativo não apaga a cópia local antiga.

## Sessão, conexão e conflitos

O SDK Supabase guarda a sessão de login no navegador para manter o acesso entre
visitas. O progresso novo fica no banco; não é gravado em `futuredev:v1`.
Alterações ainda não sincronizadas ficam somente na memória da sessão. Em uma
falha de rede, o aplicativo informa a pendência e permite tentar novamente ou
exportar um backup. Não feche a página antes disso.

Se outra sessão salvou uma revisão mais recente, o banco responde `409`. O
aplicativo preserva a tentativa atual, permite exportá-la e pede uma escolha antes
de carregar a versão da conta. Não mescla nem descarta silenciosamente trabalhos.

## Validação

```bash
npm ci
npm test
npm run check
npx playwright install chromium
npm run test:browser
```

Os testes de navegador usam o SDK Supabase real, respostas Auth sintéticas e
PostgreSQL via PGlite com a migração de produção e RLS. Verificam cadastro,
recuperação, login, duas contas, dois aparelhos, migração, conflitos, falhas de
rede e backup. Isso valida a integração local; a validação de produção depende
de um projeto Supabase configurado, e-mails entregues e deploy na Vercel.

O avaliador Python também verifica todas as 48 soluções, 173 casos e 48 starters.
