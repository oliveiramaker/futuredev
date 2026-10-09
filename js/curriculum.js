// Conteúdo autoral. Os testes verificam comportamento, não o texto do código.
export const modules = [
  { id: 'm01', title: 'Primeiros passos', label: '01', stage: 'Fundamentos', hours: 6, description: 'Entenda o que o Python faz. Escreva, execute e transforme dados.' },
  { id: 'm02', title: 'Decisões e repetições', label: '02', stage: 'Fundamentos', hours: 7, description: 'Construa regras e automatize tarefas que se repetem.' },
  { id: 'm03', title: 'Organizando informações', label: '03', stage: 'Fundamentos', hours: 7, description: 'Listas, dicionários e conjuntos para lidar com dados reais.' },
  { id: 'm04', title: 'Funções e organização', label: '04', stage: 'Fundamentos', hours: 8, description: 'Divida problemas e escreva código que pode ser reutilizado.' },
  { id: 'm05', title: 'Código confiável', label: '05', stage: 'Construção', hours: 9, description: 'Encontre erros, teste comportamentos e pense em eficiência.' },
  { id: 'm06', title: 'Arquivos e dados', label: '06', stage: 'Construção', hours: 9, description: 'Leia relatórios, trabalhe com JSON e cuide de datas e valores.' },
  { id: 'm07', title: 'Orientação a objetos', label: '07', stage: 'Construção', hours: 8, description: 'Modele produtos e serviços sem complicar o que é simples.' },
  { id: 'm08', title: 'SQL e banco de dados', label: '08', stage: 'Construção', hours: 10, description: 'Salve, consulte e relacione dados com SQLite e SQL.' },
  { id: 'm09', title: 'Rotina de desenvolvimento', label: '09', stage: 'Profissional', hours: 8, description: 'Terminal, ambiente virtual, Git, dependências e documentação.' },
  { id: 'm10', title: 'APIs e backend', label: '10', stage: 'Profissional', hours: 12, description: 'HTTP, validação, FastAPI e código assíncrono.' },
  { id: 'm11', title: 'Automação na prática', label: '11', stage: 'Profissional', hours: 10, description: 'Transforme relatórios em decisões com processos reproduzíveis.' },
  { id: 'm12', title: 'Entrevistas e desafios', label: '12', stage: 'Primeira vaga', hours: 10, description: 'Explique suas escolhas e resolva problemas sem decorar respostas.' }
];
const t = (label, expr) => ({ label, expr });
const q = (id, prompt, options, answer, explanation) => ({ id, prompt, options, answer, explanation });
const lessons = [];
function L(module, slug, title, concept, walkthrough, example, task, starter, solution, tests, hints, extra = {}) {
  lessons.push({ id: `${module}-${slug}`, module, title, minutes: 30, concept, walkthrough, example, task, starter, solution, tests, hints, ...extra });
}

L('m01', 'ola', 'Seu primeiro programa',
  'Programar é descrever passos que o computador consegue executar. Python lê as instruções em ordem. print() escreve uma informação na saída: isso permite observar o que o seu programa fez.',
  'Texto precisa ficar entre aspas. Os parênteses recebem o valor que será exibido. Execute o exemplo, altere a mensagem e execute novamente: mudar o código e observar o resultado é parte do aprendizado.',
  'print("Olá, mundo!")\nprint("Estou aprendendo Python.")',
  'Escreva um programa que imprima exatamente duas linhas: na primeira, Olá, FutureDev!; na segunda, Meu primeiro passo em Python. Respeite maiúsculas e pontuação.',
  '# Escreva seu programa abaixo\n',
  'print("Olá, FutureDev!")\nprint("Meu primeiro passo em Python.")',
  [t('Primeira mensagem', '__output.splitlines()[0] == "Olá, FutureDev!"'), t('Segunda mensagem', '__output.splitlines()[1] == "Meu primeiro passo em Python."'), t('Somente duas linhas', 'len(__output.splitlines()) == 2')],
  ['Use um print() para cada linha.', 'As mensagens são strings: coloque-as entre aspas.'],
  { minutes: 15, pitfall: 'Olá sem aspas é tratado como nome de variável e causa um erro. O ponto e a exclamação fazem parte do texto.' });

L('m01', 'variaveis', 'Variáveis e tipos',
  'Uma variável é um nome que aponta para um valor. = atribui; não significa uma comparação. Strings guardam texto, int guarda números inteiros, float guarda números decimais e bool guarda True ou False.',
  'Escolha nomes que expliquem o significado do dado. quantidade = 100 é mais claro que q = 100. Use type() para investigar um valor. Python distingue o inteiro 100 do texto "100".',
  'produto = "Sacola"\nquantidade = 100\npreco = 12.50\ndisponivel = True\nprint(produto, quantidade, type(quantidade).__name__)',
  'Crie produto com o texto Sacola, quantidade com o inteiro 100, preco com o decimal 12.5 e disponivel com o booleano True.',
  '# Declare as quatro variáveis\n',
  'produto = "Sacola"\nquantidade = 100\npreco = 12.5\ndisponivel = True',
  [t('Nome do produto', 'produto == "Sacola"'),t('Quantidade inteira', 'quantidade == 100 and type(quantidade) is int'),t('Preço numérico', 'preco == 12.5 and type(preco) is float'),t('Disponibilidade booleana', 'disponivel is True')],
  ['Strings usam aspas; os números não.', 'True começa com letra maiúscula em Python.'], { pitfall: 'No código Python, o separador decimal é ponto: 12.5. Nomes não podem começar com um número.' });

L('m01', 'numeros', 'Cálculos que resolvem problemas',
  'Python oferece +, -, *, /, //, % e **. / faz divisão, // faz divisão inteira e % dá o resto. Parênteses deixam clara a ordem do cálculo. Misturar preço por pacote com preço por unidade costuma gerar um erro de negócio.',
  'Neste exemplo, o custo de 100 unidades vem da multiplicação. A margem sobre a venda é diferente do acréscimo sobre o custo. Primeiro nomeie as grandezas; depois traduza a fórmula para código.',
  'custo_unitario = 0.05\nquantidade = 100\ncusto_total = custo_unitario * quantidade\nprint(custo_total)\nprint(10 / 4, 10 // 4, 10 % 4)',
  'Crie custo_unitario = 0.05 e quantidade = 100. Calcule custo_total usando essas variáveis. Calcule pacotes_completos e unidades_restantes ao dividir 235 unidades em pacotes de 100.',
  'custo_unitario = 0.05\nquantidade = 100\n# Calcule custo_total, pacotes_completos e unidades_restantes\n',
  'custo_unitario = 0.05\nquantidade = 100\ncusto_total = custo_unitario * quantidade\npacotes_completos = 235 // 100\nunidades_restantes = 235 % 100',
  [t('Custo de 100 unidades', 'abs(custo_total - 5) < 1e-9'),t('Pacotes inteiros', 'pacotes_completos == 2'),t('Restante', 'unidades_restantes == 35')],
  ['Multiplique o custo pela quantidade.', 'Use // para os pacotes e % para o resto.'], { pitfall: 'float pode ter pequenas diferenças de precisão. Para dinheiro em aplicações reais, você aprenderá Decimal no módulo 6.' });

L('m01', 'texto', 'Texto, conversão e entrada',
  'input() sempre devolve uma string. int() e float() convertem texto em número quando o formato é válido. strip() remove espaços nas pontas; lower() converte letras para minúsculas. f-strings combinam texto e variáveis.',
  'No laboratório, preencha as entradas de input() no campo de entradas, uma por linha. A função do exercício recebe valores por parâmetros para que possamos testá-la com vários exemplos.',
  'nome = "  Ana  ".strip()\nquantidade = int("100")\nprint(f"{nome} pediu {quantidade} unidades.")\n# Experimente no laboratório:\n# nome = input("Qual é seu nome? ")',
  'Complete apresentar(nome, quantidade_texto). Remova espaços do nome, converta a quantidade para inteiro e retorne a mensagem Nome pediu N unidades. Use o nome recebido, sem fixar um exemplo.',
  'def apresentar(nome, quantidade_texto):\n    # Retorne a mensagem formatada\n    pass\n',
  'def apresentar(nome, quantidade_texto):\n    nome = nome.strip()\n    quantidade = int(quantidade_texto)\n    return f"{nome} pediu {quantidade} unidades."',
  [t('Limpa os espaços', 'apresentar("  Ana  ", "100") == "Ana pediu 100 unidades."'),t('Outra pessoa', 'apresentar("Matheus", "5") == "Matheus pediu 5 unidades."'),t('Converte zeros iniciais', 'apresentar("Bia", "003") == "Bia pediu 3 unidades."')],
  ['Você pode usar nome.strip() e int(quantidade_texto).', 'return entrega a resposta da função; print apenas a exibe.'], { pitfall: '"10" + "5" resulta em "105". Converta as strings antes de fazer um cálculo.' });

L('m02', 'condicionais', 'Decisões com if, elif e else',
  'Uma condição é uma expressão que resulta em verdadeiro ou falso. if executa um bloco quando a condição é verdadeira. elif testa uma alternativa. else cuida dos demais casos. A indentação define quais linhas pertencem a cada bloco.',
  'Pense primeiro nas fronteiras: 100 pertence à faixa de desconto? 500 pertence à faixa maior? Teste esses valores exatamente. A ordem das condições pode fazer uma faixa esconder outra.',
  'quantidade = 500\nif quantidade >= 500:\n    desconto = 0.10\nelif quantidade >= 100:\n    desconto = 0.05\nelse:\n    desconto = 0\nprint(desconto)',
  'Implemente desconto(quantidade): retorne 0.10 para 500 ou mais; 0.05 para 100 a 499; 0 para menos de 100.',
  'def desconto(quantidade):\n    pass\n',
  'def desconto(quantidade):\n    if quantidade >= 500:\n        return 0.10\n    elif quantidade >= 100:\n        return 0.05\n    return 0',
  [t('Abaixo do limite', 'desconto(99) == 0'),t('Limite de 100', 'desconto(100) == 0.05'),t('Antes de 500', 'desconto(499) == 0.05'),t('Limite de 500', 'desconto(500) == 0.10')],
  ['Comece testando a faixa mais alta.', 'A condição >= inclui o próprio limite.'], { pitfall: '== compara; = atribui. Use quatro espaços para cada nível de indentação.' });

L('m02', 'logica', 'Regras com and, or e not',
  'and exige que as duas condições sejam verdadeiras. or aceita pelo menos uma. not inverte um valor lógico. Comparações como >, <= e == podem ser combinadas para descrever uma regra de negócio.',
  'Um pedido só pode sair se houver pagamento e estoque suficiente. Os limites precisam fazer parte da regra: estoque igual à quantidade ainda é suficiente. Não transforme um texto "False" em bool esperando obter False: textos não vazios são verdadeiros.',
  'pago = True\nestoque = 100\nquantidade = 100\npode_enviar = pago and estoque >= quantidade\nprint(pode_enviar)',
  'Implemente pode_enviar(pago, estoque, quantidade). Retorne True somente quando pago for verdadeiro, quantidade for maior que zero e estoque for suficiente.',
  'def pode_enviar(pago, estoque, quantidade):\n    pass\n',
  'def pode_enviar(pago, estoque, quantidade):\n    return bool(pago and quantidade > 0 and estoque >= quantidade)',
  [t('Pedido válido', 'pode_enviar(True, 10, 10) is True'),t('Sem pagamento', 'pode_enviar(False, 10, 2) is False'),t('Sem estoque', 'pode_enviar(True, 3, 4) is False'),t('Quantidade zero', 'pode_enviar(True, 10, 0) is False')],
  ['São três condições ligadas por and.', 'Não esqueça quantidade > 0.'], { pitfall: 'or permitiria enviar um pedido só por estar pago, mesmo sem estoque.' });

L('m02', 'for', 'Repetições com for e range',
  'for percorre uma sequência. range(inicio, fim) produz inteiros sem incluir o fim. Um acumulador começa com um valor neutro, como 0 para somas, e é atualizado a cada repetição.',
  'Ao somar de 1 até n, o último número precisa entrar no intervalo: range(1, n + 1). Observe uma execução pequena no papel para entender o estado do acumulador em cada volta.',
  'total = 0\nfor numero in range(1, 4):\n    total += numero\n    print(numero, total)',
  'Implemente somar_ate(n): retorne a soma dos inteiros de 1 até n, incluindo n. Para n = 0, retorne 0. Use uma repetição para praticar.',
  'def somar_ate(n):\n    total = 0\n    # Complete a repetição\n    return total\n',
  'def somar_ate(n):\n    total = 0\n    for numero in range(1, n + 1):\n        total += numero\n    return total',
  [t('Sequência pequena', 'somar_ate(3) == 6'),t('Um número', 'somar_ate(1) == 1'),t('Intervalo vazio', 'somar_ate(0) == 0'),t('Mais números', 'somar_ate(100) == 5050')],
  ['O limite final de range não é incluído.', 'Acumule total += numero dentro do for.'], { pitfall: 'Um return dentro do for encerraria a função já na primeira volta.' });

