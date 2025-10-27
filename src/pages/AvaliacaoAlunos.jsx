import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  setAnswer,
  setPage,
  setSelectedStudent,
  saveDraftNow,
  clearDraft,
  setStatusMessage,
  clearStatusMessage,
  submitEvaluation,
} from '../redux/slices/evaluationsSlice';
import { fetchStudents } from '../redux/slices/studentsSlice';
import './AvaliacaoAlunos.css';

function AvaliacaoAlunos() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { answers, page, selectedStudent, lastSaved, statusMessage, loading } = useSelector(
    (state) => state.evaluations
  );
  const { students } = useSelector((state) => state.students);

  // Perguntas fornecidas pelo usuário (46)
  const questions = useMemo(() => [
    "Atende as regras.",
    "Socializa com o grupo.",
    "Isola-se do grupo",
    "Possui tolerância a frustração.",
    "Respeita colega e professores.",
    "Faz relatos fantasiosos.",
    "Concentra-se nas atividades.",
    "Tem iniciativa.",
    "Sonolência durante as atividades em sala de aula.",
    "Alterações intensas de humor.",
    "Indica oscilação repentina de humor.",
    "Irrita-se com facilidade.",
    "Ansiedade.",
    "Escuta quando seus colegas falam.",
    "Escuta e segue orientação dos professores.",
    "Mantem-se em sala de aula.",
    "Desloca-se muito na sala.",
    "Fala demasiadamente.",
    "É pontual.",
    "É assíduo.",
    "Demonstra desejo de trabalhar.",
    "Apropria-se indevidamente daquilo que não é seu.",
    "Indica hábito de banho diário.",
    "Indica habito de escovação e qualidade na escovação.",
    "Indica cuidado com a aparência e limpeza do uniforme.",
    "Indica autonomia quanto a estes hábitos (23, 24, 25).",
    "Indica falta do uso de medicação com oscilações de comportamento.",
    "Tem meio articulado de conseguir receitas e aquisições das medicações.",
    "Traz seus materiais organizados.",
    "Usa transporte coletivo.",
    "Tem iniciativa diante das atividades propostas.",
    "Localiza-se no espaço da Instituição.",
    "Situa-se nas trocas de sala e atividades.",
    "Interage par a par.",
    "Interage em grupo.",
    "Cria conflitos e intrigas.",
    "Promove a harmonia.",
    "Faz intrigas entre colegas x professores.",
    "Demonstra interesse em participar das atividades extraclasses.",
    "Você percebe que existe interação/participação da família em apoio ao usuário na Instituição.",
    "Você percebe superproteção por parte da família quanto a autonomia do usuário.",
    "Usuário traz relatos negativos da família (de forma geral).",
    "Usuário traz relatos positivos da família (de forma geral).",
    "Você percebe incentivo quanto a busca de autonomia para o usuário por parte da família.",
    "Você percebe incentivo quanto a inserção do usuário no mercado de trabalho por parte da família.",
    "Traz os documentos enviados pela Instituição assinado."
  ], []);

  const PAGE_SIZE = 10; // perguntas por página
  const totalPages = Math.ceil(questions.length / PAGE_SIZE);

  const answeredCount = Object.keys(answers).length;

  // Carregar lista de alunos ao montar o componente
  useEffect(() => {
    dispatch(fetchStudents());
  }, [dispatch]);

  // Auto-clear status message
  useEffect(() => {
    if (statusMessage) {
      const timer = setTimeout(() => dispatch(clearStatusMessage()), 2500);
      return () => clearTimeout(timer);
    }
  }, [statusMessage, dispatch]);

  const handleAnswer = (index, value) => {
    dispatch(setAnswer({ index, value }));
  };

  const handleSaveDraft = () => {
    dispatch(saveDraftNow());
  };

  const handleClearDraft = () => {
    dispatch(clearDraft());
  };

  // envio via POST
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (answeredCount < questions.length) {
      const missing = questions.length - answeredCount;
      alert(`Por favor responda todas as perguntas. Faltam ${missing}.`);
      return;
    }

    if (!selectedStudent) {
      dispatch(setStatusMessage('Selecione o aluno avaliado antes de enviar.'));
      return;
    }

    const payload = questions.map((q, i) => ({ question: q, answer: answers[i] || null }));

    try {
      await dispatch(submitEvaluation({ payload, studentId: selectedStudent })).unwrap();
      alert('Avaliação enviada com sucesso.');
      navigate('/relatorios');
    } catch {
      alert('Falha ao enviar. As respostas foram salvas localmente.');
    }
  };

  return (
    <div className="avaliacao-container">
      {/* Header provided globally by src/components/Header.jsx */}

      <main className="main site-container">
        <div className="avaliacao-card card">
          <div className="avaliacao-header">
            <h1 className="avaliacao-title">Avaliação de Alunos</h1>
            <div className="avaliacao-top-row">
              <div className="student-select">
                <label>Aluno:</label>
                <select 
                  value={selectedStudent} 
                  onChange={e => dispatch(setSelectedStudent(e.target.value))}
                >
                  <option value="">— selecione um aluno —</option>
                  {students.map(st => <option key={st.id} value={st.id}>{st.name}</option>)}
                </select>
              </div>
              <div className="avaliacao-progress-bar">
              <div className="avaliacao-progress-bar-inner" style={{width: `${(answeredCount/questions.length)*100}%`}} />
              <span className="avaliacao-progress-label">{answeredCount} / {questions.length} respondidas</span>
            </div>
            </div>
            <p className="avaliacao-instrucao">Responda cada item com a opção mais adequada.</p>
          </div>

          <div className="draft-row" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18}}>
            <div className="draft-info">
              {statusMessage || (lastSaved ? `Último salvamento: ${new Date(lastSaved).toLocaleString()}` : '')}
            </div>
            <div style={{display:'flex', gap:8}}>
              <button type="button" className="btn ghost" onClick={handleSaveDraft}>Salvar rascunho</button>
              <button type="button" className="btn" onClick={handleClearDraft}>Limpar rascunho</button>
            </div>
          </div>

          <form className="evaluation-form" onSubmit={handleSubmit}>
            <div className="questions-list">
              {questions.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE).map((q, idx) => {
                const realIndex = page * PAGE_SIZE + idx;
                return (
                  <div className="question-card card" key={realIndex}>
                    <label className="question-text">{`${realIndex + 1}. ${q}`}</label>
                    <div className="options">
                      <label className={`option ${answers[realIndex] === 'sim' ? 'active' : ''}`}>
                        <input type="radio" name={`q${realIndex}`} value="sim" checked={answers[realIndex] === 'sim'} onChange={() => handleAnswer(realIndex, 'sim')} />
                        Sim
                      </label>
                      <label className={`option ${answers[realIndex] === 'nao' ? 'active' : ''}`}>
                        <input type="radio" name={`q${realIndex}`} value="nao" checked={answers[realIndex] === 'nao'} onChange={() => handleAnswer(realIndex, 'nao')} />
                        Não
                      </label>
                      <label className={`option ${answers[realIndex] === 'maioria' ? 'active' : ''}`}>
                        <input type="radio" name={`q${realIndex}`} value="maioria" checked={answers[realIndex] === 'maioria'} onChange={() => handleAnswer(realIndex, 'maioria')} />
                        Maioria das vezes
                      </label>
                      <label className={`option ${answers[realIndex] === 'raras' ? 'active' : ''}`}>
                        <input type="radio" name={`q${realIndex}`} value="raras" checked={answers[realIndex] === 'raras'} onChange={() => handleAnswer(realIndex, 'raras')} />
                        Raras vezes
                      </label>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="avaliacao-footer">
              <div className="pagination">
                <div style={{display:'flex', gap:8}}>
                  <button type="button" className="page-btn" disabled={page===0} onClick={() => dispatch(setPage(Math.max(0, page-1)))}>Anterior</button>
                  <button type="button" className="page-btn" disabled={page===totalPages-1} onClick={() => dispatch(setPage(Math.min(totalPages-1, page+1)))}>Próxima</button>
                </div>
                <div className="page-numbers">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button key={i} type="button" className={`page-num ${i===page? 'active': ''}`} onClick={() => dispatch(setPage(i))}>{i+1}</button>
                  ))}
                </div>
                <div style={{display:'flex', gap:8}}>
                  <button type="button" className="btn ghost" onClick={() => { dispatch(setPage(0)); window.scrollTo({top:0, behavior:'smooth'}); }}>Início</button>
                  <button type="submit" className="btn primary" disabled={loading}>
                    {loading ? 'Enviando...' : 'Enviar avaliação'}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>

      {/* rodapé removido */}
    </div>
  );
}

export default AvaliacaoAlunos;

function Back(){
  const navigate = useNavigate();
  return <button className="btn back-btn" onClick={() => navigate(-1)}>← Voltar</button>
}
