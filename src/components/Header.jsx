import React from 'react';
import { Link } from 'react-router-dom';
import '../pages/HomePage.css';

export default function Header(){
  // ...existing code...
  return (
    <header className="header site-container accent-bg">
      <nav className="nav">
        <Link to="/">Home</Link>
        <Link to="/alunos">Alunos</Link>
        <Link to="/avaliacao">Avaliações</Link>
        <Link to="/notificacoes">Notificações</Link>
        <Link to="/relatorios">Relatórios</Link>
        <Link to="/controle-interno">Controle Interno</Link>
        <Link to="/encaminhamento">Encaminhamento</Link>
        <Link to="/login">Login</Link>
        <Link to="/registrar">Registrar</Link>
      </nav>
    </header>
  )
}