L('m02', 'while', 'while e condições de parada',
  'while repete enquanto uma condição for verdadeira. Diferente de for, é útil quando o número de voltas não é conhecido de antemão. O corpo precisa alterar o estado que controla a condição, ou pode repetir para sempre.',
  'Simule a produção: a cada ciclo, somamos a capacidade. Quando o total alcança a meta, paramos. Valide capacidade > 0 antes do laço. O botão Parar do laboratório encerra uma execução que não termina.',
  'produzido = 0\nciclos = 0\nwhile produzido < 250:\n    produzido += 100\n    ciclos += 1\nprint(ciclos)',
  'Implemente ciclos_para(meta, capacidade). Retorne quantos ciclos são necessários para alcançar a meta. Meta zero ou negativa exige 0 ciclos. Capacidade zero ou negativa deve gerar ValueError.',
  'def ciclos_para(meta, capacidade):\n    pass\n',
  'def ciclos_para(meta, capacidade):\n    if capacidade <= 0:\n        raise ValueError("Capacidade deve ser positiva")\n    produzido = ciclos = 0\n    while produzido < meta:\n        produzido += capacidade\n        ciclos += 1\n    return ciclos',
  [t('Meta não exata', 'ciclos_para(250, 100) == 3'),t('Meta exata', 'ciclos_para(300, 100) == 3'),t('Sem produção necessária', 'ciclos_para(0, 100) == 0'),t('Capacidade inválida', '__raises(ValueError, ciclos_para, 10, 0)')],
  ['Crie um contador e um total produzido.', 'Valide a capacidade antes de repetir.'], { pitfall: 'Se esquecer de atualizar produzido, a condição nunca ficará falsa.' });

L('m03', 'listas', 'Listas e índices',
  'Uma lista guarda vários valores em ordem. Os índices começam em zero. append() acrescenta um item, len() mede a quantidade e uma fatia seleciona um trecho. Listas podem ser alteradas; isso exige cuidado com efeitos sobre os dados originais.',
  'Separar filtrar de modificar é útil: construa uma nova lista de pedidos grandes e preserve a original. Testes podem verificar tanto a resposta quanto a ausência de alterações inesperadas.',
  'pedidos = [20, 100, 50]\nprint(pedidos[0])\npedidos.append(200)\nprint(pedidos[:2], len(pedidos))',
  'Implemente pedidos_grandes(quantidades): retorne uma nova lista com as quantidades maiores ou iguais a 100, na ordem original. Não altere a lista recebida.',
  'def pedidos_grandes(quantidades):\n    resultado = []\n    # Selecione as quantidades\n    return resultado\n',
  'def pedidos_grandes(quantidades):\n    resultado = []\n    for quantidade in quantidades:\n        if quantidade >= 100:\n            resultado.append(quantidade)\n    return resultado',
  [t('Filtra e mantém a ordem', 'pedidos_grandes([20, 100, 50, 200]) == [100, 200]'),t('Lista vazia', 'pedidos_grandes([]) == []'),t('Nenhum pedido grande', 'pedidos_grandes([1, 99]) == []'),t('Preserva entrada', '__unchanged(pedidos_grandes, [10, 100, 200])')],
  ['Faça append() na lista resultado, não na lista recebida.', 'Uma lista vazia também é uma resposta válida.'], { pitfall: 'Acessar lista[3] em uma lista de três itens gera IndexError: o último índice é 2.' });

L('m03', 'dicionarios', 'Dicionários para estoque e vendas',
  'Um dicionário associa uma chave a um valor: {"SKU-A": 10}. É ideal para consultar quantidades por SKU. get(chave, padrao) devolve um valor padrão quando a chave não existe. items() permite percorrer chave e valor.',
  'Para agrupar vendas, cada linha acrescenta uma quantidade ao acumulado daquele SKU. Esse padrão aparece em relatórios: o mesmo produto pode estar em várias linhas, mas o resultado deve ter uma única chave.',
  'estoque = {"SAC-20": 100, "SAC-30": 50}\nprint(estoque.get("SAC-20", 0))\nprint(estoque.get("NOVO", 0))\nfor sku, quantidade in estoque.items():\n    print(sku, quantidade)',
  'Implemente agrupar_vendas(vendas). Cada venda é um dicionário com sku e quantidade. Retorne um dicionário com a soma das quantidades por SKU.',
  'def agrupar_vendas(vendas):\n    totais = {}\n    # Some por SKU\n    return totais\n',
  'def agrupar_vendas(vendas):\n    totais = {}\n    for venda in vendas:\n        sku = venda["sku"]\n        totais[sku] = totais.get(sku, 0) + venda["quantidade"]\n    return totais',
  [t('Agrupa SKUs repetidos', 'agrupar_vendas([{"sku":"A","quantidade":2},{"sku":"B","quantidade":3},{"sku":"A","quantidade":4}]) == {"A":6,"B":3}'),t('Sem vendas', 'agrupar_vendas([]) == {}'),t('Uma venda', 'agrupar_vendas([{"sku":"X","quantidade":0}]) == {"X":0}')],
  ['Use totais.get(sku, 0) para a primeira ocorrência.', 'Leia venda["quantidade"] e some ao total existente.'], { pitfall: 'Substituir totais[sku] pela quantidade atual perde as vendas anteriores.' });

L('m03', 'conjuntos', 'Conjuntos e tuplas',
  'set guarda valores únicos e serve para verificar presença e comparar grupos. Uma tupla agrupa valores em uma estrutura imutável. Sets não têm uma ordem de apresentação garantida: se a saída precisa ser ordenada, use sorted().',
  'Dois relatórios podem compartilhar SKUs. A interseção & identifica os comuns; a diferença - identifica o que só está em um grupo. Converter uma lista em set remove repetições.',
  'ontem = {"A", "B", "C"}\nhoje = {"B", "C", "D"}\nprint(sorted(ontem & hoje))\nprint(sorted(hoje - ontem))\nmedidas = (20, 30)',
  'Implemente novos_skus(anteriores, atuais): retorne uma lista ordenada com os SKUs que aparecem em atuais, mas não em anteriores. Elimine duplicatas.',
  'def novos_skus(anteriores, atuais):\n    pass\n',
  'def novos_skus(anteriores, atuais):\n    return sorted(set(atuais) - set(anteriores))',
  [t('Somente novos', 'novos_skus(["A","B"], ["B","C","D","C"]) == ["C","D"]'),t('Nenhum novo', 'novos_skus(["A"], ["A"]) == []'),t('Ordena resultado', 'novos_skus([], ["Z","A","Z"]) == ["A","Z"]')],
  ['Transforme os dois grupos em sets.', 'Use diferença e depois sorted().'], { pitfall: 'Um set vazio é set(). {} cria um dicionário vazio.' });

L('m03', 'compreensoes', 'Compreensões e transformações',
  'Uma compreensão de lista descreve uma transformação e, opcionalmente, um filtro: [expressao for item in sequencia if condicao]. É uma forma concisa de criar uma lista sem mudar a entrada.',
  'A transformação vem antes do for e o filtro depois. Leia como: para cada preço positivo, calcule o preço com desconto. Se ficar difícil explicar uma compreensão, prefira um laço explícito.',
  'precos = [10, -5, 20]\nvalidos = [round(p * 0.9, 2) for p in precos if p > 0]\nprint(validos)',
  'Implemente com_desconto(precos): ignore valores negativos e zero; aplique 10% de desconto nos demais; arredonde cada resultado para duas casas. Preserve a ordem.',
  'def com_desconto(precos):\n    pass\n',
  'def com_desconto(precos):\n    return [round(preco * 0.9, 2) for preco in precos if preco > 0]',
  [t('Transforma e filtra', 'com_desconto([10, -5, 20, 0]) == [9.0, 18.0]'),t('Arredonda', 'com_desconto([12.99]) == [11.69]'),t('Entrada vazia', 'com_desconto([]) == []')],
  ['O filtro é if preco > 0.', 'round(valor, 2) controla as casas decimais.'], { pitfall: 'Não acumule muitas regras em uma única expressão só para economizar linhas.' });

L('m04', 'funcoes', 'Funções, parâmetros e retorno',
  'Uma função reúne um comportamento com nome. Parâmetros recebem entradas; return entrega uma saída. Quem chama a função pode usar a resposta em outro cálculo. Uma função sem return devolve None.',
  'Separe regra de negócio de apresentação. A função calcula um valor, e o código que a chama decide como exibi-lo. Assim, o mesmo cálculo atende uma tela, um relatório e uma API.',
  'def custo_total(quantidade, unitario):\n    return quantidade * unitario\n\ntotal = custo_total(100, 0.05)\nprint(f"Custo: R$ {total:.2f}")',
  'Implemente lucro(preco, custo, taxa): retorne preco menos custo menos preco multiplicado pela taxa. taxa é uma fração (0.10 significa 10%).',
  'def lucro(preco, custo, taxa):\n    pass\n',
  'def lucro(preco, custo, taxa):\n    return preco - custo - preco * taxa',
  [t('Venda com taxa', 'abs(lucro(20, 8, 0.10) - 10) < 1e-9'),t('Sem taxa', 'lucro(10, 7, 0) == 3'),t('Prejuízo', 'lucro(5, 7, 0) == -2')],
  ['A taxa incide sobre o preço da venda.', 'Use return para entregar um número.'], { pitfall: 'Imprimir o lucro e não retorná-lo impede que outro código use o resultado.' });

L('m04', 'padroes', 'Argumentos padrão e nomeados',
  'Um parâmetro pode ter um valor padrão. Argumentos nomeados deixam chamadas mais claras: calcular(preco=20, taxa=0.1). Valores padrão são criados uma vez, na definição da função; listas mutáveis como padrão podem compartilhar estado entre chamadas.',
  'Para uma lista opcional, use None e crie uma nova lista no corpo. Quando receber uma lista do chamador, decida explicitamente se a função vai modificá-la. Aqui devolveremos uma cópia.',
  'def saudacao(nome, prefixo="Olá"):\n    return f"{prefixo}, {nome}!"\n\nprint(saudacao("Ana"))\nprint(saudacao(nome="Bia", prefixo="Bom dia"))',
  'Implemente adicionar(item, itens=None): crie uma lista vazia quando itens for None; devolva uma nova lista com item no final. Não altere a lista recebida e não compartilhe dados entre chamadas.',
  'def adicionar(item, itens=None):\n    pass\n',
  'def adicionar(item, itens=None):\n    resultado = list(itens) if itens is not None else []\n    resultado.append(item)\n    return resultado',
  [t('Lista opcional', 'adicionar("A") == ["A"]'),t('Lista fornecida', 'adicionar("B", ["A"]) == ["A","B"]'),t('Chamadas independentes', 'adicionar("X") == ["X"] and adicionar("Y") == ["Y"]'),t('Preserva entrada', '__unchanged(lambda xs: adicionar("C", xs), ["A"])')],
  ['Copie itens usando list(itens).', 'Evite definir itens=[] no cabeçalho.'], { pitfall: 'Um padrão mutável pode guardar dados de uma chamada anterior.' });

L('m04', 'tipagem', 'Escopo, docstrings e tipos',
  'Variáveis criadas dentro de uma função normalmente pertencem ao escopo local. Anotações como valor: float e -> float documentam o contrato, mas não validam entradas automaticamente. Uma docstring explica propósito, parâmetros e regras importantes.',
  'A função deve depender das entradas declaradas, não de uma variável global escondida. Nomeie unidades e formato do retorno. A validação de dados ainda precisa ser escrita ou feita por uma biblioteca adequada.',
  'def area(largura: float, altura: float) -> float:\n    """Calcula a área em metros quadrados."""\n    return largura * altura\n\nprint(area(2, 3))',
  'Implemente peso_kg(largura_cm: float, altura_cm: float, espessura_micra: float) -> float. Use duas faces, densidade de 920 kg/m³, cm/100 para metros e micra/1_000_000 para metros. Inclua uma docstring e retorne o peso por unidade em kg.',
  'def peso_kg(largura_cm: float, altura_cm: float, espessura_micra: float) -> float:\n    """Complete a descrição da função."""\n    pass\n',
  'def peso_kg(largura_cm: float, altura_cm: float, espessura_micra: float) -> float:\n    """Retorna o peso de duas faces de plástico em kg por unidade."""\n    return (largura_cm / 100) * (altura_cm / 100) * (espessura_micra / 1_000_000) * 2 * 920',
  [t('Unidades convertidas', 'abs(peso_kg(20, 30, 50) - 0.00552) < 1e-9'),t('Outra medida', 'abs(peso_kg(10, 10, 100) - 0.00184) < 1e-9'),t('Documentação', 'bool(peso_kg.__doc__)'),t('Anotações', 'len(peso_kg.__annotations__) == 4')],
  ['Converta as três medidas antes de multiplicar.', 'Não esqueça o fator 2 pelas duas faces.'], { pitfall: 'Essa é uma aproximação geométrica didática: alças, soldas e aparas precisam de um modelo próprio em uma aplicação de produção.' });

