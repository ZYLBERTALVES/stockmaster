import { useEffect, useState } from 'react';
import { useEstoque } from './context/EstoqueContext';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import CadastroProduto from './components/CadastroProduto';
import Estoque from './components/Estoque';
import Movimentacao from './components/Movimentacao';
import Historico from './components/Historico';

export default function App() {
  const { erroArmazenamento } = useEstoque();
  const [abaAtual, setAbaAtual] = useState('dashboard');
  const [tema, setTema] = useState(() => {
    try {
      return localStorage.getItem('tema_selecionado') === 'escuro' ? 'escuro' : 'claro';
    } catch {
      return 'claro';
    }
  });
  const [erroTema, setErroTema] = useState('');

  // O App cuida da navegação e do tema; o contexto cuida do estoque.
  useEffect(() => {
    try {
      localStorage.setItem('tema_selecionado', tema);
      setErroTema('');
    } catch {
      setErroTema('Não foi possível salvar o tema no navegador.');
    }
  }, [tema]);

  const mensagemErro = erroArmazenamento || erroTema;

  return (
    <div className="container" data-theme={tema}>
      <Sidebar abaAtual={abaAtual} setAbaAtual={setAbaAtual} tema={tema} setTema={setTema} />
      <main className="main-content">
        {mensagemErro && <p className="mensagem mensagem-erro" role="alert">{mensagemErro}</p>}
        {abaAtual === 'dashboard' && <Dashboard />}
        {abaAtual === 'cadastro' && <CadastroProduto />}
        {abaAtual === 'estoque' && <Estoque />}
        {abaAtual === 'movimentacoes' && <Movimentacao />}
        {abaAtual === 'historico' && <Historico />}
      </main>
    </div>
  );
}
