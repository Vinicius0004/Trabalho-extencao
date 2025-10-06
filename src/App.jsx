import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import Registrar from './pages/Registrar.jsx';
import AvaliacaoAlunos from './pages/AvaliacaoAlunos';
import Notificacoes from './pages/notificacoes';
import Relatorios from './pages/Relatorios';
import RecuperarSenha from './pages/RecuperarSenha';
import Alunos from './pages/Alunos';
import ControleInterno from './pages/ControleInterno';
import Encaminhamento from './pages/Encaminhamento';
import Header from './components/Header';

function App() {
  return (
    <Router>
  <Header />
  <Routes>
    {/* Página Inicial */}
    <Route path="/" element={<HomePage />} />
    {/* Página de Login */}
    <Route path="/login" element={<LoginPage />} />
    {/* Página de Registrar */}
    <Route path="/registrar" element={<Registrar />} />
    {/* Cadastro e Gestão de Alunos unificados */}
    <Route path="/alunos" element={<Alunos />} />
    {/* Redireciona cadastro-alunos para alunos */}
    <Route path="/cadastro-alunos" element={<Navigate to="/alunos" replace />} />
    {/* Outras páginas */}
    <Route path="/avaliacao" element={<AvaliacaoAlunos />} />
    <Route path="/notificacoes" element={<Notificacoes />} />
    <Route path="/relatorios" element={<Relatorios />} />
    <Route path="/recuperar-senha" element={<RecuperarSenha />} />
    <Route path="/controle-interno" element={<ControleInterno />} />
    <Route path="/encaminhamento" element={<Encaminhamento />} />
  </Routes>
    </Router>
  );
}

export default App;
