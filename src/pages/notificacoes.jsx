import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './notificacoes.css';
import { useNotifications } from '../context/NotificationsContext.jsx';

function Notificacoes() {
  const { items, add, toggle, remove } = useNotifications();
  const [title, setTitle] = useState('');
  const [when, setWhen] = useState('');

  const addItem = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    add({ title: title.trim(), when });
    setTitle(''); setWhen('');
  };

  return (
    <div className="notificacoes-page">
      <main className="main site-container">
        <h1>Notificações e Lembretes</h1>

        <section className="new-reminder card">
          <div className="new-reminder-header">
            <h3>Criar lembrete</h3>
            <div className="reminder-icon" aria-hidden>🔔</div>
          </div>

          <form onSubmit={addItem} className="reminder-form">
            <div className="reminder-grid">
              <textarea
                className="reminder-input"
                placeholder="Texto do lembrete (ex.: Avaliar aluno X após 60 dias)"
                value={title}
                onChange={e=>setTitle(e.target.value)}
                aria-label="Texto do lembrete"
                rows={5}
              />

              <div className="reminder-row">
                <input
                  className="reminder-date"
                  type="date"
                  value={when}
                  onChange={e=>setWhen(e.target.value)}
                  aria-label="Data do lembrete"
                />
                <div style={{flex:1}} />
                <button className="btn primary add-btn" disabled={!title.trim()}>Adicionar</button>
              </div>
            </div>

            <p className="reminder-help muted small">Dica: descreva o lembrete incluindo o aluno e o prazo (por ex.: "Avaliar João em 60 dias").</p>
          </form>
        </section>

        <section className="list-reminders">
          <h3>Lembretes</h3>
          {items.length === 0 && <p className="lead muted">Nenhum lembrete — crie um novo acima.</p>}

          <div className="reminder-list">
            {items.map(i => (
              <div key={i.id} className={`reminder card ${i.read? 'read' : ''}`}>
                <div className="reminder-left">
                  <div className="reminder-title">{i.title}</div>
                  <div className="reminder-when small muted">Agendado: {i.when}</div>
                </div>

                <div className="reminder-actions">
                  <button className="btn secondary" onClick={()=>toggle(i.id)}>{i.read? 'Marcar não lido' : 'Marcar lido'}</button>
                  <button className="btn danger" onClick={()=>remove(i.id)}>Excluir</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

    </div>
  );
}

  function Back() {
    const navigate = useNavigate();
    return (
      <button className="back-btn" onClick={() => navigate(-1)} aria-label="Voltar">
        ← Voltar
      </button>
    );
  }
export default Notificacoes;
