# StockMaster — Trabalho de Frontend II

**Acesse o site:** [StockMaster no GitHub Pages](https://zylbertalves.github.io/stockmaster/)

O StockMaster é uma aplicação de controle de estoque desenvolvida como trabalho da disciplina de Frontend II. O objetivo é aplicar os conceitos básicos de React em um sistema que permite cadastrar produtos, acompanhar as quantidades disponíveis e registrar entradas e saídas.

O projeto partiu de uma versão em HTML, CSS e JavaScript puro. Na versão atual, a interface foi dividida em componentes React, mantendo a identidade visual e usando funções simples para organizar as operações.

## Tecnologias utilizadas

- **React e JavaScript:** componentes, estados, props e eventos.
- **Vite:** servidor de desenvolvimento e geração do build.
- **CSS puro:** cores, espaçamentos, formulários, tabelas e responsividade.
- **localStorage:** armazenamento dos dados no navegador.
- **Font Awesome:** ícones instalados localmente pelo npm.

A aplicação funciona no navegador, sem backend, banco de dados ou API externa. Os produtos e as movimentações são representados por objetos JavaScript simples.

## Funcionalidades

| Tela | Funcionamento |
| --- | --- |
| Dashboard | Mostra o total de produtos cadastrados, o valor do estoque, os alertas e um gráfico de pizza com a porcentagem de unidades de cada categoria. |
| Novo Produto | Cadastra nome, código, categoria, preço, quantidade inicial e estoque mínimo. |
| Estoque | Lista os produtos, permite buscar por nome ou código, filtrar por categoria e excluir um produto. |
| Movimentações | Registra entrada ou saída, com quantidade, data e observação, atualizando o estoque. |
| Histórico | Mostra produto, tipo, quantidade, data, hora e observação de cada movimentação. |

A sidebar permite navegar entre as telas e escolher o tema claro ou escuro. O layout se adapta a computadores e celulares.

### Regras do estoque

- Cada produto deve ter um código único.
- Preço, quantidade inicial e estoque mínimo não podem ser negativos.
- As quantidades devem ser números inteiros.
- Uma movimentação deve ter quantidade maior que zero.
- Uma saída maior que o saldo disponível é recusada, sem alterar o estoque ou o histórico.
- O status é **Zerado** quando a quantidade é zero, **Estoque Baixo** quando é positiva e menor ou igual ao mínimo, e **Normal** acima do mínimo.
- O total de produtos representa o número de cadastros. O valor do estoque é a soma de `preco * quantidade` de cada produto.
- O indicador de alertas inclui produtos com estoque baixo ou zerado.
- O gráfico de pizza soma as unidades de cada categoria e calcula `quantidade da categoria / total de unidades * 100`. Os nomes e percentuais aparecem dentro das fatias, com texto branco e divisórias. Fatias menores que 8% usam etiquetas coloridas abaixo do gráfico para evitar sobreposição; ao passar o mouse sobre uma fatia, também é possível consultar sua categoria, percentual e quantidade. Todas as 10 categorias aparecem na legenda, inclusive as que estão com 0%. O gráfico acompanha cadastros, exclusões, entradas e saídas; quando o estoque está vazio, mostra uma mensagem em vez de fatias. Os percentuais são arredondados para uma casa decimal; participações positivas menores que 0,1% são indicadas como `< 0,1%`.
- Excluir um produto mantém suas movimentações no histórico. Os registros novos guardam o nome do produto para continuar identificados após a exclusão.

## Organização dos arquivos

```text
stockmaster/
├── .github/workflows/deploy.yml
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
├── README.md
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── styles.css
    └── components/
        ├── Sidebar.jsx
        ├── Dashboard.jsx
        ├── GraficoEstoque.jsx
        ├── CadastroProduto.jsx
        ├── Estoque.jsx
        ├── Movimentacao.jsx
        └── Historico.jsx
```

`main.jsx` inicia o React e importa os estilos. `App.jsx` concentra os dados compartilhados, a navegação e as funções `adicionarProduto`, `excluirProduto` e `registrarMovimentacao`. Cada componente da pasta `components` cuida da sua parte da interface.

`styles.css` reúne a apresentação visual, usando propriedades comuns de CSS, Flexbox, Grid e media queries. O arquivo `vite.config.js` configura o plugin React. As dependências e os comandos ficam em `package.json`; `package-lock.json` registra as versões instaladas.

## Conceitos de React aplicados

### Componentes e props

A interface foi dividida em sete componentes separados. O `App` passa os dados e as funções por props, permitindo que diferentes telas utilizem a mesma lista de produtos.

Por exemplo, `Estoque` recebe `produtos`, `categorias` e `excluirProduto`. Quando o usuário clica na lixeira, o componente chama a função recebida. O `App` atualiza a lista, e o React exibe o resultado na interface.

### Estados com useState

| Componente | Estados utilizados |
| --- | --- |
| App | `produtos`, `movimentacoes`, `abaAtual`, `tema` e `erroArmazenamento`. |
| CadastroProduto | `nome`, `codigo`, `categoria`, `preco`, `quantidade`, `estoqueMinimo` e `mensagem`. |
| Estoque | `busca` e `categoriaSelecionada`. |
| Movimentacao | `produtoId`, `tipo`, `quantidade`, `data`, `observacao` e `mensagem`. |

`Sidebar`, `Dashboard`, `GraficoEstoque` e `Historico` recebem informações por props e não precisam de estados próprios. A aba exibida é escolhida pela renderização condicional no `App`.

### Formulários e eventos

Os campos dos formulários são controlados: `value` recebe o valor do estado e `onChange` atualiza esse valor. O envio usa `onSubmit` e `preventDefault()` para evitar o recarregamento da página. Preço e quantidades são convertidos com `Number()` antes das operações.

Os botões utilizam `onClick` para navegar ou excluir produtos. A interface é atualizada pelo React, sem manipulação manual das tabelas e dos formulários pelo DOM.

### Listas com map e filter

`map` é usado para montar os botões de navegação, as opções dos selects e as linhas das tabelas. Também cria uma nova lista de produtos ao atualizar a quantidade de um item.

`filter` seleciona os produtos pela busca e categoria, identifica os itens em alerta no dashboard e remove um produto da lista durante a exclusão.

As listas são atualizadas criando novas cópias. Por exemplo, ao registrar uma movimentação:

```jsx
const produtosAtualizados = produtos.map((item) => {
  if (item.id === produto.id) {
    return { ...item, quantidade: novaQuantidade };
  }
  return item;
});

setProdutos(produtosAtualizados);
```

Esse trecho preserva os demais campos e produtos, alterando apenas a quantidade do item selecionado. Os elementos das listas usam `key` para serem identificados pelo React.

### Persistência com useEffect e localStorage

Na abertura da aplicação, os estados são inicializados com os dados do localStorage. O `useEffect` no `App` salva as informações quando `produtos`, `movimentacoes` ou `tema` mudam.

| Chave | Informação armazenada |
| --- | --- |
| `produtos_salvos` | Lista de produtos. |
| `movimentacoes_salvas` | Lista de movimentações. |
| `tema_selecionado` | Preferência de tema claro ou escuro. |

Como o localStorage guarda texto, as listas são convertidas com `JSON.stringify()` ao salvar e recuperadas com `JSON.parse()` ao carregar. As chaves foram mantidas da versão anterior para permitir o reaproveitamento dos dados na mesma origem.

Atualizar a página mantém produtos, movimentações e tema. A aba volta ao dashboard, e os campos dos formulários e os filtros começam com os valores iniciais. Se a gravação no navegador falhar, a aplicação apresenta um aviso.

## Como executar

É necessário ter Node.js e npm instalados. O projeto aceita Node.js da linha 20 a partir de 20.19.0, ou versões a partir de 22.12.0. Foi verificado com Node.js 24.19.0.

```bash
git clone https://github.com/ZYLBERTALVES/stockmaster.git
cd stockmaster
npm install
npm run dev
```

Abra o endereço informado no terminal. Para gerar e conferir a versão de produção:

```bash
npm run build
npm run preview
```

O build é gerado na pasta `dist`. Para encerrar o servidor local, pressione `Ctrl+C` no terminal. As pastas `node_modules` e `dist` não são versionadas, pois são geradas pelos comandos acima.

## Publicação

O site é hospedado no GitHub Pages. O arquivo `.github/workflows/deploy.yml` instala as dependências, executa o build e publica a pasta `dist` automaticamente quando uma alteração é enviada para a branch `main`. A opção `base` no Vite aponta para `/stockmaster/`, o caminho do projeto no GitHub Pages.

## Roteiro de demonstração

Em um navegador sem dados anteriores, a aplicação começa com o estoque vazio.

1. Cadastrar **Arroz Integral**, código **ARR001**, categoria **alimentos**, preço **R$ 10,00**, quantidade **15** e estoque mínimo **5**.
2. Conferir no dashboard: **1 produto**, **R$ 150,00** em estoque, **0 alertas** e **100% de alimentos** no gráfico, com **15 unidades**.
3. Buscar o produto pelo nome ou código e testar o filtro de categoria na tela de estoque.
4. Registrar uma entrada de **5 unidades** e conferir o saldo de **20**.
5. Registrar uma saída de **15 unidades** e conferir o saldo de **5**, com status de estoque baixo.
6. Tentar retirar **6 unidades**. A operação deve ser recusada, mantendo o saldo e o histórico anteriores.
7. Consultar o histórico para verificar as duas movimentações aceitas.
8. Atualizar a página e conferir que os produtos e as movimentações continuam salvos.
9. Excluir o produto e observar a atualização do dashboard e a permanência dos registros no histórico.

## Verificações realizadas

Foram verificados no Chrome os fluxos de cadastro, exclusão, entrada, saída, bloqueio de saldo insuficiente, busca por nome e código, filtro por categoria, dashboard e histórico. Também foram conferidos os códigos duplicados, valores inválidos e a persistência dos dados e do tema após atualizar a página.

O gráfico também foi verificado no Chrome com estoque vazio, produtos com saldo zero, vários produtos na mesma categoria, categoria única, todas as 10 categorias e percentuais menores que 0,1%. Foram conferidos os recálculos após cadastro, exclusão, entrada e saída, a persistência após recarregar e o layout nos temas claro e escuro, em larguras de 320, 390, 768, 1101 e 1440 pixels.

Os testes não apresentaram erros ou avisos no console. A responsividade foi conferida em larguras de 320, 390 e 768 pixels. O comando `npm run build` concluiu com sucesso.

## Limites do projeto

O armazenamento é local ao navegador e depende do endereço, da porta e do perfil utilizado. Por isso, abrir em outra porta ou em outro computador não compartilha os mesmos dados. Limpar os dados do site também remove as informações salvas.

A aplicação foi organizada para demonstrar os fundamentos estudados em Frontend II. Não utiliza autenticação, sincronização entre usuários ou armazenamento em servidor.
