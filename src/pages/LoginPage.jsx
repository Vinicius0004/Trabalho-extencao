import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LoginPage.css';

function LoginPage() {
  return (
    <div className="login-container">
  {/* Header provided globally by src/components/Header.jsx */}

      <main className="main site-container">
        <section className="register-card card">
          <h1>Entrar</h1>
          <form className="register-form" onSubmit={(e)=>e.preventDefault()}>
            <label>Email</label>
            <input type="email" placeholder="seu@exemplo.com" />

            <label>Senha</label>
            <input type="password" placeholder="••••••" />

            <div className="actions">
              <button type="submit" className="btn primary">Entrar</button>
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
