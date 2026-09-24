function GraficoEstoque({ produtos, categorias }) {
  let totalUnidades = 0;
  produtos.forEach((produto) => {
    totalUnidades += produto.quantidade;
  });

  // Soma as unidades de cada categoria e calcula sua participação no estoque.
  const resumo = categorias.map((categoria) => {
    let quantidade = 0;
    produtos.forEach((produto) => {
      if (produto.categoria === categoria) {
        quantidade += produto.quantidade;
      }
    });

    let percentual = 0;
    if (totalUnidades > 0) {
      percentual = (quantidade / totalUnidades) * 100;
    }
    return { categoria, quantidade, percentual };
  });

  return (
    <section className="card estoque-grafico" aria-labelledby="titulo-grafico">
      <h2 id="titulo-grafico">Estoque por categoria</h2>
      <p className="grafico-descricao">Total de unidades em estoque: {totalUnidades}</p>
      {totalUnidades === 0 && <p className="mensagem">Sem estoque. Cadastre um produto ou registre uma entrada.</p>}
      <ul className="grafico-barras">
        {resumo.map((item) => {
          let percentualFormatado = item.percentual.toLocaleString('pt-BR', { maximumFractionDigits: 1 }) + '%';
          if (item.percentual > 0 && item.percentual < 0.1) {
            percentualFormatado = '< 0,1%';
          }

          return (
            <li key={item.categoria}>
              <div className="barra-legenda">
                <span className="categoria">{item.categoria}</span>
                <span>{item.quantidade} un. · {percentualFormatado}</span>
              </div>
              <div className="barra-fundo" aria-hidden="true">
                <div className="barra-valor" style={{ width: item.percentual + '%' }} />
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default GraficoEstoque;
