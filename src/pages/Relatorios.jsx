import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setSearchQuery,
  setStatus,
  clearStatus,
} from '../redux/slices/reportsSlice';
import { fetchStudents } from '../redux/slices/studentsSlice';
import './Relatorios.css';

function monthsBetween(start) {
  const a = new Date(start);
  const b = new Date();
  const months = (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth());
  return Math.max(0, months);
}

export default function Relatorios() {
  const dispatch = useDispatch();
  
  const { searchQuery, status } = useSelector((state) => state.reports);
  const { students } = useSelector((state) => state.students);
  const { evaluations } = useSelector((state) => state.evaluations);

  // Carregar lista de alunos ao montar o componente
  useEffect(() => {
    dispatch(fetchStudents());
  }, [dispatch]);

  const filtered = useMemo(() => {
    const term = searchQuery.trim().toLowerCase();
    if (!term) return students;
    return students.filter(s => s.name.toLowerCase().includes(term));
  }, [searchQuery, students]);

  useEffect(() => {
    if (status) {
      const timer = setTimeout(() => dispatch(clearStatus()), 1200);
      return () => clearTimeout(timer);
    }
  }, [status, dispatch]);

  // Encontrar avaliações para cada aluno
  const getStudentEvaluations = (studentId) => {
    return evaluations.filter(e => e.studentId === studentId);
  };

  const getLastEvaluation = (studentId) => {
    const studentEvals = getStudentEvaluations(studentId);
    if (studentEvals.length === 0) return null;
    return studentEvals.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))[0];
  };

  // Score calculation: sim=+1, maioria=+0.5, raras=-0.5, nao=-1
  const calcSuggestion = (answersObj) => {
    if (!answersObj) return { label: 'Sem dados', code: 'none', score: 0 };
    const map = { sim: 1, maioria: 0.5, raras: -0.5, nao: -1 };
    const vals = Object.values(answersObj).map(v => map[v] ?? 0);
    if (!vals.length) return { label: 'Sem dados', code: 'none', score: 0 };
    const avg = vals.reduce((a,b)=>a+b,0)/vals.length;
    // thresholds: avg <= -0.4 => suporte a mais; avg <= 0 => mais atenção; else ok
    if (avg <= -0.4) return { label: 'Suporte a mais', code: 'support', score: avg };
    if (avg <= 0) return { label: 'Mais atenção', code: 'attention', score: avg };
    return { label: 'OK', code: 'ok', score: avg };
  };


  return (
    <div className="relatorios-page">
      {/* Header provided globally by src/components/Header.jsx */}

      <main className="main site-container">
        <h1>Relatórios de Avaliações</h1>

        <section className="controls row card">
          <input 
            placeholder="Pesquisar por nome do aluno..." 
            value={searchQuery} 
            onChange={e => dispatch(setSearchQuery(e.target.value))} 
          />
          <div className="actions">
            <button className="btn ghost" onClick={() => dispatch(setSearchQuery(''))}>Limpar</button>
          </div>
        </section>

        <section className="results">
          {filtered.length === 0 && <p className="muted">Nenhum aluno encontrado.</p>}

          <div className="student-list">
            {filtered.map(s => {
              const studentEvals = getStudentEvaluations(s.id);
              const lastEval = getLastEvaluation(s.id);
              
              return (
                <div key={s.id} className="student card">
                  <div className="student-left">
                    <div className="student-name">{s.name}</div>
                    <div className="small muted">
                      Avaliações: {studentEvals.length || 0} • 
                      Última: {lastEval ? new Date(lastEval.submittedAt).toLocaleDateString() : '—'}
                    </div>
                    {s.email && <div className="small muted">Email: {s.email}</div>}
                    {s.grade && <div className="small muted">Série: {s.grade}</div>}
                    {/* suggestion based on lastAnswers */}
                    {(() => {
                      const sug = lastEval && lastEval.answers ? calcSuggestion(lastEval.answers) : { label: 'Sem dados', code: 'none', score: 0 };
                      return (
                        <div className={`suggestion suggestion-${sug.code}`} title={`score ${sug.score.toFixed(2)}`}>
                          {sug.label}
                        </div>
                      );
                    })()}
                  </div>

                  <div className="student-mid">
                    {lastEval ? (
                      <div>
                        <div className="small" style={{marginTop: '8px'}}>
                          <strong>Data da Avaliação:</strong>
                        </div>
                        <div className="small muted">
                          {new Date(lastEval.submittedAt).toLocaleString()}
                        </div>
                      </div>
                    ) : (
                      <div className="muted">Ainda não há avaliação registrada</div>
                    )}
                  </div>

                  <div className="student-right">
                    <div className="student-actions">
                      <button 
                        className="btn secondary" 
                        onClick={() => dispatch(setStatus(`Aluno: ${s.name} - ${studentEvals.length} avaliação(ões)`))}
                      >
                        Ver Avaliações ({studentEvals.length})
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {status && <div className="status-bar">{status}</div>}
      </main>


      {/* rodapé removido */}
    </div>
  );
}
