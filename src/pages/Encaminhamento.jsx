import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setFormField,
  submitForwarding,
  clearStatusMessage,
} from '../redux/slices/forwardingSlice';
import './Encaminhamento.css';

const alunos = [
  'Aluno 1',
  'Aluno 2',
  'Aluno 3',
  // Adicione mais alunos conforme necessário
];

export default function Encaminhamento() {
  const dispatch = useDispatch();
  const { form, loading, statusMessage } = useSelector((state) => state.forwarding);

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
            {alunos.map((aluno, idx) => (
              <option key={idx} value={aluno}>{aluno}</option>
            ))}
          </select>
        </label>
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
        </label>
        <button type="submit" disabled={loading}>
          {loading ? 'Enviando...' : 'Enviar'}
        </button>
      </form>
    </div>
  );
}
