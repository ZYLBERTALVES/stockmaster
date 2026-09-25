# StockMaster — Trabalho de Frontend II

**Acesse o site:** [StockMaster no GitHub Pages](https://zylbertalves.github.io/stockmaster/)

O StockMaster é uma aplicação de controle de estoque desenvolvida como trabalho da disciplina de Frontend II. O objetivo é aplicar os conceitos básicos de React em um sistema que permite cadastrar produtos, acompanhar as quantidades disponíveis e registrar entradas e saídas.

O projeto partiu de uma versão em HTML, CSS e JavaScript puro. Na versão atual, a interface foi dividida em componentes React, mantendo a identidade visual e usando funções simples para organizar as operações.

## Tecnologias utilizadas

- **React e JavaScript:** componentes, estados, props, eventos, Context API e hook personalizado.
- **Vite:** servidor de desenvolvimento e geração do build.
- **CSS puro:** cores, espaçamentos, formulários, tabelas e responsividade.
- **localStorage:** armazenamento dos dados no navegador.
- **Font Awesome:** ícones instalados localmente pelo npm.

A aplicação funciona no navegador, sem backend, banco de dados ou API externa. Os produtos e as movimentações são representados por objetos JavaScript simples.

## Funcionalidades

| Tela | Funcionamento |
| --- | --- |
| Dashboard | Mostra o total de produtos cadastrados, o valor do estoque, uma lista dos produtos em alerta e um gráfico de barras com a porcentagem de unidades de cada categoria. |
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
- O indicador de alertas inclui produtos com estoque baixo ou zerado. Logo abaixo, o dashboard lista nome, código, quantidade disponível, estoque mínimo e status de cada produto em alerta. A lista acompanha as movimentações e exclusões; quando não há alertas, mostra uma mensagem.
- O gráfico de barras soma as unidades de cada categoria e calcula `quantidade da categoria / total de unidades * 100`. A porcentagem define a largura da barra no CSS. As 10 categorias aparecem com quantidade e percentual, inclusive as que estão com 0%. O gráfico acompanha cadastros, exclusões, entradas e saídas. Quando o estoque está vazio, mostra uma mensagem e barras zeradas. Os percentuais usam até uma casa decimal; participações positivas menores que 0,1% aparecem como `< 0,1%`.
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
    ├── context/
    │   └── EstoqueContext.jsx
    └── components/
        ├── Sidebar.jsx
        ├── Dashboard.jsx
        ├── GraficoEstoque.jsx
        ├── CadastroProduto.jsx
        ├── Estoque.jsx
        ├── Movimentacao.jsx
        └── Historico.jsx
```

`main.jsx` inicia o React, importa os estilos e envolve a aplicação com `EstoqueProvider`. `App.jsx` cuida da navegação e do tema. `context/EstoqueContext.jsx` concentra os produtos, as movimentações, a persistência do estoque e as funções `adicionarProduto`, `excluirProduto` e `registrarMovimentacao`. Cada componente da pasta `components` cuida da sua parte da interface.

`styles.css` reúne a apresentação visual, usando propriedades comuns de CSS, Flexbox, Grid e media queries. O arquivo `vite.config.js` configura o plugin React. As dependências e os comandos ficam em `package.json`; `package-lock.json` registra as versões instaladas.

## Conceitos de React aplicados

### Componentes e props

A interface foi dividida em sete componentes separados. Props continuam sendo usadas para informações recebidas diretamente de um componente pai: o `App` passa a navegação e o tema ao `Sidebar`, e o `Dashboard` passa produtos e categorias ao `GraficoEstoque`.

### Context API e hook personalizado

`EstoqueContext` é criado com `createContext`. O componente `EstoqueProvider` guarda os dados com `useState` e os disponibiliza às telas por meio de `EstoqueContext.Provider`. A propriedade `children` representa os componentes envolvidos pelo provedor.

O hook personalizado `useEstoque` usa `useContext` para acessar o contexto. Ele também mostra um erro claro se for chamado por um componente fora do provedor. Por exemplo, a tela de estoque lê:

```jsx
const { produtos, categorias, excluirProduto } = useEstoque();
```

Ao clicar na lixeira, a tela chama `excluirProduto`. O provedor atualiza a lista, e as telas que usam o contexto recebem os dados atualizados. Os estados dos campos, filtros e mensagens permanecem locais aos respectivos componentes. O contexto compartilha os dados; o localStorage preserva esses dados após recarregar a página.

### Estados com useState

| Componente | Estados utilizados |
| --- | --- |
| EstoqueProvider | `produtos`, `movimentacoes` e `erroArmazenamento`. |
| App | `abaAtual`, `tema` e `erroTema`. |
| CadastroProduto | `nome`, `codigo`, `categoria`, `preco`, `quantidade`, `estoqueMinimo` e `mensagem`. |
| Estoque | `busca` e `categoriaSelecionada`. |
| Movimentacao | `produtoId`, `tipo`, `quantidade`, `data`, `observacao` e `mensagem`. |

`Sidebar` e `GraficoEstoque` recebem informações por props. `Dashboard` e `Historico` acessam os dados pelo contexto. Esses quatro componentes não precisam de estados próprios. A aba exibida é escolhida pela renderização condicional no `App`.

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

Na abertura da aplicação, os estados são inicializados com os dados do localStorage. Um `useEffect` no `EstoqueProvider` salva produtos e movimentações quando essas listas mudam. Outro `useEffect`, no `App`, salva a preferência de tema. As mesmas chaves de armazenamento são mantidas, permitindo carregar os dados da versão anterior.

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

Após a introdução do contexto, foram conferidos no build de produção o compartilhamento dos dados entre as cinco telas, cadastro, filtros, movimentações, bloqueio de saldo insuficiente, histórico, gráfico e persistência. Também foram verificados o tema, o layout móvel e a exibição do aviso quando a gravação no localStorage falha, mantendo o uso dos dados em memória.

Foram verificados no Chrome os fluxos de cadastro, exclusão, entrada, saída, bloqueio de saldo insuficiente, busca por nome e código, filtro por categoria, dashboard e histórico. Também foram conferidos os códigos duplicados, valores inválidos e a persistência dos dados e do tema após atualizar a página.

O gráfico de barras usa somas, porcentagens, `map` e largura em CSS. Foram verificados no Chrome os casos de estoque vazio, saldo zero, categoria única, soma de produtos da mesma categoria e percentual menor que 0,1%. As cinco telas foram verificadas sem transbordamento horizontal em larguras de 320, 390, 768 e 1440 pixels. Também foram conferidos o tema escuro, a persistência após recarregar e a preservação do histórico após excluir um produto. A verificação não registrou erros nem avisos no console, e `npm run build` concluiu com sucesso.

Para verificar alterações, use o roteiro de demonstração acima, confira o layout em computador e celular e execute `npm run build`.

## Limites do projeto

O armazenamento é local ao navegador e depende do endereço, da porta e do perfil utilizado. Por isso, abrir em outra porta ou em outro computador não compartilha os mesmos dados. Limpar os dados do site também remove as informações salvas.

A aplicação foi organizada para demonstrar os fundamentos estudados em Frontend II. Não utiliza autenticação, sincronização entre usuários ou armazenamento em servidor.
