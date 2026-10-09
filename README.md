> **Versão com contas:** esta branch integra Supabase Auth e banco de dados com publicação na Vercel. A ativação depende de configurar o projeto Supabase e o acesso à Vercel. Consulte [o guia de configuração](docs/cloud-setup.md).

# FutureDev

[**Abrir plataforma**](https://oliveiramaker.github.io/futuredev/)

Plataforma pessoal de aprendizado de Python até a primeira oportunidade profissional. A interface e o conteúdo são em português e funcionam no celular e no computador.

## O que está implementado

- 48 aulas autorais em 12 módulos, com conceitos, exemplos, dicas e exercícios.
- Python real no navegador com Pyodide 0.28.3 em um Web Worker.
- 173 casos de teste de exercícios. Uma aula só é concluída quando todos passam.
- 12 avaliações com 5 perguntas, nota mínima de 80% e correção explicada.
- Diagnóstico de 10 perguntas, revisão dos erros e repetição espaçada.
- 6 projetos de portfólio com briefing, código inicial e critérios de entrega.
- Plano de estudo ajustável, sessão de foco, sequência de prática e XP.
- Ensaio de entrevistas, checklist profissional e acompanhamento de candidaturas.
- Tema claro/escuro, rascunhos salvos, download de código e backup JSON.
- Instalação como PWA e consulta offline de conteúdo após a primeira visita.

Os projetos e entrevistas usam autoavaliação com critérios explícitos. Não há revisão automática de um repositório externo nem correção por IA. O indicador de preparação resume a atividade registrada, sem prometer contratação.

## Identidade visual

A interface segue a identidade do Ecomfy: Space Grotesk, azul cobalto, verde-lima e cartões em lilás, coral e verde-sálvia. O sistema visual está em `assets/ecomfy.css`, sobre a estrutura de layout de `assets/styles.css`. A fonte é local, com a licença SIL OFL em `assets/fonts/OFL.txt`, e é armazenada para consulta offline. Temas, exercícios e dados de progresso usam as mesmas regras da plataforma.

## Comece por aqui

1. Crie sua conta, confirme o e-mail e entre. Abra **Meu plano** para ajustar tempo, dias e meta. No celular, o ícone de configurações leva às preferências e ao plano.
2. Faça o diagnóstico se já tiver alguma base. Ele não marca aulas como concluídas.
3. Abra a primeira aula, leia o conceito e edite `main.py`.
4. Use **Executar** para observar; use **Verificar exercício** para corrigir e concluir.
5. Volte às revisões e faça a avaliação de cada módulo.
6. Construa os projetos no computador e registre o que você verificou.
7. Exporte um backup regularmente em **Progresso e preferências**.

O interpretador é baixado na primeira execução e requer conexão. Bibliotecas do navegador têm limitações: servidores FastAPI, ambientes virtuais e comandos Git são práticas no computador, identificadas nas aulas. Arquivos e SQLite criados pelo exercício são temporários, isolados por execução. O rascunho do editor e o progresso são sincronizados com a conta. Alterações pendentes ficam na memória da sessão até a sincronização.

## Executar localmente

Instale Node.js 24 e as dependências. Configure a URL e a chave pública do projeto Supabase em `.env.local`:

```bash
git clone https://github.com/oliveiramaker/futuredev.git
cd futuredev
npm ci
cp .env.example .env.local
# Preencha SUPABASE_URL e SUPABASE_PUBLISHABLE_KEY em .env.local.
npm run dev
```

Abra `http://localhost:4173/`. O build cria `dist/`, a pasta publicada pela Vercel. O código de origem não deve ser servido diretamente por HTTP sem compilar o SDK.

## Publicação na Vercel e migração do Pages

Consulte [Supabase + Vercel](docs/cloud-setup.md) para aplicar a migração, configurar e-mails, variáveis públicas e URLs de redirecionamento. A versão com contas está preparada na branch `feat/supabase-auth`; a ativação depende de um projeto Supabase próprio e configurado.

O Pages atual é a versão anterior com progresso no navegador. Exporte o backup antes da transição e restaure na conta. Para continuar usando Pages com a versão compilada, selecione **GitHub Actions** e configure `SUPABASE_URL` e `SUPABASE_PUBLISHABLE_KEY` como variáveis do repositório. Publicar a raiz da branch diretamente não compila o SDK.

## Progresso e banco de dados

Esta versão usa Supabase Auth e PostgreSQL. O progresso completo fica em uma linha JSONB por usuário, com esquema versionado, RLS e controle de revisão. A sincronização acontece automaticamente; cada usuário acessa somente seus dados. O SDK guarda apenas a sessão de login no navegador. Backups JSON continuam disponíveis.

O código do curso está no Git; o progresso pessoal fica no banco e não é enviado ao repositório. Para migrar do Pages antigo, exporte o backup e importe uma vez na nova conta. Depois, a mesma conta recupera os dados em outros aparelhos. Ao adicionar um domínio, atualize as URLs de redirecionamento do Supabase.

A integração com contas está implementada. A configuração externa e a validação com e-mails reais são a etapa de ativação. Consulte [Arquitetura](docs/ARCHITECTURE.md).

## Verificação

```bash
npm test
npm run check
```

São verificados: contratos do currículo, progressão, XP sem duplicação, revisões, datas em São Paulo, plano, URLs, backup e falhas de armazenamento. Todas as soluções e todos os starters são executados pelo mesmo avaliador Python usado no navegador.

Teste opcional com Chromium e Python real no navegador (o teste inicia seu próprio servidor temporário em `/futuredev/`):

```bash
npm ci
npx playwright install chromium
npx playwright install chromium
node tests/browser.cjs
```

Se o servidor estiver na pasta pai ou em outra porta, defina `FUTUREDEV_BASE_URL`. O teste inclui todas as 48 soluções, entrada `input()`, interrupção de laços, persistência, avaliações, projetos, candidaturas, backup, layout 320–1440px e leitura offline. Os testes do curso usam Auth sintético e o PostgreSQL real via PGlite. O teste `npm run test:browser` cobre autenticação e sincronização. Capturas e dados de teste ficam em `test-results/`, ignorado pelo Git.

## Estrutura

| Caminho | Responsabilidade |
| --- | --- |
| `assets/ecomfy.css` | Paleta, tipografia e componentes visuais |
| `js/curriculum.js` | Aulas, soluções, testes e perguntas |
| `js/content.js` | Projetos, entrevistas e referências |
| `js/store.js` | Persistência, validação e regras de progresso |
| `js/views.js` | Telas e conteúdo da interface |
| `js/app.js` | Navegação e interações |
| `js/runner.js` | Ciclo do Worker, cancelamento e limites |
| `js/python-worker.js` | Carregamento e execução do Pyodide |
| `assets/checker.py` | Avaliador e casos auxiliares dos exercícios |
| `sw.js` | Cache de conteúdo estático para consulta offline |

## Referências

Conteúdo autoral apoiado nos conceitos da [documentação Python](https://docs.python.org/pt-br/3/), [Git](https://git-scm.com/book/pt-br/v2), [SQLite](https://www.sqlite.org/docs.html), [FastAPI](https://fastapi.tiangolo.com/pt/tutorial/) e [Pyodide](https://pyodide.org/en/stable/). As aulas incluem links para continuar na documentação oficial.