L('m04', 'modulos', 'Módulos e biblioteca padrão',
  'Um módulo é um arquivo Python ou uma biblioteca que expõe funções e classes. import math importa um módulo; from statistics import mean importa um nome. A biblioteca padrão já inclui ferramentas para matemática, arquivos, datas, testes e mais.',
  'Não nomeie seu arquivo json.py ou statistics.py se você pretende importar essas bibliotecas: seu arquivo pode esconder o módulo verdadeiro. Consulte a documentação e reaproveite ferramentas confiáveis antes de recriar tudo.',
  'from statistics import mean\nimport math\n\nprint(mean([10, 20, 30]))\nprint(math.ceil(235 / 100))',
  'Implemente media_segura(valores). Use statistics.mean para devolver a média. Para uma lista vazia, retorne 0.',
  'from statistics import mean\n\ndef media_segura(valores):\n    pass\n',
  'from statistics import mean\n\ndef media_segura(valores):\n    return mean(valores) if valores else 0',
  [t('Média simples', 'media_segura([10,20,30]) == 20'),t('Entrada vazia', 'media_segura([]) == 0'),t('Decimais', 'media_segura([1.5,2.5]) == 2'),t('Um valor', 'media_segura([7]) == 7')],
  ['Teste a lista vazia antes de chamar mean().', 'Importações normalmente ficam no começo do arquivo.'], { pitfall: 'mean([]) gera StatisticsError. Trate o contrato da sua função explicitamente.' });

L('m05', 'excecoes', 'Exceções e validação',
  'Exceções sinalizam que uma operação não pôde ser concluída. try executa o trecho que pode falhar; except trata um erro específico. raise permite rejeitar dados que violam uma regra. Capture apenas os erros que você sabe resolver.',
  'Receber uma quantidade do usuário exige converter texto e validar o resultado. ValueError na conversão é diferente de um bug no restante do sistema. Evite except sem tipo: ele pode esconder falhas importantes.',
  'try:\n    quantidade = int("abc")\nexcept ValueError:\n    print("Digite um número inteiro.")',
  'Implemente ler_quantidade(texto). Retorne um inteiro positivo quando a conversão funcionar. Para texto inválido, zero ou número negativo, retorne None.',
  'def ler_quantidade(texto):\n    pass\n',
  'def ler_quantidade(texto):\n    try:\n        quantidade = int(texto)\n    except ValueError:\n        return None\n    return quantidade if quantidade > 0 else None',
  [t('Número válido', 'ler_quantidade("25") == 25'),t('Texto inválido', 'ler_quantidade("abc") is None'),t('Zero', 'ler_quantidade("0") is None'),t('Negativo', 'ler_quantidade("-2") is None')],
  ['Coloque int(texto) dentro de try.', 'Depois da conversão, valide se é positivo.'], { pitfall: 'Não converta um valor inválido silenciosamente para 0 se 0 tiver significado no negócio.' });

L('m05', 'debug', 'Depuração e casos de fronteira',
  'Depurar é investigar a diferença entre o comportamento esperado e o observado. Reduza o problema a um exemplo pequeno, leia a última linha da exceção e observe as variáveis. Um erro de sintaxe impede a execução; um erro lógico pode produzir uma resposta plausível e errada.',
  'Para intervalos, teste abaixo, no limite e acima. O erro deste exercício está em usar > no lugar de >=. Corrigir um exemplo sem pensar nas fronteiras costuma deixar o mesmo defeito em outro lugar.',
  'def frete_gratis(total):\n    return total > 100\n\nprint(frete_gratis(99))\nprint(frete_gratis(100))  # deveria ser True',
  'Corrija frete_gratis(total) para retornar True quando total for maior ou igual a 100 e False abaixo disso. O valor retornado deve ser bool.',
  'def frete_gratis(total):\n    return total > 100\n',
  'def frete_gratis(total):\n    return total >= 100',
  [t('Abaixo da fronteira', 'frete_gratis(99.99) is False'),t('Na fronteira', 'frete_gratis(100) is True'),t('Acima da fronteira', 'frete_gratis(100.01) is True')],
  ['A regra inclui exatamente 100.', 'Compare >= com >.'], { pitfall: 'Mudar a entrada do teste para fazer o código passar não corrige a regra.' });

L('m05', 'testes', 'Testes unitários com unittest',
  'Um teste descreve uma entrada e a resposta esperada. unittest.TestCase oferece assertEqual, assertAlmostEqual e assertRaises. Execute testes após mudar uma regra para detectar regressões: algo que funcionava e deixou de funcionar.',
  'O teste deve representar uma regra independente da implementação. Inclua casos normais, fronteiras e inválidos. Uma suíte pequena e relevante é mais útil do que dezenas de testes que apenas repetem o código.',
  'import unittest\n\ndef dobro(n):\n    return n * 2\n\nclass TestDobro(unittest.TestCase):\n    def test_positivo(self):\n        self.assertEqual(dobro(3), 6)\n\nsuite = unittest.defaultTestLoader.loadTestsFromTestCase(TestDobro)\nunittest.TextTestRunner().run(suite)',
  'Implemente dividir(a, b). Retorne a / b; se b for zero, gere ValueError com a mensagem Divisor não pode ser zero. Escreva uma classe TestDividir com pelo menos dois métodos test_: um caso válido e um inválido.',
  'import unittest\n\ndef dividir(a, b):\n    pass\n\nclass TestDividir(unittest.TestCase):\n    # Escreva dois testes\n    pass\n',
  'import unittest\n\ndef dividir(a, b):\n    if b == 0:\n        raise ValueError("Divisor não pode ser zero")\n    return a / b\n\nclass TestDividir(unittest.TestCase):\n    def test_valido(self):\n        self.assertEqual(dividir(6, 2), 3)\n    def test_zero(self):\n        with self.assertRaises(ValueError):\n            dividir(6, 0)',
  [t('Divisão válida', 'dividir(6, 2) == 3'),t('Divisor inválido', '__raises(ValueError, dividir, 6, 0)'),t('Pelo menos dois testes escritos', 'len(unittest.defaultTestLoader.getTestCaseNames(TestDividir)) >= 2'),t('Sua suíte passa', 'unittest.TextTestRunner(stream=__io.StringIO()).run(unittest.defaultTestLoader.loadTestsFromTestCase(TestDividir)).wasSuccessful()')],
  ['Use with self.assertRaises(ValueError) no caso inválido.', 'Métodos de teste começam com test_.'], { pitfall: 'Não chame unittest.main() no laboratório: ele pode tentar interpretar os argumentos do ambiente. Use uma suíte como no exemplo.' });

L('m05', 'eficiencia', 'Eficiência e busca com set',
  'Complexidade descreve como o trabalho cresce com o tamanho da entrada. Percorrer n itens costuma ser O(n). Comparar cada item com todos os outros pode ser O(n²). Um set permite testar presença com custo médio constante.',
  'Para detectar repetição, guarde o que já apareceu e consulte o set a cada item. Você pode parar na primeira repetição. A clareza e o contrato vêm antes de otimizações sem uma necessidade medida.',
  'vistos = set()\nfor sku in ["A", "B", "A"]:\n    if sku in vistos:\n        print("Repetido:", sku)\n    vistos.add(sku)',
  'Implemente tem_duplicata(itens): retorne True se houver pelo menos um valor repetido e False caso contrário. Os itens são strings ou números, que podem entrar em um set.',
  'def tem_duplicata(itens):\n    pass\n',
  'def tem_duplicata(itens):\n    vistos = set()\n    for item in itens:\n        if item in vistos:\n            return True\n        vistos.add(item)\n    return False',
  [t('Detecta repetição', 'tem_duplicata(["A","B","A"]) is True'),t('Sem repetição', 'tem_duplicata([1,2,3]) is False'),t('Lista vazia', 'tem_duplicata([]) is False'),t('Itens próximos', 'tem_duplicata([1,1]) is True')],
  ['Use um set chamado vistos.', 'Ao encontrar o item no set, você já tem a resposta.'], { pitfall: 'O uso de set tem custo de memória O(n). Discuta esse custo em uma entrevista.' });

L('m06', 'arquivos', 'Arquivos e pathlib',
  'pathlib.Path representa caminhos. read_text() e write_text() leem e escrevem texto. with open(...) fecha o arquivo mesmo se uma exceção ocorrer. Defina encoding="utf-8" para preservar acentos.',
  'No navegador, os arquivos ficam em um sistema de arquivos virtual e temporário da execução; eles não são gravados no seu celular. Em Python instalado no computador, os mesmos comandos usam arquivos reais. O botão Baixar código permite levar o programa para lá.',
  'from pathlib import Path\n\ncaminho = Path("anotacoes.txt")\ncaminho.write_text("Olá, Python!", encoding="utf-8")\nprint(caminho.read_text(encoding="utf-8"))',
  'Implemente salvar_e_ler(texto, caminho="nota.txt"): grave o texto em UTF-8 no caminho informado e retorne o conteúdo lido desse arquivo.',
  'from pathlib import Path\n\ndef salvar_e_ler(texto, caminho="nota.txt"):\n    pass\n',
  'from pathlib import Path\n\ndef salvar_e_ler(texto, caminho="nota.txt"):\n    arquivo = Path(caminho)\n    arquivo.write_text(texto, encoding="utf-8")\n    return arquivo.read_text(encoding="utf-8")',
  [t('Texto com acentos', 'salvar_e_ler("Programação e ação") == "Programação e ação"'),t('Outro arquivo', 'salvar_e_ler("ABC", "outro.txt") == "ABC"'),t('Arquivo realmente escrito', '__Path("outro.txt").read_text(encoding="utf-8") == "ABC"'),t('Texto vazio', 'salvar_e_ler("") == ""')],
  ['Crie Path(caminho), depois use write_text e read_text.', 'Informe encoding="utf-8" nas duas operações.'], { pitfall: 'Abrir no modo w substitui o conteúdo anterior. Use nomes e diretórios seguros antes de automatizar escrita em arquivos reais.' });

L('m06', 'json', 'JSON e contratos de dados',
  'JSON é um formato textual usado para trocar dados. json.loads() transforma texto JSON em estruturas Python; json.dumps() faz o caminho inverso. JSON usa aspas duplas, true, false e null; Python usa True, False e None.',
  'Uma API pode devolver uma lista de pedidos como JSON. Primeiro decodifique, depois consulte as estruturas. Não use eval() para ler dados externos: JSON tem um parser próprio e não precisa executar código.',
  'import json\n\ntexto = \'{"sku": "A", "quantidade": 10}\'\npedido = json.loads(texto)\nprint(pedido["sku"])\nprint(json.dumps(pedido, ensure_ascii=False))',
  'Implemente total_json(texto): receba uma lista JSON de pedidos e retorne a soma do campo quantidade. Uma lista vazia deve resultar em 0.',
  'import json\n\ndef total_json(texto):\n    pass\n',
  'import json\n\ndef total_json(texto):\n    pedidos = json.loads(texto)\n    return sum(pedido["quantidade"] for pedido in pedidos)',
  [t('Soma pedidos', 'total_json(\'[{"quantidade":2},{"quantidade":3}]\') == 5'),t('Lista vazia', 'total_json("[]") == 0'),t('Quantidade zero', 'total_json(\'[{"quantidade":0}]\') == 0')],
  ['Use json.loads(texto).', 'Percorra os dicionários decodificados.'], { pitfall: 'JSON inválido gera JSONDecodeError. Valide também a estrutura esperada ao receber dados de outra pessoa.' });

