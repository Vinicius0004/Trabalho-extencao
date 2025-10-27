import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setFormField,
  submitForwarding,
  clearStatusMessage,
} from '../redux/slices/forwardingSlice';
import { fetchStudents } from '../redux/slices/studentsSlice';
import { validateSchema } from '../validations';
import { encaminhamentoSchema } from '../validations/encaminhamentoSchema';
import './Encaminhamento.css';

export default function Encaminhamento() {
  const dispatch = useDispatch();
  const { form, loading, statusMessage } = useSelector((state) => state.forwarding);
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
    const result = await validateSchema(encaminhamentoSchema, form);
    
    if (!result.valid) {
      setErrors(result.errors);
      return;
    }
    
    setErrors({});
    
    try {
      await dispatch(submitForwarding({
        ...form,
        id: Date.now(),
        submittedAt: new Date().toISOString(),
      })).unwrap();
      alert('Formulário enviado!');
    } catch {
      // Error is handled by Redux
      alert('Erro ao enviar o formulário. Os dados foram salvos localmente.');
    }
  }

  return (
    <div className="encaminhamento-container center" style={{minHeight:'calc(100vh - 56px)', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
      <h2>Encaminhamento</h2>
      
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
      
      <form className="encaminhamento-form" onSubmit={handleSubmit}>
        <label>
          Selecionar Aluno:
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
          Data da Admissão:
          <input 
            type="date" 
            name="dataAdmissao" 
            value={form.dataAdmissao} 
            onChange={handleChange} 
            required 
            disabled={loading}
          />
          {errors.dataAdmissao && <span className="error-text">{errors.dataAdmissao}</span>}
        </label>
        <label>
          Empresa:
          <input 
            type="text" 
            name="empresa" 
            value={form.empresa} 
            onChange={handleChange} 
            required 
            disabled={loading}
          />
          {errors.empresa && <span className="error-text">{errors.empresa}</span>}
        </label>
        <label>
          Função:
          <input 
            type="text" 
            name="funcao" 
            value={form.funcao} 
            onChange={handleChange} 
            required 
            disabled={loading}
          />
          {errors.funcao && <span className="error-text">{errors.funcao}</span>}
        </label>
        <label>
          Contato RH:
          <input 
            type="text" 
            name="contatoRH" 
            value={form.contatoRH} 
            onChange={handleChange} 
            required 
            disabled={loading}
          />
          {errors.contatoRH && <span className="error-text">{errors.contatoRH}</span>}
        </label>
        <label>
          Provável Data de Desligamento:
          <input 
            type="date" 
            name="dataDesligamento" 
            value={form.dataDesligamento} 
            onChange={handleChange} 
            disabled={loading}
          />
          {errors.dataDesligamento && <span className="error-text">{errors.dataDesligamento}</span>}
        </label>
        <button type="submit" disabled={loading}>
          {loading ? 'Enviando...' : 'Enviar'}
        </button>
      </form>
    </div>
  );
}
