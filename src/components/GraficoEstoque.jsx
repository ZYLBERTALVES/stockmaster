const cores = [
  '#4f46e5', '#15803d', '#0e7490', '#be185d', '#a16207',
  '#4d7c0f', '#7e22ce', '#1d4ed8', '#be123c', '#475569',
];

function formatarPercentual(percentual) {
  if (percentual > 0 && percentual < 0.1) {
    return '< 0,1%';
  }

  return `${percentual.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}%`;
}

function formatarCategoria(categoria) {
  return categoria.charAt(0).toUpperCase() + categoria.slice(1);
}

function pontoNoCirculo(angulo, raio) {
  const radianos = (angulo * Math.PI) / 180;
  return { x: 200 + raio * Math.cos(radianos), y: 200 + raio * Math.sin(radianos) };
}

function GraficoEstoque({ produtos, categorias }) {
  const distribuicao = categorias.map((categoria, indice) => ({
    categoria,
    cor: cores[indice % cores.length],
    quantidade: 0,
  }));

  produtos.forEach((produto) => {
    const item = distribuicao.find((item) => item.categoria === produto.categoria);
    if (item) {
      item.quantidade += produto.quantidade;
    }
  });

  const totalUnidades = distribuicao.reduce((total, item) => total + item.quantidade, 0);
  let anguloAcumulado = -90;

  // As fatias e seus rótulos usam a mesma proporção de unidades em estoque.
  const fatias = distribuicao.map((item) => {
    const percentual = totalUnidades > 0 ? (item.quantidade / totalUnidades) * 100 : 0;
    const anguloInicial = anguloAcumulado;
    const anguloFinal = anguloInicial + (percentual / 100) * 360;
    const anguloMeio = (anguloInicial + anguloFinal) / 2;
    anguloAcumulado = anguloFinal;

    const inicio = pontoNoCirculo(anguloInicial, 190);
    const fim = pontoNoCirculo(anguloFinal, 190);
    const arcoMaior = percentual > 50 ? 1 : 0;
    const caminho = `M 200 200 L ${inicio.x} ${inicio.y} A 190 190 0 ${arcoMaior} 1 ${fim.x} ${fim.y} Z`;
    const posicaoRotulo = pontoNoCirculo(anguloMeio, 138);
    // Mantém os nomes do lado esquerdo virados para a leitura.
    const rotacao = anguloMeio > 90 && anguloMeio < 270 ? anguloMeio + 180 : anguloMeio;

    return { ...item, percentual, caminho, posicaoRotulo, rotacao };
  });
  const fatiasVisiveis = fatias.filter((item) => item.quantidade > 0);
  const fatiasPequenas = fatiasVisiveis.filter((item) => item.percentual < 8);

  return (
    <section className="card estoque-grafico" aria-labelledby="titulo-grafico-estoque">
      <h2 id="titulo-grafico-estoque">
        <i className="fa-solid fa-chart-pie" aria-hidden="true"></i> Estoque por categoria
      </h2>
      <p className="grafico-descricao">
        Participação de cada categoria no total de unidades em estoque.
      </p>

      <div className="grafico-conteudo">
        <figure className="grafico-figura">
          {totalUnidades > 0 ? (
            <svg
              className="grafico-pizza"
              viewBox="0 0 400 400"
              role="img"
              aria-labelledby="titulo-pizza"
              aria-describedby="legenda-grafico-estoque"
            >
              <title id="titulo-pizza">Estoque por categoria: nomes e porcentagens nas fatias</title>
              {fatiasVisiveis.map((item) => (
                <g key={item.categoria} className="grafico-fatia">
                  {fatiasVisiveis.length === 1 ? (
                    <circle cx="200" cy="200" r="190" fill={item.cor} />
                  ) : (
                    <path d={item.caminho} fill={item.cor} />
                  )}
                  <title>
                    {formatarCategoria(item.categoria)}: {formatarPercentual(item.percentual)} — {item.quantidade.toLocaleString('pt-BR')} {item.quantidade === 1 ? 'unidade' : 'unidades'}
                  </title>
                </g>
              ))}
              {fatiasVisiveis.filter((item) => item.percentual >= 8).map((item) => (
                <text
                  key={item.categoria}
                  className="fatia-rotulo"
                  textAnchor="middle"
                  aria-hidden="true"
                  transform={fatiasVisiveis.length === 1
                    ? 'translate(200 200)'
                    : `translate(${item.posicaoRotulo.x} ${item.posicaoRotulo.y}) rotate(${item.rotacao})`}
                >
                  <tspan x="0" y="-4" className="fatia-nome">{formatarCategoria(item.categoria)}</tspan>
                  <tspan x="0" y="16" className="fatia-percentual">{formatarPercentual(item.percentual)}</tspan>
                </text>
              ))}
            </svg>
          ) : (
            <div className="grafico-pizza grafico-sem-estoque" role="img" aria-label="Gráfico sem dados: nenhuma unidade em estoque.">
              <span>Sem estoque</span>
            </div>
          )}
          {fatiasPequenas.length > 0 && (
            <div className="grafico-rotulos-externos">
              <p>Fatias pequenas</p>
              <ul aria-label="Nomes das fatias pequenas">
                {fatiasPequenas.map((item) => (
                  <li key={item.categoria} style={{ backgroundColor: item.cor }}>
                    <span>{formatarCategoria(item.categoria)}</span>
                    <strong>{formatarPercentual(item.percentual)}</strong>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <figcaption className="grafico-total">
            <strong>{totalUnidades.toLocaleString('pt-BR')}</strong>
            <span>{totalUnidades === 1 ? 'unidade em estoque' : 'unidades em estoque'}</span>
          </figcaption>
        </figure>

        <ul id="legenda-grafico-estoque" className="grafico-legenda" aria-label="Distribuição por categoria">
          {fatias.map((item) => (
            <li key={item.categoria}>
              <span className="legenda-cor" style={{ backgroundColor: item.cor }} aria-hidden="true"></span>
              <div className="legenda-dados">
                <span className="legenda-categoria">{item.categoria}</span>
                <small>
                  {item.quantidade.toLocaleString('pt-BR')} {item.quantidade === 1 ? 'unidade' : 'unidades'}
                </small>
              </div>
              <strong className="legenda-percentual">{formatarPercentual(item.percentual)}</strong>
            </li>
          ))}
        </ul>
      </div>

      {totalUnidades === 0 && (
        <p className="grafico-vazio">
          Cadastre produtos com quantidade inicial ou registre uma entrada para visualizar as fatias do gráfico.
        </p>
      )}
    </section>
  );
}

export default GraficoEstoque;
