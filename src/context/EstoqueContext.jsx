import { createContext, useContext, useEffect, useState } from 'react';

// O contexto permite que as telas acessem o mesmo estoque.
const EstoqueContext = createContext(null);

const categorias = [
  'bebidas', 'alimentos', 'limpeza', 'higiene', 'padaria',
  'hortifruti', 'frios', 'congelados', 'doces', 'outros',
];

function carregarLista(chave) {
  try {
    const dados = JSON.parse(localStorage.getItem(chave) || '[]');
    return Array.isArray(dados) ? dados : [];
  } catch {
    return [];
  }
}

// Este hook reúne a leitura do contexto e a verificação do Provider.
export function useEstoque() {
  const contexto = useContext(EstoqueContext);
  if (contexto === null) {
    throw new Error('useEstoque precisa estar dentro de EstoqueProvider.');
  }
  return contexto;
}

export function EstoqueProvider({ children }) {
  const [produtos, setProdutos] = useState(() => carregarLista('produtos_salvos'));
  const [movimentacoes, setMovimentacoes] = useState(() => carregarLista('movimentacoes_salvas'));
  const [erroArmazenamento, setErroArmazenamento] = useState('');

  // O estado guarda os dados durante o uso; o efeito salva no navegador.
  useEffect(() => {
    try {
      localStorage.setItem('produtos_salvos', JSON.stringify(produtos));
      localStorage.setItem('movimentacoes_salvas', JSON.stringify(movimentacoes));
      setErroArmazenamento('');
    } catch {
      setErroArmazenamento('Não foi possível salvar no navegador. Os dados desta sessão podem ser perdidos ao atualizar a página.');
    }
  }, [produtos, movimentacoes]);

  // Adiciona um novo produto usando um objeto simples.
  function adicionarProduto(dados) {
    const nome = dados.nome.trim();
    const codigo = dados.codigo.trim().toUpperCase();

    if (!nome || !codigo || !categorias.includes(dados.categoria)) {
      return 'Preencha nome, código e categoria.';
    }

    const codigoDuplicado = produtos.some((produto) => produto.codigo === codigo);
    if (codigoDuplicado) {
      return 'Um produto com este código já está cadastrado.';
    }

    if (!Number.isFinite(dados.preco) || dados.preco < 0) {
      return 'Informe um preço válido, maior ou igual a zero.';
    }

    if (!Number.isInteger(dados.quantidade) || dados.quantidade < 0 ||
        !Number.isInteger(dados.estoqueMinimo) || dados.estoqueMinimo < 0) {
      return 'Quantidade e estoque mínimo devem ser números inteiros, maiores ou iguais a zero.';
    }

    const novoProduto = {
      id: String(Date.now()),
      nome,
      codigo,
      categoria: dados.categoria,
      preco: dados.preco,
      quantidade: dados.quantidade,
      estoqueMinimo: dados.estoqueMinimo,
    };

    setProdutos([...produtos, novoProduto]);
    return '';
  }

  function excluirProduto(id) {
    setProdutos(produtos.filter((produto) => produto.id !== id));
  }

  // Registra entrada ou saída e atualiza o saldo do produto.
  function registrarMovimentacao(dados) {
    const produto = produtos.find((item) => item.id === dados.produtoId);

    if (!produto || !dados.data || (dados.tipo !== 'entrada' && dados.tipo !== 'saida')) {
      return 'Selecione o produto, o tipo e a data da movimentação.';
    }

    if (!Number.isInteger(dados.quantidade) || dados.quantidade <= 0) {
      return 'Informe uma quantidade inteira maior que zero.';
    }

    if (dados.tipo === 'saida' && dados.quantidade > produto.quantidade) {
      return `Estoque insuficiente! Quantidade disponível: ${produto.quantidade}.`;
    }

    let novaQuantidade = produto.quantidade + dados.quantidade;
    if (dados.tipo === 'saida') {
      novaQuantidade = produto.quantidade - dados.quantidade;
    }

    const produtosAtualizados = produtos.map((item) => {
      if (item.id === produto.id) {
        return { ...item, quantidade: novaQuantidade };
      }
      return item;
    });

    const novaMovimentacao = {
      id: String(Date.now()),
      produtoId: produto.id,
      produtoNome: produto.nome,
      tipo: dados.tipo,
      quantidade: dados.quantidade,
      data: dados.data,
      hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      observacao: dados.observacao.trim(),
    };

    setProdutos(produtosAtualizados);
    setMovimentacoes([...movimentacoes, novaMovimentacao]);
    return '';
  }

  const valor = {
    produtos,
    movimentacoes,
    categorias,
    adicionarProduto,
    excluirProduto,
    registrarMovimentacao,
    erroArmazenamento,
  };

  return (
    <EstoqueContext.Provider value={valor}>
      {children}
    </EstoqueContext.Provider>
  );
}
