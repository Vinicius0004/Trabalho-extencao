import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  toggleNotification,
  removeNotification,
} from '../redux/slices/notificationsSlice';
import { fetchEvaluations } from '../redux/slices/evaluationsSlice';
import { fetchForwarding } from '../redux/slices/forwardingSlice';
import { fetchInternalControl } from '../redux/slices/internalControlSlice';
import { setSelectedStudent } from '../redux/slices/evaluationsSlice';
import './HomePage.css';

function HomePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items } = useSelector((state) => state.notifications);
  const students = useSelector((state) => state.students.students || []);
  const evaluations = useSelector((state) => state.evaluations.evaluations || []);
  const forwarding = useSelector((state) => state.forwarding.records || []);
  const internalControl = useSelector((state) => state.internalControl.records || []);
  
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
    // Fetch all dashboard data
    dispatch(fetchEvaluations());
    dispatch(fetchForwarding());
    dispatch(fetchInternalControl());
  }, [dispatch]);

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

  // Handler para avaliar um aluno específico
  const handleEvaluateStudent = (studentId) => {
    // Definir o aluno selecionado no Redux para pré-selecionar na página de avaliação
    dispatch(setSelectedStudent(studentId));
    navigate('/avaliacao');
  };

  // Calculate dashboard metrics
  const stats = useMemo(() => {
    const activeForwarding = forwarding.filter(f => !f.dataDesligamento).length;
    const totalEvaluations = evaluations.length;
    const recentEvaluations = evaluations
      .filter(e => {
        const date = new Date(e.submittedAt);
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return date > monthAgo;
      })
      .length;

    return {
      students: students.length,
      evaluations: totalEvaluations,
      recentEvaluations,
      forwarding: forwarding.length,
      activeForwarding,
      internalControl: internalControl.length,
      pendingEvaluations: students.length - evaluations.filter(e => students.some(s => s.id === e.studentId)).length,
    };
  }, [students, evaluations, forwarding, internalControl]);

  // Students without evaluation
  const pendingStudents = useMemo(() => {
    const evaluatedStudentIds = new Set(evaluations.map(e => e.studentId));
    return students.filter(s => !evaluatedStudentIds.has(s.id)).slice(0, 5);
  }, [students, evaluations]);

  return (
  <div className="home-container">
    {/* Main Header & Dashboard Header */}
    <header className="dashboard-header-wrapper">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p className="dashboard-subtitle">Visão geral do sistema</p>
      </div>
    </header>

    <main className="main">

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-icon students">🧑‍🎓</div>
          <div className="stat-card-content">
            <h3>{stats.students}</h3>
            <p>Total de Alunos</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon evaluations">📝</div>
          <div className="stat-card-content">
            <h3>{stats.evaluations}</h3>
            <p>Avaliações Realizadas</p>
            {stats.recentEvaluations > 0 && (
              <span className="stat-badge">+{stats.recentEvaluations} no mês</span>
            )}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon forwarding">🚀</div>
          <div className="stat-card-content">
            <h3>{stats.activeForwarding}</h3>
            <p>Encaminhamentos Ativos</p>
            {stats.forwarding > 0 && (
              <span className="stat-badge">{stats.forwarding} total</span>
            )}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon control">📊</div>
          <div className="stat-card-content">
            <h3>{stats.internalControl}</h3>
            <p>Registros de Controle</p>
          </div>
        </div>
      </div>

      {/* Main Content Area - 2 Columns */}
      <div className="dashboard-content-grid">
        {/* Column 1: Pending Students */}
        {pendingStudents.length > 0 ? (
          <div className="dashboard-section">
            <div className="section-header">
              <h2>Alunos Pendentes</h2>
              <Link to="/alunos" className="view-all-link">Ver todos</Link>
            </div>
            <div className="students-list">
              {pendingStudents.map(student => (
                <div key={student.id} className="student-item">
                  <span className="student-icon">🧑‍🎓</span>
                  <div className="student-content">
                    <p className="student-name">{student.name}</p>
                    <span className="student-info">{student.grade || 'Sem série'}</span>
                  </div>
                  <button 
                    onClick={() => handleEvaluateStudent(student.id)}
                    className="action-btn"
                  >
                    Avaliar
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {/* Column 2: Quick Links */}
        <div className={`dashboard-section ${pendingStudents.length === 0 ? 'dashboard-section-full' : ''}`}>
          <div className="section-header">
            <h2>Acesso Rápido</h2>
          </div>
          <div className="quick-links-grid">
            <Link to="/alunos" className="quick-link-card">
              <div className="quick-link-icon">🧑‍🎓</div>
              <h3>Alunos</h3>
              <p>Gerenciar cadastros</p>
            </Link>
            <Link to="/avaliacao" className="quick-link-card">
              <div className="quick-link-icon">📝</div>
              <h3>Avaliações</h3>
              <p>Criar avaliações</p>
            </Link>
            <Link to="/encaminhamento" className="quick-link-card">
              <div className="quick-link-icon">🚀</div>
              <h3>Encaminhamento</h3>
              <p>Encaminhar alunos</p>
            </Link>
            <Link to="/controle-interno" className="quick-link-card">
              <div className="quick-link-icon">📊</div>
              <h3>Controle Interno</h3>
              <p>Registros internos</p>
            </Link>
            <Link to="/relatorios" className="quick-link-card">
              <div className="quick-link-icon">📈</div>
              <h3>Relatórios</h3>
              <p>Visualizar dados</p>
            </Link>
            <Link to="/notificacoes" className="quick-link-card">
              <div className="quick-link-icon">🔔</div>
              <h3>Notificações</h3>
              <p>Ver lembretes</p>
            </Link>
          </div>
        </div>
      </div>

      {/* Full Width: Reminders Section */}
      <div className="dashboard-section">
        <div className="section-header">
          <h2>Lembretes desta semana</h2>
        </div>
        {weeklyReminders.length === 0 ? (
          (upcomingReminders.length > 0) ? (
            <>
              <p className="muted">Nenhum lembrete para esta semana — próximos lembretes:</p>
              <ul className="reminders-list">
                {upcomingReminders.map(r => (
                  <li key={r.id} className={`reminder-item ${r.read? 'read' : ''}`}>
                    <div className="reminder-content">
                      <div className="reminder-title">{r.title}</div>
                      <div className="reminder-when small muted">{r.when}</div>
                    </div>
                    <div className="reminder-buttons">
                      <button className="btn ghost" onClick={() => toggleRead(r.id)}>{r.read? 'Não lido' : 'Lido'}</button>
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
                <div className="reminder-content">
                  <div className="reminder-title">{r.title}</div>
                  <div className="reminder-when small muted">{r.when}</div>
                </div>
                <div className="reminder-buttons">
                  <button className="btn ghost" onClick={() => toggleRead(r.id)}>{r.read? 'Não lido' : 'Lido'}</button>
                  <button className="btn danger" onClick={() => removeReminder(r.id)}>Excluir</button>
                </div>
              </li>
            ))}
          </ul>
        )}
        <div className="view-all-section">
          <Link to="/notificacoes" className="btn ghost">Ver todas as notificações</Link>
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirming && (
        <div className="modal-backdrop" onClick={cancelRemove}>
          <div className="modal card" onClick={(e) => e.stopPropagation()}>
            <h3>Confirmar exclusão</h3>
            <p>Deseja realmente excluir este lembrete?</p>
            <div className="modal-actions">
              <button className="btn ghost" onClick={cancelRemove}>Cancelar</button>
              <button className="btn danger" onClick={() => confirmRemove(confirming)}>Excluir</button>
            </div>
          </div>
        </div>
      )}

      </main>
    </div>
  );
}

export default HomePage;
