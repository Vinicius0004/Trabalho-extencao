import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  toggleNotification,
  removeNotification,
} from '../redux/slices/notificationsSlice';
import './HomePage.css';

function HomePage() {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.notifications);
  
  const [weeklyReminders, setWeeklyReminders] = useState([]);
  const [confirming, setConfirming] = useState(null); // id being confirmed

  // fallback: próximos lembretes (ordenados por data) — mostrados quando não houver lembretes desta semana
  const upcomingReminders = useMemo(() => {
    try {
      if (!items || !items.length) return [];
      const copy = [...items].sort((a,b) => new Date(a.when) - new Date(b.when));
      return copy.slice(0,5);
    } catch { 
      return []; 
    }
  }, [items]);

  useEffect(() => {
    // rebuild weekly list from items whenever they change
    buildWeeklyFrom(items);
  }, [items]);

  const buildWeeklyFrom = (itemsList) => {
    try {
      if (!itemsList || !itemsList.length) { setWeeklyReminders([]); return; }
      const now = new Date();
      const startOfWeek = new Date(now);
      const day = startOfWeek.getDay();
      const diffToMonday = (day + 6) % 7;
      startOfWeek.setDate(now.getDate() - diffToMonday);
      startOfWeek.setHours(0,0,0,0);
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 7);

      const weekItems = itemsList.filter(i => {
        const when = new Date(i.when);
        return when >= startOfWeek && when < endOfWeek;
      });
      setWeeklyReminders(weekItems);
    } catch { 
      console.warn('Erro ao construir lista semanal'); 
    }
  }

  const toggleRead = (id) => {
    dispatch(toggleNotification(id));
  };

  const removeReminder = (id) => {
    // show confirm modal
    setConfirming(id);
  }

  const confirmRemove = (id) => {
    dispatch(removeNotification(id));
    setConfirming(null);
  }

  const cancelRemove = () => setConfirming(null);

  return (
  <div className="home-container center" style={{minBlockSize:'calc(100vh - 56px)', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
  {/* Header is provided globally by src/components/Header.jsx */}

    
      {/* Seção de Informações e Estatísticas */}
      <main className="main">
        <div className="stats-container">
          <div className="stats-hero">
              <div className="welcome-message">
                <h2>Bem-vindo ao Painel</h2>
                <p>Use a barra de navegação no topo para acessar as principais áreas:</p>
                <ul>
                  <li><strong>Home</strong> — esta página.</li>
                  <li><strong>Alunos</strong> — cadastre e gerencie alunos.</li>
                  <li><strong>Avaliações</strong> — crie ou responda avaliações.</li>
                  <li><strong>Notificações</strong> — veja lembretes e crie avisos.</li>
                  <li><strong>Relatórios</strong> — visualize dados e histórico.</li>
                  <li><strong>Controle Interno</strong> — registro de acompanhamento.</li>
                  <li><strong>Encaminhamento</strong> — formulário de encaminhamento para empresa.</li>
                  <li><strong>Login e Registrar</strong> — entre ou cadastre-se.</li>
                </ul>
              </div>
          </div>
          <aside className="home-reminders">
            <div className="card reminders-card">
              <h3>Lembretes desta semana</h3>
              {weeklyReminders.length === 0 ? (
                (upcomingReminders.length > 0) ? (
                  <>
                    <p className="muted">Nenhum lembrete para esta semana — próximos lembretes:</p>
                    <ul className="reminders-list">
                      {upcomingReminders.map(r => (
                        <li key={r.id} className={`reminder-item ${r.read? 'read' : ''}`}>
                          <div>
                            <div className="reminder-title">{r.title}</div>
                            <div className="reminder-when small muted">{r.when}</div>
                          </div>
                          <div style={{display:'flex',gap:8,alignItems:'center'}}>
                            <button className="btn ghost" onClick={() => toggleRead(r.id)}>{r.read? 'Marcar não lido' : 'Marcar lido'}</button>
                            <button className="btn danger" onClick={() => removeReminder(r.id)}>Excluir</button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <p className="muted">Nenhum lembrete para esta semana.</p>
                )
              ) : (
                <ul className="reminders-list">
                  {weeklyReminders.map(r => (
                    <li key={r.id} className={`reminder-item ${r.read? 'read' : ''}`}>
                      <div>
                        <div className="reminder-title">{r.title}</div>
                        <div className="reminder-when small muted">{r.when}</div>
                      </div>
                      <div style={{display:'flex',gap:8,alignItems:'center'}}>
                        <button className="btn ghost" onClick={() => toggleRead(r.id)}>{r.read? 'Marcar não lido' : 'Marcar lido'}</button>
                        <button className="btn danger" onClick={() => removeReminder(r.id)}>Excluir</button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              <div style={{marginTop:10}}>
                <Link to="/notificacoes" className="btn ghost">Ver todas</Link>
              </div>
            </div>
          </aside>
          {confirming && (
            <div className="modal-backdrop">
              <div className="modal card">
                <h3>Confirmar exclusão</h3>
                <p>Deseja realmente excluir este lembrete?</p>
                <div style={{display:'flex',gap:10,justifyContent:'flex-end',marginTop:12}}>
                  <button className="btn ghost" onClick={cancelRemove}>Cancelar</button>
                  <button className="btn danger" onClick={() => confirmRemove(confirming)}>Excluir</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

  {/* rodapé removido */}
    </div>
  );
}

export default HomePage;
