import React, { useState } from 'react';
import './Encaminhamento.css';

const alunos = [
  'Aluno 1',
  'Aluno 2',
  'Aluno 3',
  // Adicione mais alunos conforme necessário
];

export default function Encaminhamento() {
  const [form, setForm] = useState({
    aluno: '',
    dataAdmissao: '',
    empresa: '',
    funcao: '',
    contatoRH: '',
    dataDesligamento: '',
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    // Aqui você pode adicionar lógica para enviar os dados
    alert('Formulário enviado!');
  }

  return (
  <div className="encaminhamento-container center" style={{minHeight:'calc(100vh - 56px)', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
      <h2>Encaminhamento</h2>
      <form className="encaminhamento-form" onSubmit={handleSubmit}>
        <label>
          Selecionar Aluno:
          <select name="aluno" value={form.aluno} onChange={handleChange} required>
            <option value="">Selecione</option>
            {alunos.map((aluno, idx) => (
              <option key={idx} value={aluno}>{aluno}</option>
            ))}
          </select>
        </label>
        <label>
          Data da Admissão:
          <input type="date" name="dataAdmissao" value={form.dataAdmissao} onChange={handleChange} required />
        </label>
        <label>
          Empresa:
          <input type="text" name="empresa" value={form.empresa} onChange={handleChange} required />
        </label>
        <label>
          Função:
          <input type="text" name="funcao" value={form.funcao} onChange={handleChange} required />
        </label>
        <label>
          Contato RH:
          <input type="text" name="contatoRH" value={form.contatoRH} onChange={handleChange} required />
        </label>
        <label>
          Provável Data de Desligamento:
          <input type="date" name="dataDesligamento" value={form.dataDesligamento} onChange={handleChange} />
        </label>
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
}
