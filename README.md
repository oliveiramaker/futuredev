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

## Comece por aqui

1. Abra o site e entre em **Meu plano** para ajustar tempo, dias e meta. No celular, o ícone de configurações leva às preferências e ao plano.
2. Faça o diagnóstico se já tiver alguma base. Ele não marca aulas como concluídas.
3. Abra a primeira aula, leia o conceito e edite `main.py`.
4. Use **Executar** para observar; use **Verificar exercício** para corrigir e concluir.
5. Volte às revisões e faça a avaliação de cada módulo.
6. Construa os projetos no computador e registre o que você verificou.
7. Exporte um backup regularmente em **Progresso e preferências**.

O interpretador é baixado na primeira execução e requer conexão. Bibliotecas do navegador têm limitações: servidores FastAPI, ambientes virtuais e comandos Git são práticas no computador, identificadas nas aulas. Arquivos e SQLite criados pelo exercício são temporários, isolados por execução. O rascunho do editor e o progresso persistem no navegador.

## Executar localmente

Não há build nem dependências obrigatórias de frontend. Python e Node são necessários somente para desenvolver e verificar o projeto.

```bash
git clone https://github.com/oliveiramaker/futuredev.git
cd futuredev
python -m http.server 4173
```

Abra `http://localhost:4173/`. Não abra `index.html` diretamente por `file://`: módulos, Workers e service workers precisam de HTTP/HTTPS.

## GitHub Pages

O projeto usa caminhos relativos e rotas por hash: funciona tanto em `/futuredev/` quanto na raiz de um domínio.

O fluxo em `.github/workflows/pages.yml` verifica o currículo e publica os arquivos estáticos. Se Pages ainda não estiver habilitado, em **Settings → Pages → Build and deployment → Source**, selecione **GitHub Actions** e execute o workflow **Publish FutureDev**. Essa configuração exige acesso administrativo e pode precisar de uma etapa no GitHub do proprietário.

Alternativamente, selecione **Deploy from a branch**, branch **main**, pasta **/ (root)**. A presença de `.nojekyll` preserva os arquivos estáticos sem processamento Jekyll. Nesse modo, o GitHub cuida da publicação da branch e o workflow continua validando o conteúdo. Se Pages não estiver habilitado, o workflow valida o projeto e indica a configuração inicial necessária, sem tentar um deploy que depende dessa configuração.

Plataforma publicada: [oliveiramaker.github.io/futuredev](https://oliveiramaker.github.io/futuredev/). A publicação atual usa a branch **main**, pasta **/ (root)**; os dois modos acima continuam disponíveis.

## Progresso e banco de dados

Esta versão usa `localStorage`, com esquema versionado e backup validado. É suficiente para a jornada individual em um navegador e permite iniciar no Pages sem uma conta ou backend. **Não há sincronização automática entre aparelhos.**

O código do curso está no Git; o progresso pessoal fica no navegador e não é enviado ao repositório. Ao comprar um domínio, exporte no endereço antigo e restaure no novo. Cada endereço tem seu próprio armazenamento.

Para contas e sincronização, a próxima etapa é acrescentar autenticação e um banco externo com isolamento por usuário. Isso é uma evolução planejada, não um banco já configurado. Consulte [Arquitetura](docs/ARCHITECTURE.md).

## Verificação

```bash
npm test
npm run check
```

São verificados: contratos do currículo, progressão, XP sem duplicação, revisões, datas em São Paulo, plano, URLs, backup e falhas de armazenamento. Todas as soluções e todos os starters são executados pelo mesmo avaliador Python usado no navegador.

Teste opcional com Chromium e Python real no navegador (o teste inicia seu próprio servidor temporário em `/futuredev/`):

```bash
npm install --no-save playwright
npx playwright install chromium
node tests/browser.cjs
```

Se o servidor estiver na pasta pai ou em outra porta, defina `FUTUREDEV_BASE_URL`. O teste inclui todas as 48 soluções, entrada `input()`, interrupção de laços, persistência, avaliações, projetos, candidaturas, backup, layout 320–1440px e leitura offline. Capturas e dados de teste ficam em `test-results/`, ignorado pelo Git.

## Estrutura

| Caminho | Responsabilidade |
| --- | --- |
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
