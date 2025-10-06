import React, { useState } from 'react';
import './ControleInterno.css';

const alunos = [
  'Aluno 1',
  'Aluno 2',
  'Aluno 3',
  // Adicione mais alunos conforme necessário
];

export default function ControleInterno() {
  const [form, setForm] = useState({
    aluno: '',
    ingresso: '',
    primeiraAvaliacao: '',
    segundaAvaliacao: '',
    primeiraEntrevista: '',
    segundaEntrevista: '',
    resultado: '',
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    // Lógica para enviar os dados
    alert('Formulário Controle Interno enviado!');
  }

  return (
  <div className="controleinterno-container center" style={{minHeight:'calc(100vh - 56px)', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
      <h2>Controle Interno</h2>
      <form className="controleinterno-form" onSubmit={handleSubmit}>
        <label>
          Selecionar Nome do Aluno:
          <select name="aluno" value={form.aluno} onChange={handleChange} required>
            <option value="">Selecione</option>
            {alunos.map((aluno, idx) => (
              <option key={idx} value={aluno}>{aluno}</option>
            ))}
          </select>
        </label>
        <label>
          Ingresso:
          <input type="date" name="ingresso" value={form.ingresso} onChange={handleChange} required />
        </label>
        <label>
          Primeira Avaliação:
          <input type="date" name="primeiraAvaliacao" value={form.primeiraAvaliacao} onChange={handleChange} required />
        </label>
        <label>
          Segunda Avaliação:
          <input type="date" name="segundaAvaliacao" value={form.segundaAvaliacao} onChange={handleChange} required />
        </label>
        <label>
          Primeira Entrevista com os Pais:
          <input type="date" name="primeiraEntrevista" value={form.primeiraEntrevista} onChange={handleChange} required />
        </label>
        <label>
          Segunda Entrevista com os Pais:
          <input type="date" name="segundaEntrevista" value={form.segundaEntrevista} onChange={handleChange} required />
        </label>
        <label>
          Resultado:
          <input type="text" name="resultado" value={form.resultado} onChange={handleChange} required />
        </label>
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
}
