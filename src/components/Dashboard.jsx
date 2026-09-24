import GraficoEstoque from './GraficoEstoque';

function Dashboard({ produtos, categorias }) {
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
    <section className="tab-content active" aria-labelledby="titulo-dashboard">
      <h2 id="titulo-dashboard" className="sr-only">Dashboard</h2>
      <div className="metrics-grid">
        <div className="metric-card card-blue">
          <i className="fa-solid fa-box icon-blue" aria-hidden="true"></i>
          <div>
            <h4>{produtos.length}</h4>
            <p>Total de Produtos</p>
          </div>
        </div>
        <div className="metric-card card-green">
          <i className="fa-solid fa-coins icon-green" aria-hidden="true"></i>
          <div>
            <h4>{valorFormatado}</h4>
            <p>Valor em Estoque</p>
          </div>
        </div>
        <div className="metric-card card-red">
          <i className="fa-solid fa-triangle-exclamation icon-red" aria-hidden="true"></i>
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
