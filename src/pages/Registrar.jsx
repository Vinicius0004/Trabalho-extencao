import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearError } from '../redux/slices/authSlice';
import './Registrar.css';

export default function Registrar() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { loading, error, isAuthenticated } = useSelector((state) => state.auth);
	
	const [email, setEmail] = useState('');
	const [name, setName] = useState('');
	const [password, setPassword] = useState('');
	const [localStatus, setLocalStatus] = useState('');

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

	const clearDraft = () => {
		setEmail(''); 
		setName(''); 
		setPassword('');
		setLocalStatus('Campos limpos.');
		setTimeout(() => setLocalStatus(''), 1500);
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
		if (err) { 
			setLocalStatus(err); 
			setTimeout(() => setLocalStatus(''), 3000);
			return; 
		}
		
		try {
			await dispatch(register({ email, name, password })).unwrap();
			setLocalStatus('Registro realizado com sucesso.');
			setTimeout(() => { navigate('/login'); }, 800);
		} catch {
			setLocalStatus('Falha ao enviar. Tente novamente.');
			setTimeout(() => setLocalStatus(''), 3000);
		}
	};

	const displayStatus = localStatus || error;

	return (
		<div className="registrar-page">
			{/* Header provided globally by src/components/Header.jsx */}

			<main className="main site-container">
				<section className="register-card card">
					<h1>Registrar</h1>
					<form onSubmit={handleSubmit} className="register-form">
						<label>Nome</label>
						<input 
							type="text" 
							value={name} 
							onChange={e => setName(e.target.value)} 
							placeholder="Seu nome completo"
							disabled={loading}
						/>

						<label>Email</label>
						<input 
							type="email" 
							value={email} 
							onChange={e => setEmail(e.target.value)} 
							placeholder="seu@exemplo.com"
							disabled={loading}
						/>

						<label>Senha</label>
						<input 
							type="password" 
							value={password} 
							onChange={e => setPassword(e.target.value)} 
							placeholder="Mínimo 6 caracteres"
							disabled={loading}
						/>

						<div className="actions">
							<button type="submit" className="btn primary" disabled={loading}>
								{loading ? 'Enviando...' : 'Solicitar Permissão'}
							</button>
							<button type="button" className="btn ghost" onClick={clearDraft} disabled={loading}>
								Limpar
							</button>
						</div>

						{displayStatus && <div className="status">{displayStatus}</div>}
					</form>
				</section>
			</main>

			{/* rodapé removido */}
		</div>
	);
}
