import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  updateMarketStart,
  setSearchQuery,
  setStatus,
  clearStatus,
  setConfirming,
  clearConfirming,
  removeStudent,
  addStudent,
} from '../redux/slices/reportsSlice';
import './Relatorios.css';

function monthsBetween(start) {
  const a = new Date(start);
  const b = new Date();
  const months = (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth());
  return Math.max(0, months);
}

export default function Relatorios() {
  const dispatch = useDispatch();
  
  const { students, searchQuery, status, confirming } = useSelector((state) => state.reports);

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

  const handleUpdateMarketStart = (id, date) => {
    dispatch(updateMarketStart({ id, date }));
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

  const addMock = () => {
    const id = Date.now();
    const newS = { 
      id, 
      name: `Aluno ${id%1000}`, 
      evaluations: 0, 
      marketStart: new Date().toISOString().slice(0,10), 
      lastEvaluation: '' 
    };
    dispatch(addStudent(newS));
  };

  const handleRemoveStudent = (id) => {
    dispatch(setConfirming(id));
  };

  const confirmRemoveStudent = (id) => {
    dispatch(removeStudent(id));
    dispatch(clearConfirming());
  }

  const cancelRemove = () => {
    dispatch(clearConfirming());
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
            <button className="btn primary" onClick={addMock}>Pesquisar</button>
            <button className="btn ghost" onClick={() => dispatch(setSearchQuery(''))}>Limpar</button>
          </div>
        </section>

        <section className="results">
          {filtered.length === 0 && <p className="muted">Nenhum aluno encontrado.</p>}

          <div className="student-list">
            {filtered.map(s => {
              const months = s.marketStart ? monthsBetween(s.marketStart) : 0;
              const barW = Math.min(220, months * 2);
              return (
                <div key={s.id} className="student card">
                  <div className="student-left">
                    <div className="student-name">{s.name}</div>
                    <div className="small muted">Avaliações: {s.evaluations || 0} • Última: {s.lastEvaluation || '—'}</div>
                    {/* suggestion based on lastAnswers */}
                    {(() => {
                      const sug = calcSuggestion(s.lastAnswers);
                      return (
                        <div className={`suggestion suggestion-${sug.code}`} title={`score ${sug.score.toFixed(2)}`}>
                          {sug.label}
                        </div>
                      );
                    })()}
                  </div>

                  <div className="student-mid">
                    <label>Entrada no mercado</label>
                    <input 
                      type="date" 
                      value={s.marketStart || ''} 
                      onChange={e => handleUpdateMarketStart(s.id, e.target.value)} 
                    />
                    <div className="time-small">Tempo no mercado: <strong>{Math.floor(months/12)} anos {months%12} meses</strong></div>
                  </div>

                  <div className="student-right">
                    <svg width="240" height="40" className="mini-chart" role="img" aria-label={`Tempo no mercado ${months} meses`}>
                      <rect x="0" y="12" width="220" height="12" rx="6" fill="var(--bg-card)" />
                      <rect x="0" y="12" width="{barW}" height="12" rx="6" fill="var(--primary)" style={{width: barW}} />
                      <text x="4" y="28" fontSize="11" fill="#fff">{months} meses</text>
                    </svg>

                    <div className="student-actions">
                      <button 
                        className="btn secondary" 
                        onClick={() => dispatch(setStatus('Visualizar detalhes ainda não implementado'))}
                      >
                        Detalhes
                      </button>
                      <button className="btn danger" onClick={() => handleRemoveStudent(s.id)}>Remover</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {status && <div className="status-bar">{status}</div>}
      </main>

      {confirming && (
        <div className="modal-backdrop">
          <div className="modal card">
            <h3>Confirmar exclusão</h3>
            <p>Deseja realmente remover este aluno dos relatórios?</p>
            <div style={{display:'flex',gap:10,justifyContent:'flex-end',marginTop:12}}>
              <button className="btn ghost" onClick={cancelRemove}>Cancelar</button>
              <button className="btn danger" onClick={() => confirmRemoveStudent(confirming)}>Remover</button>
            </div>
          </div>
        </div>
      )}

      {/* rodapé removido */}
    </div>
  );
}
