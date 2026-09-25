import { useState } from 'react';
import { useEstoque } from '../context/EstoqueContext';

function CadastroProduto() {
  const { categorias, adicionarProduto } = useEstoque();
  // Cada estado guarda o valor de um campo do formulário.
  const [nome, setNome] = useState('');
  const [codigo, setCodigo] = useState('');
  const [categoria, setCategoria] = useState('');
  const [preco, setPreco] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [estoqueMinimo, setEstoqueMinimo] = useState('');
  const [mensagem, setMensagem] = useState({ texto: '', erro: false });

  function enviarFormulario(evento) {
    evento.preventDefault();
    // A função do contexto valida os dados e adiciona o produto.
    const erro = adicionarProduto({
      nome,
      codigo,
      categoria,
      preco: Number(preco),
      quantidade: Number(quantidade),
      estoqueMinimo: Number(estoqueMinimo),
    });

    if (erro) {
      setMensagem({ texto: erro, erro: true });
      return;
    }

    setMensagem({ texto: 'Produto cadastrado com sucesso!', erro: false });
    setNome('');
    setCodigo('');
    setCategoria('');
    setPreco('');
    setQuantidade('');
    setEstoqueMinimo('');
  }

  return (
    <section className="card" aria-labelledby="titulo-cadastro">
      <h2 id="titulo-cadastro">Cadastrar Novo Produto</h2>
      {mensagem.texto && (
        <p className={mensagem.erro ? 'mensagem mensagem-erro' : 'mensagem mensagem-sucesso'}
          role={mensagem.erro ? 'alert' : 'status'}>{mensagem.texto}</p>
      )}
      <form onSubmit={enviarFormulario}>
        <div className="form-row">
          <label className="form-group">
            Nome do Produto
            <input id="cad-nome" type="text" required value={nome}
              onChange={(evento) => setNome(evento.target.value)} />
          </label>
          <label className="form-group">
            Código identificador
            <input id="cad-codigo" type="text" required value={codigo}
              onChange={(evento) => setCodigo(evento.target.value)} />
          </label>
          <label className="form-group">
            Categoria
            <select id="cad-categoria" required value={categoria}
              onChange={(evento) => setCategoria(evento.target.value)}>
              <option value="" disabled>Selecione...</option>
              {categorias.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
          <label className="form-group">
            Preço Unitário (R$)
            <input id="cad-preco" type="number" min="0" step="0.01" required value={preco}
              onChange={(evento) => setPreco(evento.target.value)} />
          </label>
          <label className="form-group">
            Quantidade Inicial
            <input id="cad-qtd" type="number" min="0" step="1" required value={quantidade}
              onChange={(evento) => setQuantidade(evento.target.value)} />
          </label>
          <label className="form-group">
            Estoque Mínimo (Alerta)
            <input id="cad-minimo" type="number" min="0" step="1" required value={estoqueMinimo}
              onChange={(evento) => setEstoqueMinimo(evento.target.value)} />
          </label>
        </div>
        <button type="submit" className="btn-primary">Adicionar ao Inventário</button>
      </form>
    </section>
  );
}

export default CadastroProduto;