L('m06', 'csv', 'CSV e relatórios de vendas',
  'CSV guarda linhas e colunas como texto. csv.DictReader usa os nomes da primeira linha como chaves. O delimitador pode ser vírgula ou ponto e vírgula. Quantidades continuam sendo strings e precisam ser convertidas.',
  'Um relatório comercial pode ter o mesmo SKU em várias linhas. io.StringIO permite tratar uma string como arquivo, ótimo para testes. Deixe o parser CSV cuidar das aspas e dos delimitadores, em vez de usar split para cada linha.',
  'import csv\nfrom io import StringIO\n\ndados = "sku;quantidade\\nA;2\\nB;3\\n"\nfor linha in csv.DictReader(StringIO(dados), delimiter=";"):\n    print(linha["sku"], int(linha["quantidade"]))',
  'Implemente resumo_csv(texto): leia um CSV separado por ponto e vírgula com colunas sku e quantidade. Retorne um dicionário de quantidade total por SKU.',
  'import csv\nfrom io import StringIO\n\ndef resumo_csv(texto):\n    pass\n',
  'import csv\nfrom io import StringIO\n\ndef resumo_csv(texto):\n    totais = {}\n    for linha in csv.DictReader(StringIO(texto), delimiter=";"):\n        sku = linha["sku"]\n        totais[sku] = totais.get(sku, 0) + int(linha["quantidade"])\n    return totais',
  [t('Agrupa linhas', 'resumo_csv("sku;quantidade\\nA;2\\nB;3\\nA;4\\n") == {"A":6,"B":3}'),t('Somente cabeçalho', 'resumo_csv("sku;quantidade\\n") == {}'),t('Respeita campo com delimitador', 'resumo_csv(\'sku;quantidade\\n"A;B";2\\n\') == {"A;B":2}')],
  ['Use delimiter=";".', 'Converta quantidade com int() antes de somar.'], { pitfall: 'Relatórios de marketplaces podem mudar de cabeçalho. Um programa real deve validar colunas e informar linhas inválidas.' });

L('m06', 'datas', 'Datas e dinheiro com Decimal',
  'date e timedelta permitem calcular datas sem contar dias manualmente. Decimal representa valores decimais com precisão controlada. Para dinheiro, construa Decimal a partir de strings e use quantize para definir arredondamento.',
  'Somar 30 dias não é sempre a mesma coisa que avançar um mês no calendário. Explicite a regra de negócio. Nesta aula o prazo é em dias e o valor será arredondado para centavos com ROUND_HALF_UP.',
  'from datetime import date, timedelta\nfrom decimal import Decimal, ROUND_HALF_UP\n\nprint(date.fromisoformat("2027-01-20") + timedelta(days=30))\nprint(Decimal("1.005").quantize(Decimal("0.01"), rounding=ROUND_HALF_UP))',
  'Implemente cobrar(valor_texto, dias, data_iso): retorne uma tupla (valor_arredondado_como_string, vencimento_iso). Use ROUND_HALF_UP para centavos e some dias à data recebida.',
  'from datetime import date, timedelta\nfrom decimal import Decimal, ROUND_HALF_UP\n\ndef cobrar(valor_texto, dias, data_iso):\n    pass\n',
  'from datetime import date, timedelta\nfrom decimal import Decimal, ROUND_HALF_UP\n\ndef cobrar(valor_texto, dias, data_iso):\n    valor = Decimal(valor_texto).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)\n    vencimento = date.fromisoformat(data_iso) + timedelta(days=dias)\n    return str(valor), vencimento.isoformat()',
  [t('Arredondamento e virada de mês', 'cobrar("1.005", 10, "2027-01-25") == ("1.01", "2027-02-04")'),t('Duas casas e mesmo dia', 'cobrar("10", 0, "2027-03-01") == ("10.00", "2027-03-01")'),t('Ano bissexto', 'cobrar("2.50", 1, "2028-02-28") == ("2.50", "2028-02-29")')],
  ['Use date.fromisoformat e timedelta(days=dias).', 'quantize(Decimal("0.01"), rounding=ROUND_HALF_UP) arredonda para centavos.'], { pitfall: 'Decimal(0.1) recebe a aproximação binária do float. Prefira Decimal("0.1").' });

L('m07', 'classes', 'Classes, objetos e estado',
  'Uma classe descreve objetos com estado e comportamentos. __init__ inicializa cada objeto; self representa a instância atual. Atributos de instância, como self.saldo, pertencem àquele objeto, não a todas as instâncias.',
  'Modele uma conta de estoque: criar dois estoques deve produzir dois saldos independentes. Um método altera o estado e pode devolver o novo valor. Use classes quando estado e comportamento precisam permanecer juntos.',
  'class Estoque:\n    def __init__(self, saldo=0):\n        self.saldo = saldo\n\n    def entrar(self, quantidade):\n        self.saldo += quantidade\n        return self.saldo\n\nestoque = Estoque(10)\nprint(estoque.entrar(5))',
  'Crie a classe Estoque(saldo=0) com o atributo saldo e o método entrar(quantidade). O método soma uma quantidade positiva ao saldo e retorna o novo saldo. Quantidade zero ou negativa deve gerar ValueError.',
  'class Estoque:\n    def __init__(self, saldo=0):\n        self.saldo = saldo\n\n    def entrar(self, quantidade):\n        pass\n',
  'class Estoque:\n    def __init__(self, saldo=0):\n        self.saldo = saldo\n\n    def entrar(self, quantidade):\n        if quantidade <= 0:\n            raise ValueError("Quantidade deve ser positiva")\n        self.saldo += quantidade\n        return self.saldo',
  [t('Entrada no estoque', 'Estoque(10).entrar(5) == 15'),t('Saldo padrão', 'Estoque().saldo == 0'),t('Rejeita quantidade inválida', '__raises(ValueError, Estoque().entrar, -1)'),t('Instâncias independentes', '__independent_stock(Estoque)')],
  ['Use self.saldo para guardar o estado.', 'Valide quantidade antes de atualizar o saldo.'], { pitfall: 'Um atributo de classe mutável pode compartilhar dados entre objetos sem que você perceba.' });

L('m07', 'heranca', 'Herança e contratos',
  'Herança permite especializar um comportamento: uma subclasse reutiliza a base e pode substituir métodos. Ela faz sentido quando a relação é "é um". Para apenas usar outro objeto, composição costuma ser mais simples.',
  'Uma embalagem com desconto ainda deve poder ser usada onde uma embalagem normal é esperada. Mantenha o contrato do método: mesma finalidade, entradas compatíveis e saída previsível. super() acessa a implementação da base.',
  'class Produto:\n    def __init__(self, preco):\n        self.preco = preco\n\n    def total(self, quantidade):\n        return self.preco * quantidade\n\nclass Promocional(Produto):\n    def total(self, quantidade):\n        return super().total(quantidade) * 0.9',
  'Crie Produto(preco) com total(quantidade) e Promocional herdando de Produto. Promocional.total deve aplicar 10% de desconto ao total da classe base.',
  'class Produto:\n    def __init__(self, preco):\n        self.preco = preco\n    def total(self, quantidade):\n        pass\n\nclass Promocional(Produto):\n    def total(self, quantidade):\n        pass\n',
  'class Produto:\n    def __init__(self, preco):\n        self.preco = preco\n    def total(self, quantidade):\n        return self.preco * quantidade\n\nclass Promocional(Produto):\n    def total(self, quantidade):\n        return super().total(quantidade) * 0.9',
  [t('Produto comum', 'Produto(10).total(3) == 30'),t('Produto promocional', 'Promocional(10).total(3) == 27'),t('Herança declarada', 'issubclass(Promocional, Produto)'),t('Quantidade zero', 'Promocional(5).total(0) == 0')],
  ['Use super().total(quantidade) na subclasse.', 'A classe base não recebe o desconto.'], { pitfall: 'Não use herança apenas para evitar copiar duas linhas. Considere a relação entre os conceitos.' });

L('m07', 'dataclasses', 'dataclasses e modelos simples',
  'dataclass gera métodos comuns, como __init__ e __repr__, a partir dos campos declarados. É útil para modelos de dados claros. As anotações descrevem os campos, mas não fazem validação de entrada por conta própria.',
  'Para uma linha de pedido, nome, quantidade e preço são dados; subtotal é um cálculo. Evite guardar subtotal e também suas parcelas se isso permitir que fiquem inconsistentes.',
  'from dataclasses import dataclass\n\n@dataclass\nclass Item:\n    sku: str\n    quantidade: int\n    preco: float\n\n    def subtotal(self):\n        return self.quantidade * self.preco\n\nprint(Item("A", 2, 5).subtotal())',
  'Crie a dataclass Item com sku: str, quantidade: int e preco: float. Implemente subtotal() retornando quantidade * preco.',
  'from dataclasses import dataclass\n\n# Crie a dataclass Item\n',
  'from dataclasses import dataclass\n\n@dataclass\nclass Item:\n    sku: str\n    quantidade: int\n    preco: float\n\n    def subtotal(self):\n        return self.quantidade * self.preco',
  [t('Calcula subtotal', 'Item("A", 2, 5).subtotal() == 10'),t('Campos acessíveis', 'Item("B", 3, 2).sku == "B"'),t('É uma dataclass', '__dataclasses.is_dataclass(Item)'),t('Igualdade por valor', 'Item("A",1,5) == Item("A",1,5)')],
  ['Não esqueça @dataclass em cima da classe.', 'subtotal é um método de instância: recebe self.'], { pitfall: 'Listas como campos padrão precisam de field(default_factory=list), para cada instância ter a própria lista.' });

L('m07', 'composicao', 'Composição e responsabilidades',
  'Composição é construir um objeto usando outros objetos. Um pedido tem itens; ele não é um item. Separar responsabilidades permite testar o cálculo de um item e o total de um pedido de forma independente.',
  'Prefira receber os colaboradores pelo construtor. Isso torna explícito de onde vêm os dados e permite trocar uma implementação por outra. A classe Pedido deve usar subtotal() de seus itens, sem conhecer como esse cálculo foi implementado.',
  'class Pedido:\n    def __init__(self, itens):\n        self.itens = list(itens)\n\n    def total(self):\n        return sum(item.subtotal() for item in self.itens)',
  'Implemente Pedido(itens): copie a lista recebida para self.itens e implemente total() somando item.subtotal(). Os testes fornecerão objetos que já têm esse método.',
  'class Pedido:\n    def __init__(self, itens):\n        pass\n    def total(self):\n        pass\n',
  'class Pedido:\n    def __init__(self, itens):\n        self.itens = list(itens)\n    def total(self):\n        return sum(item.subtotal() for item in self.itens)',
  [t('Soma colaboradores', 'Pedido([__Item(10),__Item(15)]).total() == 25'),t('Pedido vazio', 'Pedido([]).total() == 0'),t('Copia a lista', '__pedido_copies(Pedido)'),t('Outro valor', 'Pedido([__Item(3.5)]).total() == 3.5')],
  ['Cada item já sabe calcular seu subtotal.', 'Copie com list(itens) para não compartilhar a lista.'], { pitfall: 'Evite uma classe que lê arquivos, calcula totais, mostra a tela e envia e-mails: as responsabilidades ficam difíceis de testar.' });

L('m08', 'sqlite', 'Persistência com SQLite',
  'Um banco de dados guarda informações estruturadas. Uma tabela tem colunas e linhas. SQLite roda sem um servidor separado e é ótimo para aprender SQL. CREATE TABLE define a estrutura; INSERT acrescenta dados; SELECT consulta.',
  'A conexão :memory: cria um banco temporário para testes. Em um projeto local, use um nome de arquivo para persistir. No laboratório, o banco é temporário, assim como os arquivos, e não é o banco do seu progresso na plataforma.',
  'import sqlite3\n\ncon = sqlite3.connect(":memory:")\ncon.execute("CREATE TABLE produtos (sku TEXT PRIMARY KEY, saldo INTEGER NOT NULL)")\ncon.execute("INSERT INTO produtos VALUES (?, ?)", ("A", 10))\nprint(con.execute("SELECT sku, saldo FROM produtos").fetchall())\ncon.close()',
  'Implemente criar_estoque(itens): receba pares (sku, saldo), crie a tabela produtos em um SQLite em memória, insira os pares com parâmetros e retorne todas as linhas ordenadas por sku. Feche a conexão.',
  'import sqlite3\n\ndef criar_estoque(itens):\n    pass\n',
  'import sqlite3\n\ndef criar_estoque(itens):\n    con = sqlite3.connect(":memory:")\n    try:\n        con.execute("CREATE TABLE produtos (sku TEXT PRIMARY KEY, saldo INTEGER NOT NULL)")\n        con.executemany("INSERT INTO produtos VALUES (?, ?)", itens)\n        return con.execute("SELECT sku, saldo FROM produtos ORDER BY sku").fetchall()\n    finally:\n        con.close()',
  [t('Insere e ordena', 'criar_estoque([("B",2),("A",5)]) == [("A",5),("B",2)]'),t('Banco vazio', 'criar_estoque([]) == []'),t('Texto tratado como dado', 'criar_estoque([("A\'B",1)]) == [("A\'B",1)]')],
  ['Use executemany() para os pares recebidos.', 'ORDER BY sku torna a ordem previsível.'], { pitfall: 'with con controla transações, mas não fecha a conexão. Feche explicitamente ou use contextlib.closing.' });

