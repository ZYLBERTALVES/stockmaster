import { useState } from 'react';

function CadastroProduto({ categorias, adicionarProduto }) {
  const [nome, setNome] = useState('');
  const [codigo, setCodigo] = useState('');
  const [categoria, setCategoria] = useState('');
  const [preco, setPreco] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [estoqueMinimo, setEstoqueMinimo] = useState('');
  const [mensagem, setMensagem] = useState({ texto: '', erro: false });

  function enviarFormulario(evento) {
    evento.preventDefault();

    if (!nome.trim() || !codigo.trim()) {
      setMensagem({ texto: 'Preencha o nome e o código do produto.', erro: true });
      return;
    }

    const erro = adicionarProduto({
      nome: nome.trim(),
      codigo: codigo.trim().toUpperCase(),
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
      <h2 id="titulo-cadastro">
        <i className="fa-solid fa-pen-to-square" aria-hidden="true"></i> Cadastrar Novo Produto
      </h2>

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
            <label htmlFor="cad-nome">Nome do Produto</label>
            <input
              id="cad-nome"
              type="text"
              placeholder="Ex: Arroz Integral 5kg"
              value={nome}
              onChange={(evento) => setNome(evento.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="cad-codigo">Código identificador</label>
            <input
              id="cad-codigo"
              type="text"
              placeholder="Ex: ARR001"
              value={codigo}
              onChange={(evento) => setCodigo(evento.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="cad-categoria">Categoria</label>
            <select
              id="cad-categoria"
              className="form-select"
              value={categoria}
              onChange={(evento) => setCategoria(evento.target.value)}
              required
            >
              <option value="" disabled>Selecione...</option>
              {categorias.map((item) => (
                <option key={item} value={item}>
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="cad-preco">Preço Unitário (R$)</label>
            <input
              id="cad-preco"
              type="number"
              min="0"
              step="0.01"
              placeholder="Ex: 10,00"
              value={preco}
              onChange={(evento) => setPreco(evento.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="cad-qtd">Quantidade Inicial</label>
            <input
              id="cad-qtd"
              type="number"
              min="0"
              step="1"
              placeholder="Ex: 15"
              value={quantidade}
              onChange={(evento) => setQuantidade(evento.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="cad-minimo">Estoque Mínimo (Alerta)</label>
            <input
              id="cad-minimo"
              type="number"
              min="0"
              step="1"
              placeholder="Ex: 5"
              value={estoqueMinimo}
              onChange={(evento) => setEstoqueMinimo(evento.target.value)}
              required
            />
          </div>
        </div>

        <button type="submit" className="btn-primary">Adicionar ao Inventário</button>
      </form>
    </section>
  );
}

export default CadastroProduto;
