function Historico({ movimentacoes, produtos }) {
  const movimentacoesRecentes = [...movimentacoes].reverse();

  return (
    <section aria-labelledby="titulo-historico">
      <div className="card">
        <div className="card-header">
          <h2 id="titulo-historico">
            <i className="fa-solid fa-timeline" aria-hidden="true"></i> Histórico de Atividades
          </h2>
        </div>
        <div className="table-container">
          <table aria-labelledby="titulo-historico">
            <thead>
              <tr>
                <th scope="col">Data</th>
                <th scope="col">Hora</th>
                <th scope="col">Produto</th>
                <th scope="col">Tipo</th>
                <th scope="col">Quantidade</th>
                <th scope="col">Observação</th>
              </tr>
            </thead>
            <tbody>
              {movimentacoesRecentes.length === 0 && (
                <tr>
                  <td colSpan="6" className="table-empty">
                    Nenhuma movimentação registrada até o momento.
                  </td>
                </tr>
              )}
              {movimentacoesRecentes.map((movimentacao) => {
                const produto = produtos.find((produto) => produto.id === movimentacao.produtoId);
                const nomeProduto = movimentacao.produtoNome || produto?.nome || 'Produto removido';
                const dataFormatada = movimentacao.data.split('-').reverse().join('/');

                return (
                  <tr key={movimentacao.id}>
                    <td>{dataFormatada}</td>
                    <td>{movimentacao.hora || '-'}</td>
                    <td>{nomeProduto}</td>
                    <td>{movimentacao.tipo === 'entrada' ? 'Entrada' : 'Saída'}</td>
                    <td>{movimentacao.quantidade}</td>
                    <td>{movimentacao.observacao || '-'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default Historico;