L('m08', 'consultas', 'Consultas seguras com parâmetros',
  'WHERE filtra linhas e ORDER BY organiza o resultado. Dados recebidos do usuário precisam ser enviados como parâmetros SQL. Concatenar texto externo na consulta abre espaço para injeção de SQL e erros de aspas.',
  'Escreva o SQL com ? e envie os valores no segundo argumento de execute. Uma tupla com um único valor precisa de vírgula: (sku,). O parâmetro substitui um valor, não o nome de uma tabela ou coluna.',
  'import sqlite3\n\ncon = sqlite3.connect(":memory:")\ncon.execute("CREATE TABLE produtos (sku TEXT, saldo INTEGER)")\ncon.executemany("INSERT INTO produtos VALUES (?, ?)", [("A",5),("B",20)])\nprint(con.execute("SELECT sku FROM produtos WHERE saldo < ? ORDER BY sku", (10,)).fetchall())\ncon.close()',
  'Implemente abaixo_do_minimo(con, minimo): a conexão já tem a tabela produtos(sku, saldo). Retorne uma lista de SKUs cujo saldo é menor que minimo, ordenada por SKU. Não feche a conexão recebida.',
  'def abaixo_do_minimo(con, minimo):\n    pass\n',
  'def abaixo_do_minimo(con, minimo):\n    linhas = con.execute("SELECT sku FROM produtos WHERE saldo < ? ORDER BY sku", (minimo,)).fetchall()\n    return [linha[0] for linha in linhas]',
  [t('Filtra por saldo', '__sql_min(abaixo_do_minimo, 10) == ["A","C"]'),t('Limite exclusivo', '__sql_min(abaixo_do_minimo, 5) == ["C"]'),t('Nenhum resultado', '__sql_min(abaixo_do_minimo, 0) == []')],
  ['Use saldo < ? e passe (minimo,).', 'fetchall() retorna tuplas; extraia linha[0].'], { pitfall: 'Uma função que recebe uma conexão não deve fechar um recurso que pertence ao chamador.' });

L('m08', 'join', 'JOIN e agregações',
  'JOIN relaciona tabelas por uma chave. GROUP BY reúne linhas de um grupo e SUM agrega os valores. Uma chave estrangeira descreve a relação entre uma linha de venda e seu produto.',
  'Para listar os produtos mais vendidos, some a quantidade por produto e ordene o total em ordem decrescente. Defina um segundo critério para desempates, assim seus relatórios e testes não mudam de ordem sem motivo.',
  '# Exemplo de SQL (o exercício usa uma conexão pronta):\nconsulta = """\nSELECT p.nome, SUM(v.quantidade) AS total\nFROM produtos p\nJOIN vendas v ON v.sku = p.sku\nGROUP BY p.sku, p.nome\nORDER BY total DESC, p.nome ASC\n"""\nprint(consulta)',
  'Implemente ranking(con). A conexão tem produtos(sku, nome) e vendas(sku, quantidade). Retorne pares (nome, total) apenas de produtos com vendas, em ordem decrescente do total e alfabética do nome no empate.',
  'def ranking(con):\n    pass\n',
  'def ranking(con):\n    sql = """SELECT p.nome, SUM(v.quantidade) AS total\n             FROM produtos p JOIN vendas v ON v.sku = p.sku\n             GROUP BY p.sku, p.nome\n             ORDER BY total DESC, p.nome ASC"""\n    return con.execute(sql).fetchall()',
  [t('Agrupa e relaciona', '__sql_rank(ranking) == [("Sacola",7),("Saco",3)]'),t('Vendas ausentes', '__sql_rank(ranking, empty=True) == []'),t('Critério de empate', '__sql_rank(ranking, tie=True) == [("Saco",3),("Sacola",3)]')],
  ['Relacione v.sku = p.sku.', 'Use SUM(v.quantidade) com GROUP BY e dois critérios em ORDER BY.'], { pitfall: 'Um JOIN com uma chave errada pode multiplicar linhas e inflar o total.' });

L('m08', 'transacoes', 'Transações e consistência',
  'Uma transação agrupa operações que precisam acontecer juntas. Se uma falhar, rollback desfaz as anteriores. commit confirma as alterações. Índices podem acelerar consultas, mas custam espaço e tornam escritas mais caras.',
  'Transferir estoque de A para B envolve duas atualizações: remover e adicionar. Sem uma transação, uma falha no meio deixaria um saldo incorreto. Verifique regras e use o gerenciador da conexão para confirmar ou reverter.',
  'import sqlite3\n\ncon = sqlite3.connect(":memory:")\ncon.execute("CREATE TABLE estoque (sku TEXT PRIMARY KEY, saldo INTEGER)")\ncon.executemany("INSERT INTO estoque VALUES (?, ?)", [("A",10),("B",0)])\ncon.commit()\nwith con:\n    con.execute("UPDATE estoque SET saldo = saldo - ? WHERE sku = ?", (2,"A"))\n    con.execute("UPDATE estoque SET saldo = saldo + ? WHERE sku = ?", (2,"B"))\nprint(con.execute("SELECT * FROM estoque ORDER BY sku").fetchall())\ncon.close()',
  'Implemente transferir(con, origem, destino, quantidade). Rejeite quantidade <= 0, origem igual ao destino, SKU ausente ou saldo insuficiente com ValueError. Em uma transação, retire da origem e adicione ao destino. Retorne True.',
  'def transferir(con, origem, destino, quantidade):\n    pass\n',
  'def transferir(con, origem, destino, quantidade):\n    if quantidade <= 0 or origem == destino:\n        raise ValueError("Transferência inválida")\n    with con:\n        a = con.execute("SELECT saldo FROM estoque WHERE sku = ?", (origem,)).fetchone()\n        b = con.execute("SELECT saldo FROM estoque WHERE sku = ?", (destino,)).fetchone()\n        if a is None or b is None or a[0] < quantidade:\n            raise ValueError("Estoque insuficiente ou SKU ausente")\n        con.execute("UPDATE estoque SET saldo = saldo - ? WHERE sku = ?", (quantidade, origem))\n        con.execute("UPDATE estoque SET saldo = saldo + ? WHERE sku = ?", (quantidade, destino))\n    return True',
  [t('Move sem perder unidades', '__sql_transfer(transferir, 3) == (True, [("A",7),("B",3)])'),t('Saldo insuficiente não altera dados', '__sql_transfer(transferir, 11) == ("ValueError", [("A",10),("B",0)])'),t('Quantidade inválida', '__sql_transfer(transferir, 0)[0] == "ValueError"'),t('Destino ausente', '__sql_transfer(transferir, 1, missing=True)[0] == "ValueError"')],
  ['Consulte os dois SKUs antes de alterar os saldos.', 'Coloque as operações de banco dentro de with con:.'], { pitfall: 'Em sistemas com várias conexões gravando ao mesmo tempo, o desenho da transação e do isolamento também precisa ser considerado.' });

L('m09', 'ambiente', 'Terminal e ambiente virtual',
  'O terminal permite navegar por pastas e executar comandos. Um ambiente virtual separa as dependências de cada projeto. Crie com python -m venv .venv e use python -m pip para instalar no interpretador correto.',
  'No Windows, a ativação pode ser feita com .venv\\Scripts\\Activate.ps1 no PowerShell; em Linux/macOS, source .venv/bin/activate. O exercício pratica identificar arquivos que não devem entrar no repositório. Faça os comandos em seu computador: o navegador não cria um ambiente virtual no sistema.',
  'python --version\npython -m venv .venv\n# Windows / PowerShell:\n.venv\\Scripts\\Activate.ps1\n# Linux / macOS:\nsource .venv/bin/activate\npython -m pip --version',
  'Implemente ignorar(caminho): normalize barras invertidas para /; retorne True se qualquer parte do caminho for .venv ou __pycache__, ou se o último nome for .env. Outros caminhos devem retornar False.',
  'def ignorar(caminho):\n    pass\n',
  'def ignorar(caminho):\n    partes = caminho.replace("\\\\", "/").split("/")\n    return ".venv" in partes or "__pycache__" in partes or partes[-1] == ".env"',
  [t('Ambiente virtual', 'ignorar(".venv/lib/site.py") is True'),t('Cache Python', 'ignorar("src/__pycache__/app.pyc") is True'),t('Segredo', 'ignorar("config/.env") is True'),t('Código deve entrar', 'ignorar("src/app.py") is False'),t('Caminho Windows', 'ignorar("src\\\\__pycache__\\\\a.pyc") is True')],
  ['Use replace para normalizar barras e split("/") para obter as partes.', 'Compare nomes de partes inteiras, não qualquer trecho do texto.'],
  { exampleLang: 'bash', localPractice: 'Crie uma pasta futuredev-exercicios, abra um terminal nela, crie e ative o ambiente. Confirme com python -c "import sys; print(sys.executable)" que o interpretador está dentro de .venv.', pitfall: 'A pasta .venv e o arquivo .env não devem ser enviados ao Git. O banco local ou CSV com dados pessoais também pode precisar ser ignorado.' });

L('m09', 'git', 'Git, commits e branches',
  'Git guarda versões do projeto. git status mostra alterações; git add seleciona o que entra no próximo commit; git commit registra uma versão. Uma branch separa uma linha de trabalho e um pull request permite revisar mudanças.',
  'Faça commits pequenos com mensagens que descrevam a mudança. Antes de confirmar, leia git diff --staged. Nunca inclua uma senha ou chave de API. git push envia os commits locais para o remoto; ele não substitui o commit.',
  'git init\ngit status\ngit add app.py\ngit diff --staged\ngit commit -m "Adiciona cálculo de margem"\ngit switch -c melhoria-validacao\n# Após configurar seu remoto:\ngit push -u origin melhoria-validacao',
  'Implemente filtrar_commits(commits): cada commit tem mensagem e arquivos (lista). Retorne, na ordem, as mensagens dos commits que alteraram pelo menos um arquivo terminado em .py.',
  'def filtrar_commits(commits):\n    pass\n',
  'def filtrar_commits(commits):\n    return [c["mensagem"] for c in commits if any(a.endswith(".py") for a in c["arquivos"])]',
  [t('Seleciona código Python', 'filtrar_commits([{"mensagem":"Docs","arquivos":["README.md"]},{"mensagem":"Validação","arquivos":["app.py","README.md"]}]) == ["Validação"]'),t('Sem commits', 'filtrar_commits([]) == []'),t('Não confunde extensão', 'filtrar_commits([{"mensagem":"Texto","arquivos":["app.py.txt"]}]) == []')],
  ['Use any() para verificar a lista de arquivos.', 'endswith(".py") testa a extensão.'],
  { exampleLang: 'bash', localPractice: 'Crie um repositório de exercícios no GitHub, registre uma versão e envie. Depois crie uma branch, altere um teste e abra um pull request. Escreva o problema, a mudança e como verificou.', pitfall: 'git add . inclui tudo que não foi ignorado. Revise os arquivos antes de executar.' });

L('m09', 'dependencias', 'Dependências e configuração',
  'Dependências são bibliotecas usadas pelo projeto. Um ambiente reproduzível precisa declarar as versões e o Python esperado. Configuração variável, como endereço de banco, fica fora do código; segredos não devem entrar em commits.',
  'Use variáveis de ambiente para dados de configuração. Não use eval para interpretar uma variável: faça conversões explícitas e valide limites. No exercício, um dicionário representa o ambiente para podermos testá-lo sem depender do sistema.',
  'import os\n\nporta = int(os.environ.get("PORT", "8000"))\nprint(porta)\n# No computador: python -m pip freeze > requirements.txt',
  'Implemente ler_porta(ambiente). Leia PORT; quando não existir, use 8000. Retorne um inteiro de 1 a 65535. Texto inválido ou número fora desse intervalo deve gerar ValueError.',
  'def ler_porta(ambiente):\n    pass\n',
  'def ler_porta(ambiente):\n    porta = int(ambiente.get("PORT", "8000"))\n    if not 1 <= porta <= 65535:\n        raise ValueError("Porta inválida")\n    return porta',
  [t('Configuração padrão', 'ler_porta({}) == 8000'),t('Configuração explícita', 'ler_porta({"PORT":"9000"}) == 9000'),t('Número inválido', '__raises(ValueError, ler_porta, {"PORT":"zero"})'),t('Fora do intervalo', '__raises(ValueError, ler_porta, {"PORT":"65536"})')],
  ['get("PORT", "8000") fornece um padrão.', 'Converta e valide o intervalo.'], { localPractice: 'Dentro do ambiente virtual, instale uma biblioteca, registre a dependência e tente instalar em um novo ambiente vazio. Faça um .env.example sem valores secretos e explique as variáveis no README.', pitfall: 'Tudo enviado ao frontend, inclusive em um arquivo de configuração, pode ser lido pelo visitante. Chaves privadas pertencem ao backend.' });

