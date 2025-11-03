import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setSearchQuery,
  setStatus,
  clearStatus,
} from '../redux/slices/reportsSlice';
import { fetchStudents } from '../redux/slices/studentsSlice';
import { fetchEvaluations } from '../redux/slices/evaluationsSlice';
import { fetchForwarding } from '../redux/slices/forwardingSlice';
import { fetchInternalControl } from '../redux/slices/internalControlSlice';
import Modal from '../components/Modal';
import Button from '../components/Button';
import './Relatorios.css';

// Perguntas da avaliação (mesmas do AvaliacaoAlunos.jsx)
const EVALUATION_QUESTIONS = [
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
];

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
  const { records: forwardingRecords } = useSelector((state) => state.forwarding);
  const { records: internalControlRecords } = useSelector((state) => state.internalControl);
  
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null); // 'evaluations', 'forwarding', 'internalControl'

  // Carregar lista de alunos e avaliações ao montar o componente
  useEffect(() => {
    dispatch(fetchStudents());
    dispatch(fetchEvaluations());
    dispatch(fetchForwarding());
    dispatch(fetchInternalControl());
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
    if (!evaluations || !Array.isArray(evaluations)) return [];
    // Tentar comparar tanto com ID string quanto número
    return evaluations.filter(e => {
      const evalStudentId = String(e.studentId || e.student?.id || '');
      const studentIdStr = String(studentId || '');
      return evalStudentId === studentIdStr || 
             e.studentId === studentId ||
             e.student?.id === studentId ||
             e.studentName === students.find(s => s.id === studentId)?.name;
    });
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

  // Mapeamento de respostas para labels
  const getAnswerLabel = (answer) => {
    const labels = {
      sim: 'Sim',
      maioria: 'Maioria das vezes',
      raras: 'Raras vezes',
      nao: 'Não'
    };
    return labels[answer] || answer;
  };

  const getAnswerColor = (answer) => {
    const colors = {
      sim: 'var(--success)',
      maioria: 'var(--accent)',
      raras: 'var(--warning)',
      nao: 'var(--danger)'
    };
    return colors[answer] || 'var(--muted-text)';
  };

  const handleViewEvaluations = (student) => {
    setSelectedStudent(student);
    setModalType('evaluations');
    setIsModalOpen(true);
  };

  const handleViewForwarding = (student) => {
    setSelectedStudent(student);
    setModalType('forwarding');
    setIsModalOpen(true);
  };

  const handleViewInternalControl = (student) => {
    setSelectedStudent(student);
    setModalType('internalControl');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedStudent(null);
    setModalType(null);
  };

  // Buscar encaminhamentos do aluno
  const getStudentForwarding = (studentName) => {
    if (!forwardingRecords || !Array.isArray(forwardingRecords)) return [];
    return forwardingRecords.filter(f => f.aluno === studentName);
  };

  // Buscar controle interno do aluno
  const getStudentInternalControl = (studentName) => {
    if (!internalControlRecords || !Array.isArray(internalControlRecords)) return [];
    return internalControlRecords.filter(c => c.aluno === studentName);
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
                      <Button
                        variant="secondary"
                        onClick={() => handleViewEvaluations(s)}
                        disabled={studentEvals.length === 0}
                      >
                        Ver Avaliações ({studentEvals.length})
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => handleViewForwarding(s)}
                        disabled={getStudentForwarding(s.name).length === 0}
                      >
                        Encaminhamentos ({getStudentForwarding(s.name).length})
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => handleViewInternalControl(s)}
                        disabled={getStudentInternalControl(s.name).length === 0}
                      >
                        Controle Interno ({getStudentInternalControl(s.name).length})
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {status && <div className="status-bar">{status}</div>}
      </main>

      {/* Modal de Informações */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedStudent ? (
          modalType === 'evaluations' ? `Avaliações de ${selectedStudent.name}` :
          modalType === 'forwarding' ? `Encaminhamentos de ${selectedStudent.name}` :
          modalType === 'internalControl' ? `Controle Interno de ${selectedStudent.name}` :
          'Informações'
        ) : 'Informações'}
        size="large"
      >
        {selectedStudent && modalType === 'evaluations' && (() => {
          const studentEvals = getStudentEvaluations(selectedStudent.id);
          const sortedEvals = studentEvals && studentEvals.length > 0 
            ? [...studentEvals].sort((a, b) => {
                const dateA = new Date(a.submittedAt || a.createdAt || 0);
                const dateB = new Date(b.submittedAt || b.createdAt || 0);
                return dateB - dateA;
              })
            : [];

          if (studentEvals.length === 0) {
            return (
              <div className="evaluations-empty">
                <p>Nenhuma avaliação registrada para este aluno.</p>
              </div>
            );
          }

          return (
            <div className="evaluations-container">
              <div className="evaluations-header">
                <div className="evaluations-summary">
                  <span className="evaluations-count">
                    Total: {studentEvals.length} avaliação{studentEvals.length !== 1 ? 'ões' : ''}
                  </span>
                </div>
              </div>

              <div className="evaluations-list">
                {sortedEvals.map((evalItem, index) => {
                  // Normalizar answers para garantir que temos um objeto
                  let normalizedAnswers = null;
                  
                  // Verificar diferentes formatos
                  if (evalItem.answers) {
                    if (typeof evalItem.answers === 'object' && !Array.isArray(evalItem.answers)) {
                      normalizedAnswers = evalItem.answers;
                    } else if (Array.isArray(evalItem.answers)) {
                      // Converter array para objeto: [{question, answer}, ...] -> {0: answer, 1: answer, ...}
                      normalizedAnswers = {};
                      evalItem.answers.forEach((item, idx) => {
                        if (item && typeof item === 'object' && item.answer) {
                          normalizedAnswers[idx] = item.answer;
                        } else if (item) {
                          normalizedAnswers[idx] = item;
                        }
                      });
                    }
                  }
                  
                  // Se ainda não temos answers, tentar payload
                  if (!normalizedAnswers && evalItem.payload && Array.isArray(evalItem.payload)) {
                    normalizedAnswers = {};
                    evalItem.payload.forEach((item, idx) => {
                      if (item && typeof item === 'object' && item.answer) {
                        normalizedAnswers[idx] = item.answer;
                      }
                    });
                  }
                  
                  const suggestion = calcSuggestion(normalizedAnswers || evalItem.answers);
                  const evalDate = new Date(evalItem.submittedAt || evalItem.createdAt || Date.now());
                  
                  return (
                    <div key={evalItem.id || index} className="evaluation-card">
                      <div className="evaluation-header">
                        <div className="evaluation-info">
                          <h4 className="evaluation-title">
                            Avaliação #{sortedEvals.length - index}
                          </h4>
                          <div className="evaluation-meta">
                            <span className="evaluation-date">
                              {evalDate.toLocaleDateString('pt-BR', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                            <span 
                              className={`suggestion suggestion-${suggestion.code}`}
                              title={`Score: ${suggestion.score.toFixed(2)}`}
                            >
                              {suggestion.label}
                            </span>
                          </div>
                        </div>
                      </div>

                      {(() => {
                        // Usar normalizedAnswers que já foi processado acima
                        const answersObj = normalizedAnswers;
                        
                        if (answersObj && Object.keys(answersObj).length > 0) {
                          return (
                            <div className="evaluation-answers">
                              <h5 className="answers-title">Respostas:</h5>
                              <div className="answers-grid">
                                {Object.entries(answersObj)
                                  .sort(([a], [b]) => {
                                    const numA = parseInt(a);
                                    const numB = parseInt(b);
                                    if (isNaN(numA) || isNaN(numB)) {
                                      return a.localeCompare(b);
                                    }
                                    return numA - numB;
                                  })
                                  .map(([questionIndex, answer]) => {
                                    const questionNum = parseInt(questionIndex);
                                    // Se answer é um objeto, extrair o valor
                                    const answerValue = typeof answer === 'object' && answer !== null 
                                      ? answer.answer || answer.value || answer 
                                      : answer;
                                    
                                    // Se questionIndex não é numérico, pode ser que seja um objeto com question
                                    let questionText;
                                    if (typeof answer === 'object' && answer !== null && answer.question) {
                                      questionText = answer.question;
                                    } else {
                                      questionText = EVALUATION_QUESTIONS[questionNum] || `Questão ${questionNum + 1}`;
                                    }
                                    
                                    if (!answerValue || answerValue === 'null') {
                                      return null;
                                    }
                                    
                                    return (
                                      <div key={questionIndex} className="answer-item">
                                        <div className="answer-question">
                                          <strong>{isNaN(questionNum) ? questionIndex : questionNum + 1}.</strong> {questionText}
                                        </div>
                                        <div 
                                          className="answer-value"
                                          style={{ color: getAnswerColor(answerValue) }}
                                        >
                                          {getAnswerLabel(answerValue)}
                                        </div>
                                      </div>
                                    );
                                  })
                                  .filter(Boolean)}
                              </div>
                            </div>
                          );
                        }
                        
                        return (
                          <div className="evaluation-empty-answers">
                            <p>Nenhuma resposta registrada nesta avaliação.</p>
                          </div>
                        );
                      })()}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}

        {/* Modal de Encaminhamentos */}
        {selectedStudent && modalType === 'forwarding' && (() => {
          const studentForwarding = getStudentForwarding(selectedStudent.name);
          const sortedForwarding = studentForwarding && studentForwarding.length > 0
            ? [...studentForwarding].sort((a, b) => {
                const dateA = new Date(a.dataAdmissao || a.createdAt || 0);
                const dateB = new Date(b.dataAdmissao || b.createdAt || 0);
                return dateB - dateA;
              })
            : [];

          if (studentForwarding.length === 0) {
            return (
              <div className="evaluations-empty">
                <p>Nenhum encaminhamento registrado para este aluno.</p>
              </div>
            );
          }

          return (
            <div className="evaluations-container">
              <div className="evaluations-header">
                <div className="evaluations-summary">
                  <span className="evaluations-count">
                    Total: {studentForwarding.length} encaminhamento{studentForwarding.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              <div className="evaluations-list">
                {sortedForwarding.map((forwardingItem, index) => (
                  <div key={forwardingItem.id || index} className="evaluation-card">
                    <div className="evaluation-header">
                      <div className="evaluation-info">
                        <h4 className="evaluation-title">
                          Encaminhamento #{sortedForwarding.length - index}
                        </h4>
                        <div className="evaluation-meta">
                          <span className="evaluation-date">
                            {forwardingItem.createdAt 
                              ? new Date(forwardingItem.createdAt).toLocaleDateString('pt-BR', {
                                  day: '2-digit',
                                  month: '2-digit',
                                  year: 'numeric'
                                })
                              : 'Data não informada'}
                          </span>
                          {!forwardingItem.dataDesligamento && (
                            <span className="suggestion suggestion-ok">
                              Ativo
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="evaluation-answers">
                      <div className="info-grid">
                        <div className="info-item">
                          <strong>Data de Admissão:</strong>
                          <span>{forwardingItem.dataAdmissao 
                            ? new Date(forwardingItem.dataAdmissao).toLocaleDateString('pt-BR')
                            : 'Não informado'}</span>
                        </div>
                        <div className="info-item">
                          <strong>Empresa:</strong>
                          <span>{forwardingItem.empresa || 'Não informado'}</span>
                        </div>
                        <div className="info-item">
                          <strong>Função:</strong>
                          <span>{forwardingItem.funcao || 'Não informado'}</span>
                        </div>
                        <div className="info-item">
                          <strong>Contato RH:</strong>
                          <span>{forwardingItem.contatoRH || 'Não informado'}</span>
                        </div>
                        {forwardingItem.dataDesligamento && (
                          <div className="info-item">
                            <strong>Data de Desligamento:</strong>
                            <span>{new Date(forwardingItem.dataDesligamento).toLocaleDateString('pt-BR')}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        {/* Modal de Controle Interno */}
        {selectedStudent && modalType === 'internalControl' && (() => {
          const studentControl = getStudentInternalControl(selectedStudent.name);
          const sortedControl = studentControl && studentControl.length > 0
            ? [...studentControl].sort((a, b) => {
                const dateA = new Date(a.ingresso || a.createdAt || 0);
                const dateB = new Date(b.ingresso || b.createdAt || 0);
                return dateB - dateA;
              })
            : [];

          if (studentControl.length === 0) {
            return (
              <div className="evaluations-empty">
                <p>Nenhum registro de controle interno para este aluno.</p>
              </div>
            );
          }

          return (
            <div className="evaluations-container">
              <div className="evaluations-header">
                <div className="evaluations-summary">
                  <span className="evaluations-count">
                    Total: {studentControl.length} registro{studentControl.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              <div className="evaluations-list">
                {sortedControl.map((controlItem, index) => (
                  <div key={controlItem.id || index} className="evaluation-card">
                    <div className="evaluation-header">
                      <div className="evaluation-info">
                        <h4 className="evaluation-title">
                          Registro #{sortedControl.length - index}
                        </h4>
                        <div className="evaluation-meta">
                          <span className="evaluation-date">
                            {controlItem.createdAt 
                              ? new Date(controlItem.createdAt).toLocaleDateString('pt-BR', {
                                  day: '2-digit',
                                  month: '2-digit',
                                  year: 'numeric'
                                })
                              : 'Data não informada'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="evaluation-answers">
                      <div className="info-grid">
                        <div className="info-item">
                          <strong>Data de Ingresso:</strong>
                          <span>{controlItem.ingresso 
                            ? new Date(controlItem.ingresso).toLocaleDateString('pt-BR')
                            : 'Não informado'}</span>
                        </div>
                        <div className="info-item">
                          <strong>Primeira Avaliação:</strong>
                          <span>{controlItem.primeiraAvaliacao 
                            ? new Date(controlItem.primeiraAvaliacao).toLocaleDateString('pt-BR')
                            : 'Não informado'}</span>
                        </div>
                        <div className="info-item">
                          <strong>Segunda Avaliação:</strong>
                          <span>{controlItem.segundaAvaliacao 
                            ? new Date(controlItem.segundaAvaliacao).toLocaleDateString('pt-BR')
                            : 'Não informado'}</span>
                        </div>
                        <div className="info-item">
                          <strong>Primeira Entrevista:</strong>
                          <span>{controlItem.primeiraEntrevista 
                            ? new Date(controlItem.primeiraEntrevista).toLocaleDateString('pt-BR')
                            : 'Não informado'}</span>
                        </div>
                        <div className="info-item">
                          <strong>Segunda Entrevista:</strong>
                          <span>{controlItem.segundaEntrevista 
                            ? new Date(controlItem.segundaEntrevista).toLocaleDateString('pt-BR')
                            : 'Não informado'}</span>
                        </div>
                        <div className="info-item">
                          <strong>Resultado:</strong>
                          <span>{controlItem.resultado || 'Não informado'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}
      </Modal>
    </div>
  );
}
