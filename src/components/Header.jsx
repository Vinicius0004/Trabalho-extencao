import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

export default function Header() {
  const location = useLocation();
  
  const isActive = (path) => location.pathname === path;
  
  const navLinks = [
    { to: '/', label: 'Dashboard' },
    { to: '/alunos', label: 'Alunos' },
    { to: '/avaliacao', label: 'Avaliações' },
    { to: '/notificacoes', label: 'Notificações' },
    { to: '/relatorios', label: 'Relatórios' },
    { to: '/controle-interno', label: 'Controle Interno' },
    { to: '/encaminhamento', label: 'Encaminhamento' },
    { to: '/login', label: 'Login' },
    { to: '/registrar', label: 'Registrar' },
  ];

  return (
    <header className="header site-container accent-bg" role="banner">
      <nav className="nav" aria-label="Navegação principal">
        {navLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={isActive(link.to) ? 'nav-link active' : 'nav-link'}
            aria-current={isActive(link.to) ? 'page' : undefined}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
