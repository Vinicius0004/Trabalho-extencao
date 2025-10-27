import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearError } from '../redux/slices/authSlice';
import { validateSchema } from '../validations';
import { registerSchema } from '../validations/authSchema';
import './Registrar.css';

export default function Registrar() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { loading, error, isAuthenticated } = useSelector((state) => state.auth);
	
	const [email, setEmail] = useState('');
	const [name, setName] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [localStatus, setLocalStatus] = useState('');
	const [errors, setErrors] = useState({});

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

	const handleSubmit = async (e) => {
		e.preventDefault();
		
		const formData = { email, name, password, confirmPassword };
		const result = await validateSchema(registerSchema, formData);
		
		if (!result.valid) {
			setErrors(result.errors);
			const firstError = Object.values(result.errors)[0];
			setLocalStatus(firstError);
			setTimeout(() => setLocalStatus(''), 3000);
			return;
		}
		
		setErrors({});
		
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
						{errors.name && <span className="error-text">{errors.name}</span>}

						<label>Email</label>
						<input 
							type="email" 
							value={email} 
							onChange={e => setEmail(e.target.value)} 
							placeholder="seu@exemplo.com"
							disabled={loading}
						/>
						{errors.email && <span className="error-text">{errors.email}</span>}

						<label>Senha</label>
						<input 
							type="password" 
							value={password} 
							onChange={e => setPassword(e.target.value)} 
							placeholder="Mín. 8 caracteres com maiúscula, minúscula, número e especial"
							disabled={loading}
						/>
						{errors.password && <span className="error-text">{errors.password}</span>}

						<label>Confirmar Senha</label>
						<input 
							type="password" 
							value={confirmPassword} 
							onChange={e => setConfirmPassword(e.target.value)} 
							placeholder="Confirme sua senha"
							disabled={loading}
						/>
						{errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}

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
