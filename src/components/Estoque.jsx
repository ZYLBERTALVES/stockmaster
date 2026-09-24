import { useState } from 'react';

function Estoque({ produtos, categorias, excluirProduto }) {
  const [busca, setBusca] = useState('');
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('todos');

  // Filtra os produtos por nome, código e categoria.
  const produtosFiltrados = produtos.filter((produto) => {
    const termoBusca = busca.trim().toLowerCase();
    const correspondeBusca = produto.nome.toLowerCase().includes(termoBusca)
      || produto.codigo.toLowerCase().includes(termoBusca);
    const correspondeCategoria = categoriaSelecionada === 'todos'
      || produto.categoria === categoriaSelecionada;

    return correspondeBusca && correspondeCategoria;
  });

  return (
    <section className="tab-content active" aria-labelledby="titulo-estoque">
      <div className="card">
        <div className="card-header">
          <h2 id="titulo-estoque">
            <i className="fa-solid fa-list-check" aria-hidden="true"></i> Controle de Inventário
          </h2>
          <div className="filter-bar">
            <div className="search-box">
              <label htmlFor="busca-estoque" className="sr-only">Buscar por nome ou código</label>
              <i className="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
              <input
                type="search"
                id="busca-estoque"
                placeholder="Buscar por nome ou código..."
                value={busca}
                onChange={(evento) => setBusca(evento.target.value)}
              />
            </div>
            <label htmlFor="filtro-categoria" className="sr-only">Filtrar por categoria</label>
            <select
              id="filtro-categoria"
              className="form-select select-compact"
              value={categoriaSelecionada}
              onChange={(evento) => setCategoriaSelecionada(evento.target.value)}
            >
              <option value="todos">Todas Categorias</option>
              {categorias.map((categoria) => (
                <option key={categoria} value={categoria}>
                  {categoria.charAt(0).toUpperCase() + categoria.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="table-container">
          <table aria-labelledby="titulo-estoque">
            <thead>
              <tr>
                <th scope="col">Nome</th>
                <th scope="col">Código</th>
                <th scope="col">Categoria</th>
                <th scope="col">Quantidade</th>
                <th scope="col">Mínimo</th>
                <th scope="col">Preço</th>
                <th scope="col">Status</th>
                <th scope="col">Ações</th>
              </tr>
            </thead>
            <tbody>
              {produtosFiltrados.length === 0 && (
                <tr>
                  <td colSpan="8" className="table-empty">
                    {produtos.length === 0
                      ? 'Nenhum produto registrado no momento.'
                      : 'Nenhum produto encontrado com os filtros aplicados.'}
                  </td>
                </tr>
              )}
              {produtosFiltrados.map((produto) => {
                let status = 'Normal';
                let classeStatus = 'badge-success';
                let classeLinha = '';

                if (produto.quantidade === 0) {
                  status = 'Zerado';
                  classeStatus = 'badge-danger';
                  classeLinha = 'row-alert-danger';
                } else if (produto.quantidade <= produto.estoqueMinimo) {
                  status = 'Estoque Baixo';
                  classeStatus = 'badge-warning';
                  classeLinha = 'row-alert-warning';
                }

                const precoFormatado = produto.preco.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                });

                return (
                  <tr key={produto.id} className={classeLinha}>
                    <td>{produto.nome}</td>
                    <td><code>{produto.codigo}</code></td>
                    <td>{produto.categoria}</td>
                    <td>{produto.quantidade}</td>
                    <td>{produto.estoqueMinimo}</td>
                    <td>{precoFormatado}</td>
                    <td><span className={`badge-status ${classeStatus}`}>{status}</span></td>
                    <td>
                      <button
                        type="button"
                        className="btn-icon delete"
                        aria-label={`Excluir ${produto.nome}`}
                        title="Excluir Produto"
                        onClick={() => excluirProduto(produto.id)}
                      >
                        <i className="fa-solid fa-trash-can" aria-hidden="true"></i>
                      </button>
                    </td>
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

export default Estoque;
