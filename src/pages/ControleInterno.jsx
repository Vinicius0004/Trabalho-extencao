import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setFormField,
  submitInternalControl,
  clearStatusMessage,
} from '../redux/slices/internalControlSlice';
import './ControleInterno.css';

const alunos = [
  'Aluno 1',
  'Aluno 2',
  'Aluno 3',
  // Adicione mais alunos conforme necessário
];

export default function ControleInterno() {
  const dispatch = useDispatch();
  const { form, loading, statusMessage } = useSelector((state) => state.internalControl);

  useEffect(() => {
    if (statusMessage) {
      const timer = setTimeout(() => dispatch(clearStatusMessage()), 3000);
      return () => clearTimeout(timer);
    }
  }, [statusMessage, dispatch]);

  function handleChange(e) {
    dispatch(setFormField({ field: e.target.name, value: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    
    try {
      await dispatch(submitInternalControl({
        ...form,
        id: Date.now(),
        submittedAt: new Date().toISOString(),
      })).unwrap();
      alert('Formulário Controle Interno enviado!');
    } catch {
      // Error is handled by Redux
      alert('Erro ao enviar o formulário. Os dados foram salvos localmente.');
    }
  }

  return (
    <div className="controleinterno-container center" style={{minHeight:'calc(100vh - 56px)', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
      <h2>Controle Interno</h2>
      
      {statusMessage && (
        <div style={{
          padding: '10px 20px',
          marginBottom: '20px',
          backgroundColor: '#4caf50',
          color: 'white',
          borderRadius: '4px'
        }}>
          {statusMessage}
        </div>
      )}
      
      <form className="controleinterno-form" onSubmit={handleSubmit}>
        <label>
          Selecionar Nome do Aluno:
          <select 
            name="aluno" 
            value={form.aluno} 
            onChange={handleChange} 
            required
            disabled={loading}
          >
            <option value="">Selecione</option>
            {alunos.map((aluno, idx) => (
              <option key={idx} value={aluno}>{aluno}</option>
            ))}
          </select>
        </label>
        <label>
          Ingresso:
          <input 
            type="date" 
            name="ingresso" 
            value={form.ingresso} 
            onChange={handleChange} 
            required 
            disabled={loading}
          />
        </label>
        <label>
          Primeira Avaliação:
          <input 
            type="date" 
            name="primeiraAvaliacao" 
            value={form.primeiraAvaliacao} 
            onChange={handleChange} 
            required 
            disabled={loading}
          />
        </label>
        <label>
          Segunda Avaliação:
          <input 
            type="date" 
            name="segundaAvaliacao" 
            value={form.segundaAvaliacao} 
            onChange={handleChange} 
            required 
            disabled={loading}
          />
        </label>
        <label>
          Primeira Entrevista com os Pais:
          <input 
            type="date" 
            name="primeiraEntrevista" 
            value={form.primeiraEntrevista} 
            onChange={handleChange} 
            required 
            disabled={loading}
          />
        </label>
        <label>
          Segunda Entrevista com os Pais:
          <input 
            type="date" 
            name="segundaEntrevista" 
            value={form.segundaEntrevista} 
            onChange={handleChange} 
            required 
            disabled={loading}
          />
        </label>
        <label>
          Resultado:
          <input 
            type="text" 
            name="resultado" 
            value={form.resultado} 
            onChange={handleChange} 
            required 
            disabled={loading}
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? 'Enviando...' : 'Enviar'}
        </button>
      </form>
    </div>
  );
}
