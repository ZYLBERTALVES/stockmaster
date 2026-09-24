function Sidebar({ abaAtual, setAbaAtual, tema, setTema }) {
  const abas = [
    { id: 'dashboard', nome: 'Dashboard', icone: 'fa-chart-line' },
    { id: 'cadastro', nome: 'Novo Produto', icone: 'fa-plus' },
    { id: 'estoque', nome: 'Estoque', icone: 'fa-warehouse' },
    { id: 'movimentacoes', nome: 'Movimentações', icone: 'fa-right-left' },
    { id: 'historico', nome: 'Histórico', icone: 'fa-clock-rotate-left' }
  ];

  return (
    <aside className="sidebar">
      <div className="brand">
        <h1><i className="fa-solid fa-boxes-packing" aria-hidden="true"></i> StockMaster</h1>
      </div>
      <nav aria-label="Navegação principal">
        {abas.map((aba) => (
          <button
            key={aba.id}
            type="button"
            className={abaAtual === aba.id ? 'nav-btn active' : 'nav-btn'}
            aria-current={abaAtual === aba.id ? 'page' : undefined}
            onClick={() => setAbaAtual(aba.id)}
          >
            <i className={`fa-solid ${aba.icone}`} aria-hidden="true"></i>
            {aba.nome}
          </button>
        ))}
      </nav>
      <div className="form-group sidebar-theme">
        <label htmlFor="seletor-tema">Tema do Sistema</label>
        <select
          id="seletor-tema"
          className="form-select"
          value={tema}
          onChange={(evento) => setTema(evento.target.value)}
        >
          <option value="claro">Modo Claro</option>
          <option value="escuro">Modo Escuro</option>
        </select>
      </div>
    </aside>
  );
}

export default Sidebar;
