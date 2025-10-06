import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './AvaliacaoAlunos.css';

function AvaliacaoAlunos() {
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

  const [answers, setAnswers] = useState({});
  const [page, setPage] = useState(0);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const PAGE_SIZE = 10; // perguntas por página
  const totalPages = Math.ceil(questions.length / PAGE_SIZE);

  const answeredCount = Object.keys(answers).length;

  // localStorage key
  const DRAFT_KEY = 'avaliacao-draft-v1';
  const [lastSaved, setLastSaved] = useState(null);
  const saveTimeout = useRef(null);
  const [statusMessage, setStatusMessage] = useState('');

  // carregar rascunho, se existir
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.answers) setAnswers(parsed.answers);
        if (typeof parsed.page === 'number') setPage(parsed.page);
        if (parsed.selectedStudent) setSelectedStudent(parsed.selectedStudent);
        setStatusMessage('Rascunho carregado');
        setTimeout(() => setStatusMessage(''), 2500);
      }
    } catch (err) {
      console.warn('Erro ao carregar rascunho', err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // carregar lista de alunos (cadastrados em Relatórios -> localStorage)
  useEffect(() => {
    try {
      const raw = localStorage.getItem('relatorios-v1');
      if (raw) setStudents(JSON.parse(raw));
    } catch (err) { console.warn('Erro ao carregar alunos', err); }
  }, []);

  // salvar automaticamente com debounce
  useEffect(() => {
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => {
      try {
  const payload = { answers, page, selectedStudent, updatedAt: new Date().toISOString() };
        localStorage.setItem(DRAFT_KEY, JSON.stringify(payload));
        setLastSaved(new Date());
        setStatusMessage('Rascunho salvo automaticamente');
        setTimeout(() => setStatusMessage(''), 1200);
      } catch (err) {
        console.warn('Erro ao salvar rascunho', err);
      }
    }, 600);
    return () => { if (saveTimeout.current) clearTimeout(saveTimeout.current); };
  }, [answers, page]);

  const handleAnswer = (index, value) => {
    setAnswers((prev) => ({ ...prev, [index]: value }));
  };

  const saveDraftNow = () => {
    try {
  const payload = { answers, page, selectedStudent, updatedAt: new Date().toISOString() };
      localStorage.setItem(DRAFT_KEY, JSON.stringify(payload));
      setLastSaved(new Date());
      setStatusMessage('Rascunho salvo');
      setTimeout(() => setStatusMessage(''), 1500);
    } catch (err) {
      alert('Falha ao salvar rascunho. Veja console.');
      console.warn(err);
    }
  };

  const clearDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
    setStatusMessage('Rascunho removido');
    setTimeout(() => setStatusMessage(''), 1500);
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
      setStatusMessage('Selecione o aluno avaliado antes de enviar.');
      setTimeout(()=>setStatusMessage(''), 2200);
      return;
    }

    const payload = questions.map((q, i) => ({ question: q, answer: answers[i] || null }));

    // endpoint configurável
    const ENDPOINT = '/api/avaliacao';

  try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ payload, submittedAt: new Date().toISOString(), studentId: selectedStudent })
      });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      // sucesso
      clearDraft();
      alert('Avaliação enviada com sucesso.');
    } catch (err) {
      console.error('Erro ao enviar avaliação', err);
      alert('Falha ao enviar. As respostas foram salvas localmente.');
      saveDraftNow();
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
                <select value={selectedStudent} onChange={e=>setSelectedStudent(e.target.value)}>
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
            <div className="draft-info">{statusMessage || (lastSaved ? `Último salvamento: ${lastSaved.toLocaleString()}` : '')}</div>
            <div style={{display:'flex', gap:8}}>
              <button type="button" className="btn ghost" onClick={saveDraftNow}>Salvar rascunho</button>
              <button type="button" className="btn" onClick={() => { localStorage.removeItem(DRAFT_KEY); setAnswers({}); setPage(0); setStatusMessage('Rascunho excluído'); setTimeout(()=>setStatusMessage(''),1200); }}>Limpar rascunho</button>
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
                  <button type="button" className="page-btn" disabled={page===0} onClick={() => setPage(p => Math.max(0, p-1))}>Anterior</button>
                  <button type="button" className="page-btn" disabled={page===totalPages-1} onClick={() => setPage(p => Math.min(totalPages-1, p+1))}>Próxima</button>
                </div>
                <div className="page-numbers">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button key={i} type="button" className={`page-num ${i===page? 'active': ''}`} onClick={() => setPage(i)}>{i+1}</button>
                  ))}
                </div>
                <div style={{display:'flex', gap:8}}>
                  <button type="button" className="btn ghost" onClick={() => { setPage(0); window.scrollTo({top:0, behavior:'smooth'}); }}>Início</button>
                  <button type="submit" className="btn primary">Enviar avaliação</button>
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