L('m09', 'readme', 'README e entrega profissional',
  'Um README ajuda outra pessoa a entender e executar o projeto. Descreva o problema, a solução, os requisitos, a instalação, a execução e os testes. Um exemplo de entrada e saída dá mais contexto que uma lista de tecnologias.',
  'Documente como quem nunca viu seu computador. Inclua comandos completos e informe limitações reais. Uma boa entrega permite que outra pessoa reproduza o resultado sem falar com você.',
  'readme = """# Relatório por SKU\nAgrupa vendas de um CSV para ajudar na produção.\n\n## Instalação\npython -m venv .venv\n\n## Uso\npython app.py vendas.csv\n\n## Testes\npython -m unittest discover\n"""\nprint(readme)',
  'Implemente secoes_faltantes(texto): verifique se os títulos ## Instalação, ## Uso e ## Testes aparecem como linhas completas, ignorando maiúsculas e espaços nas pontas. Retorne a lista dos nomes ausentes nessa ordem.',
  'def secoes_faltantes(texto):\n    pass\n',
  'def secoes_faltantes(texto):\n    linhas = {linha.strip().lower() for linha in texto.splitlines()}\n    return [nome for nome in ["Instalação", "Uso", "Testes"] if f"## {nome.lower()}" not in linhas]',
  [t('README completo', 'secoes_faltantes("## Instalação\\n## Uso\\n## Testes") == []'),t('Mostra pendências', 'secoes_faltantes("## Uso") == ["Instalação","Testes"]'),t('Ignora caixa e espaços', 'secoes_faltantes("  ## INSTALAÇÃO  \\n## uso\\n## testes") == []'),t('Texto não é título', 'secoes_faltantes("Veja ## Uso mais tarde") == ["Instalação","Uso","Testes"]')],
  ['Transforme as linhas em um set de strings normalizadas.', 'Compare cada título inteiro.'], { localPractice: 'Peça que alguém siga seu README em uma pasta nova. Corrija o primeiro ponto em que essa pessoa precisou adivinhar um comando.', pitfall: 'Dizer "rode o projeto" não ensina qual comando executar ou quais dados fornecer.' });

L('m10', 'http', 'HTTP e contratos de API',
  'Uma API HTTP recebe uma requisição e devolve uma resposta. A requisição tem método, caminho, cabeçalhos e, às vezes, corpo. GET consulta; POST normalmente cria. Códigos como 200, 201, 400 e 404 expressam o resultado.',
  'O corpo em JSON não é o status HTTP. Defina os dois. Nesta aula, implementaremos um simulador de contrato, sem abrir um servidor ou acessar a internet. O projeto de portfólio levará esse comportamento para uma API real.',
  'def responder(metodo, caminho):\n    if metodo == "GET" and caminho == "/health":\n        return 200, {"status": "ok"}\n    return 404, {"erro": "Não encontrado"}\n\nprint(responder("GET", "/health"))',
  'Implemente responder(metodo, caminho): GET em /health retorna (200, {"status": "ok"}); POST em /pedidos retorna (201, {"criado": True}); qualquer outra combinação retorna (404, {"erro": "Não encontrado"}).',
  'def responder(metodo, caminho):\n    pass\n',
  'def responder(metodo, caminho):\n    if metodo == "GET" and caminho == "/health":\n        return 200, {"status": "ok"}\n    if metodo == "POST" and caminho == "/pedidos":\n        return 201, {"criado": True}\n    return 404, {"erro": "Não encontrado"}',
  [t('Consulta de saúde', 'responder("GET","/health") == (200,{"status":"ok"})'),t('Criação', 'responder("POST","/pedidos") == (201,{"criado":True})'),t('Rota ausente', 'responder("GET","/outra") == (404,{"erro":"Não encontrado"})'),t('Método também importa', 'responder("POST","/health")[0] == 404')],
  ['Verifique método e caminho juntos.', 'Uma tupla pode carregar status e corpo.'], { pitfall: 'Esse exercício simula uma resposta. Ele não publica uma API e não abre uma porta no Pages.' });

L('m10', 'validacao', 'Validação nas fronteiras',
  'Dados externos precisam de validação antes de entrar nas regras de negócio. Verifique campos obrigatórios, tipos e limites. Em uma API, modelos Pydantic permitem declarar esse contrato; no núcleo, a regra ainda precisa ser clara e testável.',
  'bool é uma subclasse de int em Python, então isinstance(True, int) é verdadeiro. Para exigir uma quantidade inteira e rejeitar booleanos, use type(qtd) is int. Mensagens devem ajudar o usuário sem expor detalhes internos.',
  'def quantidade_valida(valor):\n    return type(valor) is int and valor > 0\n\nprint(quantidade_valida(10))\nprint(quantidade_valida(True))',
  'Implemente validar_pedido(dados): sku precisa ser string não vazia após strip(); quantidade precisa ser int positivo, sem aceitar bool. Retorne {"sku": sku_limpo, "quantidade": quantidade}; caso inválido, gere ValueError.',
  'def validar_pedido(dados):\n    pass\n',
  'def validar_pedido(dados):\n    sku = dados.get("sku")\n    quantidade = dados.get("quantidade")\n    if not isinstance(sku, str) or not sku.strip():\n        raise ValueError("SKU obrigatório")\n    if type(quantidade) is not int or quantidade <= 0:\n        raise ValueError("Quantidade inválida")\n    return {"sku":sku.strip(), "quantidade":quantidade}',
  [t('Normaliza dados válidos', 'validar_pedido({"sku":" A ","quantidade":2}) == {"sku":"A","quantidade":2}'),t('Campo ausente', '__raises(ValueError, validar_pedido, {"quantidade":2})'),t('Quantidade como texto', '__raises(ValueError, validar_pedido, {"sku":"A","quantidade":"2"})'),t('Booleano rejeitado', '__raises(ValueError, validar_pedido, {"sku":"A","quantidade":True})')],
  ['Use dados.get() para campos que podem estar ausentes.', 'Para a quantidade, compare type(quantidade) is int.'], { pitfall: 'Não dependa apenas de validações na tela. O servidor deve validar novamente.' });

L('m10', 'fastapi', 'Sua primeira API com FastAPI',
  'FastAPI conecta funções Python a rotas HTTP. Um modelo Pydantic BaseModel declara o corpo da requisição; Field pode impor limites. As funções de domínio continuam sendo Python comum, separadas do framework para facilitar testes.',
  'O exemplo completo deve rodar no seu computador: instale fastapi[standard], salve como main.py e execute fastapi dev main.py. Depois abra /docs para testar. No laboratório, verificaremos o núcleo da regra sem iniciar um servidor.',
  'from fastapi import FastAPI\nfrom pydantic import BaseModel, Field\n\napp = FastAPI()\n\nclass Pedido(BaseModel):\n    sku: str = Field(min_length=1)\n    quantidade: int = Field(gt=0)\n\n@app.post("/pedidos", status_code=201)\ndef criar_pedido(pedido: Pedido):\n    return pedido.model_dump()',
  'Implemente criar_pedido(dados, pedidos): valide SKU não vazio e quantidade int positiva; gere ValueError se inválido. Crie um dicionário com id = len(pedidos) + 1, sku limpo e quantidade; acrescente à lista e retorne o novo pedido.',
  'def criar_pedido(dados, pedidos):\n    pass\n',
  'def criar_pedido(dados, pedidos):\n    sku = dados.get("sku")\n    qtd = dados.get("quantidade")\n    if not isinstance(sku, str) or not sku.strip() or type(qtd) is not int or qtd <= 0:\n        raise ValueError("Pedido inválido")\n    pedido = {"id":len(pedidos)+1, "sku":sku.strip(), "quantidade":qtd}\n    pedidos.append(pedido)\n    return pedido',
  [t('Cria e guarda pedido', '__api_create(criar_pedido)'),t('Próximo identificador', 'criar_pedido({"sku":"B","quantidade":3}, [{"id":1}])["id"] == 2'),t('Rejeita dados ruins', '__raises(ValueError, criar_pedido, {"sku":"A","quantidade":0}, [])')],
  ['Calcule o identificador antes do append.', 'Adicione somente depois de validar todas as regras.'], { localPractice: 'Crie um ambiente virtual, rode python -m pip install "fastapi[standard]", salve o exemplo como main.py e rode fastapi dev main.py. Abra http://127.0.0.1:8000/docs. Ligue a rota à sua função de domínio e escreva testes HTTP com TestClient.', exampleEnvironment: 'computador', pitfall: 'len(pedidos)+1 é apenas didático. Em um banco real, use um identificador gerado pelo banco. Não exponha o servidor de desenvolvimento como produção.' });

L('m10', 'async', 'async, await e tarefas de I/O',
  'async def cria uma corrotina. await espera uma operação assíncrona sem bloquear outras tarefas do mesmo loop. Isso ajuda em operações de I/O, como consultas de rede. Não torna cálculos pesados automaticamente mais rápidos.',
  'asyncio.gather pode esperar várias tarefas independentes e devolve os resultados na ordem das entradas. Código síncrono lento dentro de uma função async ainda bloqueia o loop. No exercício, asyncio.sleep simula uma espera, sem acessar serviços externos.',
  'import asyncio\n\nasync def buscar(sku):\n    await asyncio.sleep(0.01)\n    return {"sku": sku}\n\nasync def principal():\n    return await asyncio.gather(buscar("A"), buscar("B"))\n\nprint(asyncio.run(principal()))',
  'Crie a função assíncrona carregar_skus(skus). Para cada SKU, execute buscar(sku), definida no starter, usando asyncio.gather. Retorne uma lista dos resultados na mesma ordem, inclusive para entrada vazia.',
  'import asyncio\n\nasync def buscar(sku):\n    await asyncio.sleep(0.001)\n    return {"sku":sku, "ok":True}\n\nasync def carregar_skus(skus):\n    pass\n',
  'import asyncio\n\nasync def buscar(sku):\n    await asyncio.sleep(0.001)\n    return {"sku":sku, "ok":True}\n\nasync def carregar_skus(skus):\n    return list(await asyncio.gather(*(buscar(sku) for sku in skus)))',
  [t('Ordem preservada', '(await carregar_skus(["B","A"])) == [{"sku":"B","ok":True},{"sku":"A","ok":True}]'),t('Lista vazia', '(await carregar_skus([])) == []'),t('É uma corrotina', '__inspect.iscoroutinefunction(carregar_skus)')],
  ['Monte as corrotinas e passe-as com * para gather.', 'Use await para obter o resultado.'], { pitfall: 'O laboratório possui um loop ativo. A função será aguardada pelo avaliador; não chame asyncio.run() no seu starter. O exemplo com asyncio.run é para um script no computador.', exampleEnvironment: 'computador' });

L('m11', 'relatorio', 'Relatório por SKU e período',
  'Uma automação começa com uma pergunta concreta. Para planejar produção, você pode somar vendas por SKU em um intervalo. Padronize o formato da data e deixe explícito se os extremos do intervalo entram no cálculo.',
  'Datas ISO no formato YYYY-MM-DD podem ser comparadas como strings quando todas seguem o mesmo formato válido. Em dados externos reais, primeiro valide e converta com date.fromisoformat. Aqui as entradas já são válidas.',
  'vendas = [{"data":"2027-01-10","sku":"A","quantidade":2}]\ninicio, fim = "2027-01-01", "2027-01-31"\nselecionadas = [v for v in vendas if inicio <= v["data"] <= fim]\nprint(selecionadas)',
  'Implemente vendas_periodo(vendas, inicio, fim): some quantidades por SKU apenas das linhas entre inicio e fim, incluindo as duas datas. Retorne um dicionário; as datas são ISO válidas.',
  'def vendas_periodo(vendas, inicio, fim):\n    pass\n',
  'def vendas_periodo(vendas, inicio, fim):\n    totais = {}\n    for venda in vendas:\n        if inicio <= venda["data"] <= fim:\n            sku = venda["sku"]\n            totais[sku] = totais.get(sku,0) + venda["quantidade"]\n    return totais',
  [t('Inclui fronteiras e soma', 'vendas_periodo(__sales, "2027-01-01","2027-01-31") == {"A":5,"B":4}'),t('Um dia', 'vendas_periodo(__sales,"2027-01-31","2027-01-31") == {"A":3}'),t('Sem vendas no período', 'vendas_periodo(__sales,"2028-01-01","2028-02-01") == {}')],
  ['Filtre antes de acumular.', 'O intervalo usa <= dos dois lados.'], { pitfall: 'Não misture data do pedido com data de pagamento sem dizer qual critério o relatório usa.' });

