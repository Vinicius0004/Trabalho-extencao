import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RecuperarSenha.css';

export default function RecuperarSenha() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  // two-step flow
  const [step, setStep] = useState(1); // 1 = request email, 2 = verify code + set password
  const [codeSent, setCodeSent] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const generateCode = () => String(Math.floor(100000 + Math.random() * 900000));

  const handleSendEmail = async (e) => {
    e.preventDefault();
    if (!email.trim()) { setStatus('Preencha o email.'); return; }
    setLoading(true); setStatus('Enviando código...');
    try {
      // Simula envio para backend
      await new Promise(r => setTimeout(r, 900));
  const generated = generateCode();
  setCodeSent(generated);
  // debug log removed
      setStep(2);
      setStatus('Código enviado. Verifique seu email.');
    } catch (err) {
      setStatus('Erro ao enviar. Tente novamente.');
    }
    setLoading(false);
  };

  const handleVerifyAndReset = async (e) => {
    e.preventDefault();
    if (!code.trim()) { setStatus('Informe o código recebido.'); return; }
    if (!newPassword) { setStatus('Informe a nova senha.'); return; }
    if (newPassword.length < 6) { setStatus('Senha deve ter ao menos 6 caracteres.'); return; }
    if (newPassword !== confirmPassword) { setStatus('As senhas não coincidem.'); return; }

    setLoading(true); setStatus('Verificando...');
    try {
      await new Promise(r => setTimeout(r, 900));
      if (code !== codeSent) { setStatus('Código inválido.'); setLoading(false); return; }
      // Simula reset bem-sucedido
      setStatus('Senha atualizada com sucesso. Redirecionando para login...');
      setTimeout(() => navigate('/login'), 1200);
    } catch (err) {
      setStatus('Erro ao processar. Tente novamente.');
    }
    setLoading(false);
  };

  const resendCode = async () => {
    setLoading(true); setStatus('Reenviando código...');
    try {
      await new Promise(r => setTimeout(r, 700));
  const generated = generateCode();
  setCodeSent(generated);
  // debug log removed
      setStatus('Código reenviado. Confira seu email.');
    } catch (err) { setStatus('Falha ao reenviar.'); }
    setLoading(false);
  };

  return (
    <div className="recuperar-page">
  {/* Header provided globally by src/components/Header.jsx */}
      <main className="main site-container">
        <section className="recuperar-card card">
          <h1>Recuperar Senha</h1>

          {step === 1 && (
            <form onSubmit={handleSendEmail} className="recuperar-form">
              <label>Email cadastrado</label>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="seu@exemplo.com" />
              <div className="actions">
                <button type="submit" className="btn primary" disabled={loading}>Enviar código</button>
              </div>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerifyAndReset} className="recuperar-form">
              <label>Código de segurança</label>
              <input type="text" value={code} onChange={e=>setCode(e.target.value)} placeholder="Código (6 dígitos)" />

              <label>Nova senha</label>
              <input type="password" value={newPassword} onChange={e=>setNewPassword(e.target.value)} placeholder="Nova senha" />

              <label>Confirmar nova senha</label>
              <input type="password" value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} placeholder="Repita a nova senha" />

              <div className="actions">
                <button type="submit" className="btn primary" disabled={loading}>Confirmar e trocar senha</button>
                <button type="button" className="btn ghost" onClick={resendCode} disabled={loading}>Reenviar código</button>
              </div>
            </form>
          )}

          {status && <div className="status">{status}</div>}
        </section>
      </main>
  {/* rodapé removido */}
    </div>
  );
}
