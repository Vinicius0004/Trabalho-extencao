import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setFormField,
  submitInternalControl,
  clearStatusMessage,
} from '../redux/slices/internalControlSlice';
import { fetchStudents } from '../redux/slices/studentsSlice';
import { validateSchema } from '../validations';
import { controleInternoSchema } from '../validations/controleInternoSchema';
import './ControleInterno.css';

export default function ControleInterno() {
  const dispatch = useDispatch();
  const { form, loading, statusMessage } = useSelector((state) => state.internalControl);
  const { students } = useSelector((state) => state.students);
  const [errors, setErrors] = useState({});

  // Carregar lista de alunos ao montar o componente
  useEffect(() => {
    dispatch(fetchStudents());
  }, [dispatch]);

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
    
    // Validar com Yup
    const result = await validateSchema(controleInternoSchema, form);
    
    if (!result.valid) {
      setErrors(result.errors);
      return;
    }
    
    setErrors({});
    
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
            {students.map((aluno) => (
              <option key={aluno.id} value={aluno.name}>{aluno.name}</option>
            ))}
          </select>
        </label>
        {errors.aluno && <span className="error-text">{errors.aluno}</span>}
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
          {errors.ingresso && <span className="error-text">{errors.ingresso}</span>}
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
          {errors.primeiraAvaliacao && <span className="error-text">{errors.primeiraAvaliacao}</span>}
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
          {errors.segundaAvaliacao && <span className="error-text">{errors.segundaAvaliacao}</span>}
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
          {errors.primeiraEntrevista && <span className="error-text">{errors.primeiraEntrevista}</span>}
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
          {errors.segundaEntrevista && <span className="error-text">{errors.segundaEntrevista}</span>}
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
          {errors.resultado && <span className="error-text">{errors.resultado}</span>}
        </label>
        <button type="submit" disabled={loading}>
          {loading ? 'Enviando...' : 'Enviar'}
        </button>
      </form>
    </div>
  );
}