L('m11', 'limpeza', 'Limpeza de texto e expressões regulares',
  'Dados reais chegam com espaços, letras inconsistentes e caracteres extras. Normalizar reduz variações sem perder o significado. re permite buscar e substituir padrões; use uma expressão simples e documente o que será removido.',
  'Nem todo caractere diferente deve ser apagado. Para um SKU, a regra deste exercício aceita apenas letras ASCII, números e hífen. Um sistema real deve combinar essa regra com o padrão de seus produtos.',
  'import re\n\ntexto = "  sac-20 / preto  "\nlimpo = re.sub(r"[^A-Z0-9-]", "", texto.upper())\nprint(limpo)',
  'Implemente normalizar_sku(texto): transforme em maiúsculas e remova qualquer caractere que não seja A-Z, 0-9 ou hífen. Retorne a string resultante.',
  'import re\n\ndef normalizar_sku(texto):\n    pass\n',
  'import re\n\ndef normalizar_sku(texto):\n    return re.sub(r"[^A-Z0-9-]", "", texto.upper())',
  [t('Limpa espaços e barras', 'normalizar_sku("  sac-20 / preto  ") == "SAC-20PRETO"'),t('Preserva hífen e números', 'normalizar_sku("abc-123") == "ABC-123"'),t('Tudo inválido', 'normalizar_sku("@ /!") == ""')],
  ['O ^ dentro de [] nega o grupo.', 'Use re.sub(padrao, "", texto.upper()).'], { pitfall: 'Normalizar pode fazer dois SKUs diferentes virarem a mesma chave. Detecte colisões em importações reais.' });

L('m11', 'pipeline', 'Pipelines e registros de execução',
  'Um pipeline encadeia etapas como ler, validar, transformar e exportar. Cada etapa deve ter um contrato claro. logging registra o que aconteceu com níveis como INFO e ERROR. Isso ajuda a investigar falhas sem espalhar print em todo o sistema.',
  'Decida o que acontece com uma linha inválida. Neste exercício, ela será rejeitada e contada; linhas válidas continuarão. Em uma operação crítica, talvez seja necessário cancelar o lote inteiro. A escolha precisa ser explícita.',
  'import logging\n\nlogging.basicConfig(level=logging.INFO)\nlogging.info("Iniciando importação")\n# Leia, valide, transforme e grave\nlogging.info("Importação concluída")',
  'Implemente importar(linhas): cada linha tem sku e quantidade. Aceite SKU string não vazio após strip e quantidade int positiva (sem bool). Retorne (totais_por_sku, rejeitadas), contando linhas inválidas.',
  'def importar(linhas):\n    pass\n',
  'def importar(linhas):\n    totais = {}\n    rejeitadas = 0\n    for linha in linhas:\n        sku, qtd = linha.get("sku"), linha.get("quantidade")\n        if not isinstance(sku, str) or not sku.strip() or type(qtd) is not int or qtd <= 0:\n            rejeitadas += 1\n            continue\n        sku = sku.strip()\n        totais[sku] = totais.get(sku,0) + qtd\n    return totais, rejeitadas',
  [t('Separa linhas ruins', 'importar([{"sku":" A ","quantidade":2},{"sku":"","quantidade":1},{"sku":"A","quantidade":3}]) == ({"A":5},1)'),t('Dados vazios', 'importar([]) == ({},0)'),t('Rejeita tipo errado', 'importar([{"sku":"A","quantidade":"2"},{"sku":"B","quantidade":True}]) == ({},2)')],
  ['Conte a rejeição e use continue.', 'Normalize o SKU antes de acumular.'], { pitfall: 'Não escreva senhas, tokens ou dados pessoais desnecessários nos logs.' });

L('m11', 'idempotencia', 'Idempotência e automação segura',
  'Uma operação idempotente pode ser repetida sem duplicar seu efeito. Em importações, um identificador de pedido ajuda a evitar contar duas vezes o mesmo registro. Esse cuidado é essencial quando um processo é executado novamente após uma falha.',
  'Defina a regra para duplicatas e conflitos. Aqui conservaremos a primeira ocorrência de cada id, na ordem original. Em um banco de dados, uma restrição UNIQUE e uma transação ajudam a garantir a regra mesmo com vários processos.',
  'vistos = set()\nresultado = []\nfor pedido in [{"id":1}, {"id":1}, {"id":2}]:\n    if pedido["id"] not in vistos:\n        vistos.add(pedido["id"])\n        resultado.append(pedido)\nprint(resultado)',
  'Implemente sem_duplicatas(pedidos): devolva uma nova lista com apenas a primeira ocorrência de cada id, preservando a ordem. Não altere a entrada. Todos os pedidos possuem id.',
  'def sem_duplicatas(pedidos):\n    pass\n',
  'def sem_duplicatas(pedidos):\n    vistos = set()\n    resultado = []\n    for pedido in pedidos:\n        if pedido["id"] not in vistos:\n            vistos.add(pedido["id"])\n            resultado.append(pedido)\n    return resultado',
  [t('Mantém primeira ocorrência', 'sem_duplicatas([{"id":1,"valor":10},{"id":1,"valor":20},{"id":2,"valor":30}]) == [{"id":1,"valor":10},{"id":2,"valor":30}]'),t('Entrada vazia', 'sem_duplicatas([]) == []'),t('Não altera entrada', '__unchanged(sem_duplicatas, [{"id":1},{"id":1}])')],
  ['Consulte um set antes de acrescentar ao resultado.', 'Guarde o id somente quando aceitar o pedido.'], { pitfall: 'Remover duplicatas pelo valor total em vez de um identificador pode eliminar pedidos diferentes com o mesmo preço.' });

L('m12', 'contagem', 'Entrevista: contagem e frequência',
  'Em um desafio técnico, confirme o contrato antes de programar. O que fazer com entrada vazia? Maiúsculas importam? Depois mostre um exemplo e explique a estratégia. Para contar frequências, um dicionário resolve em uma passagem.',
  'Não é preciso decorar uma solução. Explique por que uma chave representa um item e por que somar ao acumulador funciona. Depois discuta tempo O(n) e espaço O(k), com k valores diferentes.',
  'from collections import Counter\n\nprint(dict(Counter(["A","B","A"])))',
  'Implemente frequencias(itens): retorne um dicionário com a quantidade de ocorrências de cada item. Os itens são strings. Considere maiúsculas e minúsculas diferentes.',
  'def frequencias(itens):\n    pass\n',
  'def frequencias(itens):\n    resultado = {}\n    for item in itens:\n        resultado[item] = resultado.get(item,0) + 1\n    return resultado',
  [t('Conta ocorrências', 'frequencias(["A","B","A"]) == {"A":2,"B":1}'),t('Entrada vazia', 'frequencias([]) == {}'),t('Distingue caixa', 'frequencias(["a","A"]) == {"a":1,"A":1}')],
  ['Um dicionário começa vazio.', 'Para cada item, leia o total com get(item, 0) e acrescente 1.'], { pitfall: 'Cite o custo de memória e as suposições sobre a entrada, não apenas o nome do algoritmo.' });

L('m12', 'busca', 'Entrevista: dois valores e uma soma',
  'O problema de dois valores pede dois índices diferentes cujos valores somam um alvo. A solução simples testa todos os pares. Uma solução com dicionário guarda valores já vistos e procura o complemento alvo - atual.',
  'Procure o complemento antes de guardar o valor atual; assim você não reutiliza o mesmo índice. Repetições são permitidas quando existem dois elementos distintos. Explique como a estratégia evita O(n²) comparações.',
  'alvo = 10\natual = 4\ncomplemento = alvo - atual\nprint(complemento)  # precisamos encontrar 6',
  'Implemente dois_indices(numeros, alvo): retorne uma tupla (i, j), com i < j, do primeiro par encontrado ao percorrer j da esquerda para a direita. Guarde o primeiro índice de cada valor. Se não existir par, retorne None.',
  'def dois_indices(numeros, alvo):\n    pass\n',
  'def dois_indices(numeros, alvo):\n    vistos = {}\n    for j, numero in enumerate(numeros):\n        complemento = alvo - numero\n        if complemento in vistos:\n            return vistos[complemento], j\n        if numero not in vistos:\n            vistos[numero] = j\n    return None',
  [t('Encontra o par', 'dois_indices([2,7,11,15],9) == (0,1)'),t('Valores repetidos', 'dois_indices([3,3],6) == (0,1)'),t('Não reutiliza índice', 'dois_indices([3],6) is None'),t('Números negativos', 'dois_indices([-2,4,7],2) == (0,1)'),t('Primeiro índice de repetidos', 'dois_indices([2,2,3],5) == (0,2)')],
  ['Guarde valor -> índice em um dicionário.', 'Procure alvo - numero antes de guardar numero.'], { pitfall: 'Não prometa O(1) de memória: o dicionário pode armazenar até n valores.' });

L('m12', 'refatoracao', 'Refatoração sem regressões',
  'Refatorar é melhorar a estrutura sem mudar o comportamento esperado. Comece por testes que descrevem o contrato atual. Nomes claros, funções pequenas e ausência de efeitos inesperados ajudam a revisar o código.',
  'Ordenar uma lista recebida com sort() muda a entrada. sorted() devolve uma nova lista. Um relatório pode precisar de um desempate alfabético para manter resultados estáveis.',
  'produtos = [{"sku":"B","total":10},{"sku":"A","total":10}]\nordenados = sorted(produtos, key=lambda p: (-p["total"], p["sku"]))\nprint(ordenados)',
  'Implemente top_produtos(totais, limite=3): totais é um dicionário SKU -> quantidade. Retorne pares (sku, quantidade) em ordem de quantidade decrescente e SKU crescente no empate, limitado ao número pedido. Se limite <= 0, retorne []. Não modifique o dicionário.',
  'def top_produtos(totais, limite=3):\n    pass\n',
  'def top_produtos(totais, limite=3):\n    if limite <= 0:\n        return []\n    return sorted(totais.items(), key=lambda item: (-item[1], item[0]))[:limite]',
  [t('Ordenação e desempate', 'top_produtos({"B":10,"A":10,"C":5},2) == [("A",10),("B",10)]'),t('Sem dados', 'top_produtos({}) == []'),t('Limite zero', 'top_produtos({"A":1},0) == []'),t('Preserva entrada', '__unchanged(top_produtos, {"A":1,"B":2})')],
  ['Use sorted(totais.items(), key=...).', 'Uma chave (-quantidade, sku) ordena nos dois critérios.'], { pitfall: 'Uma mudança de nome não deve alterar validações, ordenação ou formatos que outras partes dependem.' });

L('m12', 'final', 'Desafio final: relatório de produção',
  'Um desafio maior combina conceitos já aprendidos. Leia o contrato, divida em etapas e escreva exemplos. A solução precisa lidar com vendas canceladas, período, agrupamento por SKU e ordem do relatório.',
  'Explique quais linhas entram, como são somadas e como o desempate funciona. Um entrevistador pode perguntar o que mudaria para milhões de linhas: leitura em fluxo, agregação SQL e medição são caminhos para discutir.',
  '# Plano de solução:\n# 1. Filtrar por status e período\n# 2. Somar quantidades por SKU\n# 3. Ordenar por total decrescente e SKU crescente\n# 4. Devolver pares (sku, quantidade)',
  'Implemente relatorio(vendas, inicio, fim). Inclua só status="concluido" e datas no intervalo inclusivo. Some por SKU e retorne pares (sku, quantidade) por total decrescente, com SKU crescente no empate. Não altere as vendas.',
  'def relatorio(vendas, inicio, fim):\n    pass\n',
  'def relatorio(vendas, inicio, fim):\n    totais = {}\n    for venda in vendas:\n        if venda["status"] == "concluido" and inicio <= venda["data"] <= fim:\n            sku = venda["sku"]\n            totais[sku] = totais.get(sku,0) + venda["quantidade"]\n    return sorted(totais.items(), key=lambda item: (-item[1], item[0]))',
  [t('Filtra, agrupa e ordena', 'relatorio(__final_sales,"2027-01-01","2027-01-31") == [("A",5),("B",4)]'),t('Exclui fora do período', 'relatorio(__final_sales,"2027-02-01","2027-02-28") == [("C",100)]'),t('Intervalo sem vendas', 'relatorio(__final_sales,"2028-01-01","2028-01-31") == []'),t('Desempate alfabético', 'relatorio(__tie_sales,"2027-01-01","2027-01-31") == [("A",2),("B",2)]'),t('Não altera dados', '__unchanged(lambda x: relatorio(x,"2027-01-01","2027-01-31"), __final_sales)')],
  ['Filtre por status e data antes de somar.', 'Use o padrão get(sku, 0) e ordene os itens do dicionário.'], { minutes: 50, pitfall: 'Os testes desta aula avaliam o contrato apresentado. Um produto real também precisa validar as colunas, tipos e permissões de acesso.' });

