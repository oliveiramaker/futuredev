# Arquitetura FutureDev

Frontend em HTML, CSS e JavaScript nativo, compilado com esbuild para dist/.
A Vercel serve os arquivos estáticos. O SDK Supabase oficial, com versão fixa e
lockfile, conecta o cliente ao Auth e ao Data API, que aplica autenticação e RLS.

## Conta e dados

| Responsabilidade | Local |
| --- | --- |
| E-mail, senha, confirmação e recuperação | Supabase Auth |
| Sessão de login e renovação de token | SDK Supabase no navegador |
| Perfil, rotina, meta, tema e tempo de foco | JSONB na conta |
| Aulas, tentativas, XP, avaliações e revisões | JSONB na conta |
| Códigos, projetos, entrevistas e candidaturas | JSONB na conta |
| Alterações aguardando sincronização | Memória da sessão |
| Cópia antiga futuredev:v1 | Navegador, somente para importação explícita |
| Curso e código do site | Git e arquivos estáticos |

futuredev_progress guarda uma linha por auth.users.id, com chave primária e
foreign key com exclusão em cascata. O snapshot JSONB mantém o esquema 1 dos
backups anteriores. O cliente sanitiza leituras e importações; o banco verifica
formato, versão e limite de 5 MiB.

RLS está habilitada e forçada. SELECT, INSERT e UPDATE exigem auth.uid() = user_id.
UPDATE também aplica WITH CHECK, impedindo a troca de dono da linha. anon não
possui privilégios sobre a tabela ou RPC. A função de gravação usa SECURITY
INVOKER com search_path vazio e preserva RLS.

## Sincronização

CloudStore mantém estado em memória, revisão remota e sequência de edições.
Gravações são agrupadas e serializadas. Alterações durante uma requisição são
enviadas numa próxima chamada. A RPC grava somente quando a revisão esperada
corresponde à atual, com operações atômicas no PostgreSQL.

Uma revisão antiga recebe PT409 / HTTP 409. A interface preserva a tentativa,
permite exportá-la e pede uma escolha antes de carregar a versão do servidor.
Falhas de rede não são apresentadas como sucesso. O aviso de saída e o logout
aguardam a sincronização se existem alterações pendentes.

Ao retomar a janela, dados remotos são carregados apenas se não houver edições
pendentes. Chamadas async ficam fora do callback de autenticação do SDK. A troca
de usuário encerra o Worker, timers e estado da interface. Respostas atrasadas
de uma conta encerrada não alteram a nova conta.

## Migração e backups

A associação de progresso antigo a uma conta exige uma escolha explícita,
com confirmação do e-mail de destino. A cópia anterior não é apagada.
Na mudança de Pages para Vercel, exporte o JSON no Pages e restaure na conta.
Depois, o mesmo login recupera os dados em outros aparelhos e domínios autorizados.

## Python e cache

Python roda no aparelho do usuário, com Pyodide 0.28.3 num Worker. Cada execução
cria módulo e diretório temporários, captura entrada/saída, verifica contratos
e interrompe código longo após 12 segundos. Isso isola o estado de aprendizagem;
não é uma barreira antifraude nem um sandbox de backend para código de terceiros.

O service worker guarda apenas arquivos públicos do curso. Respostas Auth/API
e dados pessoais não entram no cache. Uma sessão aberta pode consultar aulas já
carregadas durante uma falha de rede. Login, sincronização e carregamento inicial
do Python precisam de conexão.

## Segurança

Textos do usuário são escapados antes de entrar no HTML. Links externos usam
HTTPS sem credenciais. O frontend recebe somente URL pública e chave publishable
ou anon. O build recusa chaves secret e service_role. Senhas e tokens não entram
no snapshot. Não há tutor por IA ou execução de código do usuário no backend.

## Verificação e ativação

Testes automatizados cobrem RLS, acesso anônimo, troca de dono, revisões, gravações
simultâneas, falhas de rede e troca de conta. Os testes de navegador usam SDK real,
Auth sintético e a migração de produção em PostgreSQL via PGlite. A verificação
com contas e e-mails reais depende de um banco e deploy configurados.
Veja [configuração](cloud-setup.md).
