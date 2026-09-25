import { useEstoque } from '../context/EstoqueContext';
import GraficoEstoque from './GraficoEstoque';

function Dashboard() {
  const { produtos, categorias } = useEstoque();
  let valorTotal = 0;

  produtos.forEach((produto) => {
    valorTotal += produto.preco * produto.quantidade;
  });

  const produtosEmAlerta = produtos.filter((produto) => {
    return produto.quantidade <= produto.estoqueMinimo;
  });

  const valorFormatado = valorTotal.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });

  return (
    <section aria-labelledby="titulo-dashboard">
      <h2 id="titulo-dashboard">Visão geral do estoque</h2>
      <p className="descricao">Acompanhe seus produtos, valores e itens que precisam de atenção.</p>
      <div className="metrics-grid">
        <div className="metric-card">
          <i className="fa-solid fa-box" aria-hidden="true"></i>
          <div>
            <h4>{produtos.length}</h4>
            <p>Total de Produtos</p>
          </div>
        </div>
        <div className="metric-card">
          <i className="fa-solid fa-coins" aria-hidden="true"></i>
          <div>
            <h4>{valorFormatado}</h4>
            <p>Valor em Estoque</p>
          </div>
        </div>
        <div className="metric-card">
          <i className="fa-solid fa-triangle-exclamation" aria-hidden="true"></i>
          <div>
            <h4>{produtosEmAlerta.length}</h4>
            <p>Itens em Alerta</p>
          </div>
        </div>
      </div>
      <GraficoEstoque produtos={produtos} categorias={categorias} />
    </section>
  );
}

export default Dashboard;