export const quizzes = {
  m01: [
    q('m01-q1','Qual valor é um inteiro em Python?',['"100"','100','100.0'],1,'100 é int; "100" é string e 100.0 é float.'),
    q('m01-q2','Quanto vale 235 % 100?',['2','35','2.35'],1,'% retorna o resto da divisão, portanto 35.'),
    q('m01-q3','O que input() devolve?',['Sempre uma string','Sempre um inteiro','O tipo daquilo que foi digitado'],0,'input devolve texto. Você converte explicitamente quando precisa de um número.'),
    q('m01-q4','Qual código soma numericamente os textos "10" e "5"?',['"10" + "5"','int("10") + int("5")','print("10", "5")'],1,'Converta para int antes de somar. Strings são concatenadas.'),
    q('m01-q5','O que = faz em quantidade = 100?',['Compara dois valores','Atribui um valor ao nome','Imprime a quantidade'],1,'= faz atribuição. == faz comparação.')
  ],
  m02: [
    q('m02-q1','range(1, 4) produz quais números?',['1, 2, 3','1, 2, 3, 4','0, 1, 2, 3'],0,'O limite final não entra no range.'),
    q('m02-q2','Uma venda precisa estar paga e ter estoque. Qual operador liga as regras?',['or','and','not'],1,'and exige que as duas condições sejam verdadeiras.'),
    q('m02-q3','O que pode causar um while infinito?',['Atualizar o contador','A condição nunca ficar falsa','Usar números inteiros'],1,'O estado que controla a condição precisa chegar a uma condição de parada.'),
    q('m02-q4','Desconto a partir de 100 unidades deve usar qual condição?',['qtd > 100','qtd >= 100','qtd == 100'],1,'>= inclui o limite e todos os valores maiores.'),
    q('m02-q5','O que determina o bloco de um if em Python?',['Chaves {}','Indentação','Um ponto e vírgula'],1,'A indentação indica quais instruções pertencem ao bloco.')
  ],
  m03: [
    q('m03-q1','Qual é o primeiro índice de uma lista?',['0','1','-1'],0,'Índices começam em zero; -1 acessa o último item.'),
    q('m03-q2','Qual estrutura associa SKU a quantidade?',['Dicionário','String','Tupla vazia'],0,'Um dicionário mapeia chaves para valores.'),
    q('m03-q3','Qual expressão remove duplicatas e ordena a lista xs?',['list(xs)','sorted(set(xs))','xs.append(xs)'],1,'set remove duplicatas; sorted retorna uma lista ordenada.'),
    q('m03-q4','O que {} cria?',['Um set vazio','Um dicionário vazio','Uma lista vazia'],1,'Para set vazio, use set().'),
    q('m03-q5','Uma função deve preservar a lista recebida. Qual operação ajuda?',['lista.sort()','lista.clear()','sorted(lista)'],2,'sorted cria uma nova lista, preservando a original.')
  ],
  m04: [
    q('m04-q1','Uma função sem return devolve o quê?',['0','None','O último valor impresso'],1,'Sem retorno explícito, a resposta é None.'),
    q('m04-q2','Por que evitar uma lista como valor padrão de parâmetro?',['Pode compartilhar estado entre chamadas','Listas não são permitidas','Torna a função assíncrona'],0,'Valores padrão são criados uma vez e um objeto mutável pode guardar alterações.'),
    q('m04-q3','Anotações de tipos validam automaticamente todas as entradas?',['Sim','Não','Apenas em funções pequenas'],1,'São informações sobre o contrato. Validação precisa ser implementada ou fornecida por ferramentas.'),
    q('m04-q4','Qual nome pode esconder a biblioteca json ao importar?',['relatorio.py','json.py','app.py'],1,'Um arquivo local com o mesmo nome pode ser encontrado antes da biblioteca.'),
    q('m04-q5','Qual é uma vantagem de retornar um número em vez de só imprimir?',['A função fica sem parâmetros','Outras partes podem reutilizar o resultado','O programa não pode ter erros'],1,'Retorno separa cálculo de apresentação e facilita os testes.')
  ],
  m05: [
    q('m05-q1','int("abc") normalmente gera qual exceção?',['ValueError','IndexError','KeyError'],0,'O texto não representa um inteiro válido.'),
    q('m05-q2','Qual conjunto melhor testa uma regra com limite de 100?',['10, 20, 30','99, 100, 101','1000, 2000, 3000'],1,'Valores abaixo, no limite e acima revelam erros de fronteira.'),
    q('m05-q3','Qual comportamento assertRaises verifica?',['Uma exceção esperada','Um texto impresso','O tamanho do arquivo'],0,'assertRaises exige que o trecho gere a exceção informada.'),
    q('m05-q4','Comparar todos os pares de n itens tende a ter qual custo?',['O(1)','O(n²)','O(log n)'],1,'Dois percursos aninhados podem fazer aproximadamente n vezes n comparações.'),
    q('m05-q5','Por que evitar except sem tipo?',['Ele pode esconder erros inesperados','Ele só funciona no Windows','Ele acelera demais o programa'],0,'Trate os erros que você sabe resolver e deixe outros visíveis.')
  ],
  m06: [
    q('m06-q1','Qual função transforma texto JSON em estruturas Python?',['json.dumps','json.loads','eval'],1,'loads faz a leitura de uma string JSON sem executar código.'),
    q('m06-q2','csv.DictReader normalmente devolve quantidades como quê?',['Texto','Decimal','Inteiro sempre'],0,'CSV é texto; faça a conversão e valide os valores.'),
    q('m06-q3','Qual construção preserva corretamente o decimal 0.1?',['Decimal(0.1)','Decimal("0.1")','int(0.1)'],1,'Uma string evita trazer a aproximação binária do float.'),
    q('m06-q4','Somar 30 dias é sempre avançar exatamente um mês?',['Sim','Não','Só com timedelta'],1,'Meses têm quantidades diferentes de dias. Defina a regra do prazo.'),
    q('m06-q5','Os arquivos escritos pelo laboratório ficam onde?',['No disco do celular para sempre','No sistema de arquivos virtual temporário','No repositório GitHub'],1,'O Python roda no navegador; os arquivos da execução são temporários.')
  ],
  m07: [
    q('m07-q1','O que self representa em um método?',['A instância atual','A classe de todos os módulos','Um arquivo externo'],0,'self dá acesso aos atributos e métodos daquele objeto.'),
    q('m07-q2','Pedido tem itens. Qual relação descreve isso melhor?',['Herança','Composição','Recursão'],1,'Pedido usa itens; ele não é uma especialização de item.'),
    q('m07-q3','O que dataclass pode gerar automaticamente?',['Um banco de dados','__init__ e __repr__','Uma rota HTTP'],1,'dataclass usa os campos para gerar métodos comuns.'),
    q('m07-q4','Como criar uma lista padrão própria para cada dataclass?',['field(default_factory=list)','itens = [] em todos os casos','Uma única lista global'],0,'A fábrica cria uma nova lista para cada instância.'),
    q('m07-q5','O que super() permite?',['Acessar a implementação da classe base','Salvar um arquivo','Executar qualquer função sem parâmetros'],0,'super dá acesso ao comportamento da base no contexto da hierarquia.')
  ],
  m08: [
    q('m08-q1','Qual forma usa parâmetros SQL corretamente?',['f"SELECT * FROM produtos WHERE sku = {sku}"','execute("SELECT * FROM produtos WHERE sku = ?", (sku,))','execute("SELECT * FROM produtos WHERE sku = ?")'],1,'Passe valores como parâmetros, separados do SQL.'),
    q('m08-q2','Qual operação soma quantidades por SKU?',['SUM com GROUP BY','ORDER BY sozinho','DELETE com WHERE'],0,'GROUP BY reúne o grupo e SUM agrega os valores.'),
    q('m08-q3','Para que serve uma transação?',['Garantir operações conjuntas ou reversão em falha','Substituir todos os testes','Converter Python em HTML'],0,'As operações relacionadas devem ser confirmadas juntas ou revertidas.'),
    q('m08-q4','with con fecha automaticamente uma conexão sqlite3?',['Sim','Não','Apenas em banco em memória'],1,'O contexto trata a transação; feche a conexão explicitamente.'),
    q('m08-q5','Qual é um custo de manter índices?',['O banco perde as tabelas','Mais espaço e trabalho nas escritas','Consultas deixam de usar SQL'],1,'Índices ajudam algumas leituras, mas também precisam ser atualizados.')
  ],
  m09: [
    q('m09-q1','Qual pasta deve ser ignorada no Git?',['.venv','src','tests'],0,'O ambiente virtual é recriado a partir das dependências.'),
    q('m09-q2','Qual comando registra uma versão local?',['git push','git commit','git status'],1,'commit registra; push envia; status inspeciona.'),
    q('m09-q3','Onde uma chave privada de API deve ficar?',['No JavaScript enviado ao navegador','Em um segredo no backend','No README público'],1,'Qualquer dado enviado ao frontend pode ser lido pelo visitante.'),
    q('m09-q4','O que git diff --staged mostra?',['As mudanças selecionadas para o próximo commit','Somente os commits remotos','A senha do GitHub'],0,'Revise o que está na área de preparação antes de confirmar.'),
    q('m09-q5','Qual informação ajuda mais alguém a usar seu projeto?',['Comandos de instalação, execução e testes','Só uma lista de linguagens','Só o nome do autor'],0,'Uma entrega reproduzível precisa de instruções completas e exemplos.')
  ],
  m10: [
    q('m10-q1','Qual código HTTP costuma indicar recurso criado?',['201','404','500'],0,'201 Created comunica que a criação foi concluída.'),
    q('m10-q2','O que um modelo Pydantic ajuda a fazer?',['Declarar e validar dados recebidos','Publicar o Pages automaticamente','Substituir todas as regras de negócio'],0,'Modelos descrevem o contrato, mas regras de domínio ainda precisam ser definidas.'),
    q('m10-q3','O que await faz?',['Espera uma operação assíncrona','Cria uma nova CPU','Transforma uma string em int'],0,'await suspende a corrotina para aguardar a operação.'),
    q('m10-q4','Código síncrono lento dentro de async def pode bloquear o loop?',['Sim','Não','Apenas com print'],0,'async por si só não transforma uma chamada bloqueante em assíncrona.'),
    q('m10-q5','Onde você deve iniciar um servidor FastAPI nesta trilha?',['No computador ou em hospedagem de backend','Dentro do GitHub Pages','Dentro de um arquivo README'],0,'Pages entrega arquivos estáticos; a prática local roda o servidor real.')
  ],
  m11: [
    q('m11-q1','Qual regra evita duplicar pedidos em uma reimportação?',['Usar id único e controlar duplicatas','Somar tudo novamente','Remover pedidos com mesmo preço'],0,'Identificadores e restrições únicas preservam a identidade do registro.'),
    q('m11-q2','Ao normalizar SKUs, qual risco deve ser considerado?',['Dois SKUs virarem a mesma chave','Python deixar de aceitar strings','CSV passar a ser binário'],0,'A normalização pode criar colisões. Verifique antes de juntar dados.'),
    q('m11-q3','O que não deve aparecer nos logs?',['Tokens e senhas','Quantidade de linhas processadas','O nome da etapa'],0,'Registre informações úteis sem expor segredos.'),
    q('m11-q4','Por que separar leitura, validação e transformação?',['Para testar responsabilidades e investigar falhas','Para eliminar a necessidade de dados','Para criar mais linhas sem propósito'],0,'Etapas claras tornam o processo mais fácil de testar e reproduzir.'),
    q('m11-q5','Um relatório por período precisa definir o quê?',['Qual data é usada e se os limites entram','Somente a cor da planilha','O nome do computador'],0,'Critérios explícitos evitam números diferentes para a mesma pergunta.')
  ],
  m12: [
    q('m12-q1','Qual deve ser um dos primeiros passos em um desafio técnico?',['Confirmar entradas, saídas e limites','Programar sem perguntar o contrato','Decorar uma resposta'],0,'Entender o problema evita resolver uma regra diferente da pedida.'),
    q('m12-q2','No problema de dois valores, quando guardar o número atual?',['Depois de procurar seu complemento','Sempre antes de procurar','Não precisa guardar nada'],0,'Procurar primeiro evita reutilizar o índice atual.'),
    q('m12-q3','O que refatoração deve preservar?',['O comportamento esperado','Todos os nomes antigos','A quantidade de linhas'],0,'Refatoração altera a estrutura e mantém o contrato.'),
    q('m12-q4','Contar n itens em um dicionário costuma exigir qual tempo?',['O(n)','O(n²) sempre','O(1) para qualquer entrada'],0,'Uma passagem faz trabalho proporcional a n, em condições usuais de hash.'),
    q('m12-q5','O que ajuda a demonstrar competência em um projeto?',['Problema, decisões, testes e instruções reproduzíveis','Só o número de tecnologias','Só um screenshot'],0,'Mostre como o projeto funciona e por que as escolhas resolvem o problema.')
  ]
};

export const diagnostic = [quizzes.m01[0], quizzes.m01[2], quizzes.m02[0], quizzes.m03[1], quizzes.m04[0], quizzes.m05[1], quizzes.m06[0], quizzes.m08[0], quizzes.m09[1], quizzes.m10[2]];

export { lessons };
export const lessonMap = Object.assign(Object.create(null), Object.fromEntries(lessons.map(l => [l.id, l])));
