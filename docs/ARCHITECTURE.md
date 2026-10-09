# Arquitetura e evolução

## Versão atual

Frontend estático em HTML, CSS e JavaScript nativo. Sem framework, etapa de build ou chave privada no frontend. Aulas e correção de código funcionam no GitHub Pages. O interpretador Python usa WebAssembly em um Worker, separado da interface. A execução pode ser encerrada pelo usuário e tem um limite de 12 segundos após carregar o interpretador. A saída de código tem limite de 16 mil caracteres. O carregamento inicial tem prazo de 90 segundos e pode ser repetido após erro.

O avaliador cria um módulo e um diretório temporários por execução. Define entradas controladas para `input()`, captura stdout/stderr e verifica expressões de contrato. Há suporte a funções assíncronas e top-level await. Isso é isolamento de estado para aprendizado; não é uma barreira antifraude e não deve ser usado como sandbox de backend para código de terceiros.

Progresso em `localStorage` na chave `futuredev:v1`. O esquema 1 guarda perfil, rascunhos, aulas, tentativas, avaliações, revisões, projetos, respostas de entrevista, candidaturas, atividade e aparência. Importações reconstroem o esquema, limitam campos, rejeitam URLs não HTTPS e descartam IDs desconhecidos. Falhas de leitura ou escrita aparecem na interface. Um estado ilegível não é sobrescrito automaticamente.

Os textos do usuário são escapados antes de renderizar HTML. Links externos usam HTTPS sem credenciais. O código digitado roda localmente no Worker; não há envio para um serviço de IA. O CDN recebe requisições de download do interpretador, não o progresso pessoal. Código Python escrito pelo próprio usuário pode fazer requisições de rede se isso for implementado por ele.

O service worker usa rede primeiro e cache como alternativa para arquivos do mesmo endereço. Não armazena o CDN Python como pacote offline completo. A consulta de aulas offline é diferente da execução Python offline.

## Por que começar sem banco remoto

O uso inicial é individual. Um banco não é necessário para servir aulas e testar Python localmente. Isso reduz configuração e permite começar agora. A limitação é o progresso por navegador, tratado com backup e restauração. A ausência de conta não oferece sincronização e não deve ser apresentada como se oferecesse.

## Quando adicionar um banco

Contas, recuperação automática, vários aparelhos e um tutor online exigem um serviço externo. O frontend pode continuar no Pages ou migrar de hospedagem depois. Um domínio próprio muda o endereço; por si só, não acrescenta um backend.

Uma implementação futura pode usar PostgreSQL com um provedor de autenticação (por exemplo, Supabase) ou uma API Python com PostgreSQL. Nenhum projeto de banco foi criado ou vinculado nesta versão.

Modelo proposto:

| Entidade | Dados |
| --- | --- |
| profiles | usuário autenticado, rotina, objetivo, fuso |
| lesson_progress | usuário, aula, primeira conclusão, tentativas, revisão |
| quiz_attempts | usuário, avaliação, respostas, resultado, data |
| code_drafts | usuário, aula/laboratório, código, data de alteração |
| project_progress | usuário, projeto, critérios, link, notas |
| applications | usuário, empresa, cargo, status, próximo passo |

Requisitos para essa etapa: autenticação, política por usuário em todas as tabelas, acesso anônimo recusado para dados pessoais, controle de conflito entre aparelhos e migração consentida do backup local. Chaves privadas e service-role nunca vão para o Pages. Uma API com tutor por IA deve proteger chaves, custos e dados no backend; não há um tutor por IA na versão atual.

## Domínio próprio

1. Faça backup no endereço atual antes da migração.
2. Cadastre o domínio em Settings → Pages no GitHub.
3. Use os registros DNS indicados pelo GitHub e pelo registrador, conforme o tipo de domínio. Confira a documentação atual antes de alterar DNS.
4. Verifique o domínio e HTTPS.
5. Restaure o backup no novo endereço.

O projeto usa URLs relativas e rotas `#`, sem um prefixo fixo `/futuredev`. Não foi criado um CNAME com domínio fictício.
