import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '../redux/slices/authSlice';
import './LoginPage.css';

function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      return;
    }
    
    try {
      await dispatch(login({ email, password })).unwrap();
      navigate('/');
    } catch {
      // Error is handled by Redux state
    }
  };

  return (
    <div className="login-container">
      {/* Header provided globally by src/components/Header.jsx */}

      <main className="main site-container">
        <section className="register-card card">
          <h1>Entrar</h1>
          <form className="register-form" onSubmit={handleSubmit}>
            <label>Email</label>
            <input 
              type="email" 
              placeholder="seu@exemplo.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />

            <label>Senha</label>
            <input 
              type="password" 
              placeholder="••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />

            {error && <div className="error-message" style={{color: 'red', marginTop: '10px'}}>{error}</div>}

            <div className="actions">
              <button type="submit" className="btn primary" disabled={loading}>
                {loading ? 'Entrando...' : 'Entrar'}
              </button>
              <Link to="/recuperar-senha" className="btn ghost">Esqueceu a senha?</Link>
            </div>
          </form>
        </section>
      </main>

      {/* rodapé removido */}
    </div>
  );
}

export default LoginPage;

function Back(){
  const navigate = useNavigate();
  return (
    <button className="btn back-btn" onClick={() => navigate(-1)} aria-label="Voltar">← Voltar</button>
  )
}
