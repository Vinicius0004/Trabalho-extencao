import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Registrar.css';

export default function Registrar() {
	const navigate = useNavigate();
	const [email, setEmail] = useState('');
	const [name, setName] = useState('');
	const [password, setPassword] = useState('');
	const [status, setStatus] = useState('');


	const clearDraft = () => {
		setEmail(''); setName(''); setPassword('');
		setStatus('Campos limpos.');
		setTimeout(()=>setStatus(''), 1500);
	};

	const validate = () => {
		if (!email.trim() || !name.trim() || !password) return 'Preencha todos os campos.';
		// simple email regex
		const emailRx = /^\S+@\S+\.\S+$/;
		if (!emailRx.test(email)) return 'Email inválido.';
		if (password.length < 6) return 'Senha deve ter pelo menos 6 caracteres.';
		return null;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const err = validate();
		if (err) { setStatus(err); return; }
		setStatus('Enviando...');
		try {
			const res = await fetch('/api/register', {
				method: 'POST', headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, name, password })
			});
			if (!res.ok) throw new Error('Erro no servidor');
			setStatus('Registro realizado com sucesso.');
			localStorage.removeItem(STORAGE_KEY);
			setTimeout(()=>{ navigate('/login'); }, 800);
		} catch (err) {
			console.warn(err);
			setStatus('Falha ao enviar. Tente novamente.');
		}
	};

	return (
		<div className="registrar-page">
			{/* Header provided globally by src/components/Header.jsx */}

			<main className="main site-container">
				<section className="register-card card">
					<h1>Registrar</h1>
					<form onSubmit={handleSubmit} className="register-form">
						<label>Nome</label>
						<input type="text" value={name} onChange={e=>setName(e.target.value)} placeholder="Seu nome completo" />

						<label>Email</label>
						<input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="seu@exemplo.com" />

						<label>Senha</label>
						<input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Mínimo 6 caracteres" />

						<div className="actions">
							<button type="submit" className="btn primary">Solicitar Permissão</button>
							<button type="button" className="btn ghost" onClick={clearDraft}>Limpar</button>
						</div>

						{status && <div className="status">{status}</div>}
					</form>
				</section>
			</main>

			{/* rodapé removido */}
		</div>
	);
}
