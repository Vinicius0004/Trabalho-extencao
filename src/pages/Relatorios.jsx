import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Relatorios.css';

const STORAGE_KEY = 'relatorios-v1';
const DRAFT_KEY = 'avaliacao-draft-v1';

function monthsBetween(start) {
  const a = new Date(start);
  const b = new Date();
  const months = (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth());
  return Math.max(0, months);
}

export default function Relatorios() {
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const [students, setStudents] = useState([]);
  const [status, setStatus] = useState('');
  const [confirming, setConfirming] = useState(null);

  // seed from stored relatorios or fallback to simple mock + any avaliacao draft
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setStudents(JSON.parse(raw));
        return;
      }
      // try to seed from avaliacao-draft if present
      const draftRaw = localStorage.getItem(DRAFT_KEY);
      const seed = [];
      if (draftRaw) {
        try {
          const d = JSON.parse(draftRaw);
          if (d.name) seed.push({ id: Date.now(), name: d.name, evaluations: 1, marketStart: d.marketStart || new Date().toISOString().slice(0,10), lastEvaluation: new Date().toISOString().slice(0,10) });
        } catch(e){}
      }
      // small mock list
      // add sample lastAnswers to illustrate report calculations (keys are question indexes)
      const mock = [
        { id: 1, name: 'Ana Silva', evaluations: 3, marketStart: '2019-06-01', lastEvaluation: '2024-08-01', lastAnswers: {0:'sim',1:'sim',2:'nao',3:'maioria',4:'sim',5:'nao'} },
        { id: 2, name: 'Bruno Costa', evaluations: 1, marketStart: '2021-11-15', lastEvaluation: '2023-12-12', lastAnswers: {0:'nao',1:'nao',2:'nao',3:'raras',4:'nao'} },
        { id: 3, name: 'Carla Sousa', evaluations: 2, marketStart: '2018-02-20', lastEvaluation: '2024-01-05', lastAnswers: {0:'sim',1:'maioria',2:'sim',3:'sim',4:'maioria'} }
      ];
      const list = [...seed, ...mock];
      setStudents(list);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (err) { console.warn(err); }
  }, []);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(students)); } catch(e){}
  }, [students]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return students;
    return students.filter(s => s.name.toLowerCase().includes(term));
  }, [q, students]);

  const updateMarketStart = (id, date) => {
    setStudents(prev => prev.map(s => s.id === id ? {...s, marketStart: date } : s));
    setStatus('Alteração salva.');
    setTimeout(()=>setStatus(''), 1200);
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
    const newS = { id, name: `Aluno ${id%1000}`, evaluations: 0, marketStart: new Date().toISOString().slice(0,10), lastEvaluation: '' };
    setStudents(prev => [newS, ...prev]);
  };

  const removeStudent = (id) => {
    setConfirming(id);
  };

  const confirmRemove = (id) => {
    setStudents(prev => prev.filter(s => s.id !== id));
    setConfirming(null);
  }

  const cancelRemove = () => setConfirming(null);

  return (
    <div className="relatorios-page">
  {/* Header provided globally by src/components/Header.jsx */}

      <main className="main site-container">
        <h1>Relatórios de Avaliações</h1>

        <section className="controls row card">
          <input placeholder="Pesquisar por nome do aluno..." value={q} onChange={e=>setQ(e.target.value)} />
          <div className="actions">
            <button className="btn primary" onClick={addMock}>Pesquisar</button>
            <button className="btn ghost" onClick={()=>{ setQ(''); }}>Limpar</button>
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
                    <input type="date" value={s.marketStart || ''} onChange={e=>updateMarketStart(s.id, e.target.value)} />
                    <div className="time-small">Tempo no mercado: <strong>{Math.floor(months/12)} anos {months%12} meses</strong></div>
                  </div>

                  <div className="student-right">
                    <svg width="240" height="40" className="mini-chart" role="img" aria-label={`Tempo no mercado ${months} meses`}>
                      <rect x="0" y="12" width="220" height="12" rx="6" fill="var(--bg-card)" />
                      <rect x="0" y="12" width="{barW}" height="12" rx="6" fill="var(--primary)" style={{width: barW}} />
                      <text x="4" y="28" fontSize="11" fill="#fff">{months} meses</text>
                    </svg>

                    <div className="student-actions">
                      <button className="btn secondary" onClick={()=>setStatus('Visualizar detalhes ainda não implementado')}>Detalhes</button>
                      <button className="btn danger" onClick={()=>removeStudent(s.id)}>Remover</button>
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
              <button className="btn danger" onClick={() => confirmRemove(confirming)}>Remover</button>
            </div>
          </div>
        </div>
      )}

  {/* rodapé removido */}
    </div>
  );
}

// modal backdrop markup (rendered by page when confirming)
// we render conditionally in the JSX by inserting before return end - but easier: export helper components or reuse existing CSS
