import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import './Header.css';

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  
  const isActive = (path) => location.pathname === path;
  
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };
  
  // Links para usuários autenticados
  const authenticatedLinks = [
    { to: '/', label: 'Dashboard' },
    { to: '/alunos', label: 'Alunos' },
    { to: '/avaliacao', label: 'Avaliações' },
    { to: '/notificacoes', label: 'Notificações' },
    { to: '/relatorios', label: 'Relatórios' },
    { to: '/controle-interno', label: 'Controle Interno' },
    { to: '/encaminhamento', label: 'Encaminhamento' },
  ];
  
  // Links para usuários não autenticados
  const unauthenticatedLinks = [
    { to: '/login', label: 'Login' },
    { to: '/registrar', label: 'Registrar' },
  ];

  const navLinks = isAuthenticated ? authenticatedLinks : unauthenticatedLinks;

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
        
        {isAuthenticated && (
          <div className="user-menu">
            <span className="user-info">
              {user?.name} {user?.role === 'admin' && '(Admin)'}
            </span>
            <button 
              onClick={handleLogout} 
              className="nav-link logout-btn"
              type="button"
              aria-label="Sair"
            >
              Sair
            </button>
          </div>
        )}
      </nav>
    </header>
  );
}
