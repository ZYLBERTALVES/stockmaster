import { useState } from 'react';

function dataDeHoje() {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, '0');
  const dia = String(hoje.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

function Movimentacao({ produtos, registrarMovimentacao }) {
  const [produtoId, setProdutoId] = useState('');
  const [tipo, setTipo] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [data, setData] = useState(dataDeHoje);
  const [observacao, setObservacao] = useState('');
  const [mensagem, setMensagem] = useState({ texto: '', erro: false });

  const produtoSelecionado = produtos.find((produto) => produto.id === produtoId);

  function enviarFormulario(evento) {
    evento.preventDefault();

    const erro = registrarMovimentacao({
      produtoId,
      tipo,
      quantidade: Number(quantidade),
      data,
      observacao: observacao.trim(),
    });

    if (erro) {
      setMensagem({ texto: erro, erro: true });
      return;
    }

    setMensagem({ texto: 'Movimentação registrada com sucesso!', erro: false });
    setProdutoId('');
    setTipo('');
    setQuantidade('');
    setData(dataDeHoje());
    setObservacao('');
  }

  return (
    <section className="card" aria-labelledby="titulo-movimentacao">
      <h2 id="titulo-movimentacao">
        <i className="fa-solid fa-circle-arrow-down" aria-hidden="true"></i> Lançar Movimentação de Estoque
      </h2>

      {produtos.length === 0 && (
        <p className="mensagem">Cadastre um produto para registrar entradas e saídas.</p>
      )}

      {mensagem.texto && (
        <p
          className={`mensagem ${mensagem.erro ? 'mensagem-erro' : 'mensagem-sucesso'}`}
          role={mensagem.erro ? 'alert' : 'status'}
        >
          {mensagem.texto}
        </p>
      )}

      <form onSubmit={enviarFormulario}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="mov-tipo">Tipo de Transação</label>
            <select
              id="mov-tipo"
              className="form-select"
              value={tipo}
              onChange={(evento) => setTipo(evento.target.value)}
              required
            >
              <option value="" disabled>Selecione...</option>
              <option value="entrada">Entrada (+)</option>
              <option value="saida">Saída (-)</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="mov-produto">Produto</label>
            <select
              id="mov-produto"
              className="form-select"
              value={produtoId}
              onChange={(evento) => setProdutoId(evento.target.value)}
              required
            >
              <option value="" disabled>Selecione o produto...</option>
              {produtos.map((produto) => (
                <option key={produto.id} value={produto.id}>
                  {produto.nome} ({produto.codigo})
                </option>
              ))}
            </select>
          </div>
        </div>

        {produtoSelecionado && (
          <p className="saldo-produto">
            Estoque disponível: <strong>{produtoSelecionado.quantidade}</strong>
          </p>
        )}

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="mov-qtd">Quantidade</label>
            <input
              id="mov-qtd"
              type="number"
              min="1"
              step="1"
              placeholder="Ex: 10"
              value={quantidade}
              onChange={(evento) => setQuantidade(evento.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="mov-data">Data do Registro</label>
            <input
              id="mov-data"
              type="date"
              value={data}
              onChange={(evento) => setData(evento.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="mov-obs">Observação / Motivo</label>
          <input
            id="mov-obs"
            type="text"
            placeholder="Ex: Reposição de estoque / Venda direta ao cliente"
            value={observacao}
            onChange={(evento) => setObservacao(evento.target.value)}
          />
        </div>

        <button type="submit" className="btn-primary" disabled={produtos.length === 0}>
          Registrar Movimentação
        </button>
      </form>
    </section>
  );
}

export default Movimentacao;
