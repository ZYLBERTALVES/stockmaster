import { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import CadastroProduto from './components/CadastroProduto';
import Estoque from './components/Estoque';
import Movimentacao from './components/Movimentacao';
import Historico from './components/Historico';

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

export default function App() {
  // Guarda as listas e a aba atual.
  const [produtos, setProdutos] = useState(() => carregarLista('produtos_salvos'));
  const [movimentacoes, setMovimentacoes] = useState(() => carregarLista('movimentacoes_salvas'));
  const [abaAtual, setAbaAtual] = useState('dashboard');
  const [tema, setTema] = useState(() => {
    try {
      return localStorage.getItem('tema_selecionado') === 'escuro' ? 'escuro' : 'claro';
    } catch {
      return 'claro';
    }
  });
  const [erroArmazenamento, setErroArmazenamento] = useState('');

  // Salva os dados no navegador quando os estados mudam.
  useEffect(() => {
    try {
      localStorage.setItem('produtos_salvos', JSON.stringify(produtos));
      localStorage.setItem('movimentacoes_salvas', JSON.stringify(movimentacoes));
      localStorage.setItem('tema_selecionado', tema);
      setErroArmazenamento('');
    } catch {
      setErroArmazenamento('Não foi possível salvar no navegador. Os dados desta sessão podem ser perdidos ao atualizar a página.');
    }
  }, [produtos, movimentacoes, tema]);

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

  return (
    <div className="container" data-theme={tema}>
      <Sidebar abaAtual={abaAtual} setAbaAtual={setAbaAtual} tema={tema} setTema={setTema} />
      <main className="main-content">
        {erroArmazenamento && <p className="mensagem mensagem-erro" role="alert">{erroArmazenamento}</p>}
        {abaAtual === 'dashboard' && <Dashboard produtos={produtos} categorias={categorias} />}
        {abaAtual === 'cadastro' && <CadastroProduto categorias={categorias} adicionarProduto={adicionarProduto} />}
        {abaAtual === 'estoque' && <Estoque produtos={produtos} categorias={categorias} excluirProduto={excluirProduto} />}
        {abaAtual === 'movimentacoes' && <Movimentacao produtos={produtos} registrarMovimentacao={registrarMovimentacao} />}
        {abaAtual === 'historico' && <Historico movimentacoes={movimentacoes} produtos={produtos} />}
      </main>
    </div>
  );
}
