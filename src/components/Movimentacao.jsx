import { useState } from 'react';
import { useEstoque } from '../context/EstoqueContext';

function dataDeHoje() {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, '0');
  const dia = String(hoje.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

function Movimentacao() {
  const { produtos, registrarMovimentacao } = useEstoque();
  const [produtoId, setProdutoId] = useState('');
  const [tipo, setTipo] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [data, setData] = useState(dataDeHoje);
  const [observacao, setObservacao] = useState('');
  const [mensagem, setMensagem] = useState({ texto: '', erro: false });
  const produtoSelecionado = produtos.find((produto) => produto.id === produtoId);

  function enviarFormulario(evento) {
    evento.preventDefault();
    // O contexto verifica o saldo, atualiza o produto e registra o histórico.
    const erro = registrarMovimentacao({
      produtoId,
      tipo,
      quantidade: Number(quantidade),
      data,
      observacao,
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
      <h2 id="titulo-movimentacao">Lançar Movimentação de Estoque</h2>
      {produtos.length === 0 && <p className="mensagem">Cadastre um produto para registrar entradas e saídas.</p>}
      {mensagem.texto && (
        <p className={mensagem.erro ? 'mensagem mensagem-erro' : 'mensagem mensagem-sucesso'}
          role={mensagem.erro ? 'alert' : 'status'}>{mensagem.texto}</p>
      )}
      <form onSubmit={enviarFormulario}>
        <div className="form-row">
          <label className="form-group">
            Tipo de Transação
            <select id="mov-tipo" required value={tipo} onChange={(evento) => setTipo(evento.target.value)}>
              <option value="" disabled>Selecione...</option>
              <option value="entrada">Entrada (+)</option>
              <option value="saida">Saída (-)</option>
            </select>
          </label>
          <label className="form-group">
            Produto
            <select id="mov-produto" required value={produtoId} onChange={(evento) => setProdutoId(evento.target.value)}>
              <option value="" disabled>Selecione o produto...</option>
              {produtos.map((produto) => (
                <option key={produto.id} value={produto.id}>{produto.nome} ({produto.codigo})</option>
              ))}
            </select>
          </label>
          <label className="form-group">
            Quantidade
            <input id="mov-qtd" type="number" min="1" step="1" required value={quantidade}
              onChange={(evento) => setQuantidade(evento.target.value)} />
          </label>
          <label className="form-group">
            Data do Registro
            <input id="mov-data" type="date" required value={data} onChange={(evento) => setData(evento.target.value)} />
          </label>
        </div>
        {produtoSelecionado && <p className="saldo-produto">Estoque disponível: <strong>{produtoSelecionado.quantidade}</strong></p>}
        <label className="form-group">
          Observação / Motivo
          <input id="mov-obs" type="text" value={observacao} onChange={(evento) => setObservacao(evento.target.value)} />
        </label>
        <button type="submit" className="btn-primary" disabled={produtos.length === 0}>Registrar Movimentação</button>
      </form>
    </section>
  );
}

export default Movimentacao;
