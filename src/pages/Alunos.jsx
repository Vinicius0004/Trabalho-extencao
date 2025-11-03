import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setEditing,
  clearEditing,
  setConfirming,
  clearConfirming,
  setToast,
  clearToast,
  fetchStudents,
  createStudent,
  updateStudent,
  deleteStudent,
} from '../redux/slices/studentsSlice';
import { validateSchema } from '../validations';
import { studentSchema } from '../validations/studentSchema';
import Select from '../components/Select';
import './Alunos.css';

// Opções de séries/turmas disponíveis
const SERIES_OPTIONS = [
  // Ensino Fundamental I
  { value: '1º Ano EF I', label: '1º Ano EF I' },
  { value: '2º Ano EF I', label: '2º Ano EF I' },
  { value: '3º Ano EF I', label: '3º Ano EF I' },
  { value: '4º Ano EF I', label: '4º Ano EF I' },
  { value: '5º Ano EF I', label: '5º Ano EF I' },
  
  // Ensino Fundamental II
  { value: '1º Ano EF II', label: '1º Ano EF II (6º Ano)' },
  { value: '2º Ano EF II', label: '2º Ano EF II (7º Ano)' },
  { value: '3º Ano EF II', label: '3º Ano EF II (8º Ano)' },
  { value: '4º Ano EF II', label: '4º Ano EF II (9º Ano)' },
  
  // Ensino Médio
  { value: '1º Ano EM', label: '1º Ano EM' },
  { value: '2º Ano EM', label: '2º Ano EM' },
  { value: '3º Ano EM', label: '3º Ano EM' },
  
  // EJA (Educação de Jovens e Adultos)
  { value: 'EJA - Fundamental', label: 'EJA - Ensino Fundamental' },
  { value: 'EJA - Médio', label: 'EJA - Ensino Médio' },
  
  // Educação Profissional
  { value: 'Técnico Integrado - 1º Ano', label: 'Técnico Integrado - 1º Ano' },
  { value: 'Técnico Integrado - 2º Ano', label: 'Técnico Integrado - 2º Ano' },
  { value: 'Técnico Integrado - 3º Ano', label: 'Técnico Integrado - 3º Ano' },
  { value: 'Técnico Integrado - 4º Ano', label: 'Técnico Integrado - 4º Ano' },
  
  // Outras
  { value: 'Outro', label: 'Outro' },
];

function Alunos() {
  const dispatch = useDispatch();
  const { students, editing, confirming, toast, loading } = useSelector((state) => state.students);
  const fileInputRef = useRef();
  const [errors, setErrors] = useState({});

  // Carregar alunos ao montar o componente
  useEffect(() => {
    dispatch(fetchStudents());
  }, [dispatch]);

  // Adicionar novo aluno
  const addNewStudent = () => {
    const newStudent = {
      id: Date.now().toString(),
      name: '',
      cpf: '',
      email: '',
      pcd: '',
      descricao: '',
      foto: '',
      schoolClass: '',
      notes: ''
    };
    dispatch(setEditing(newStudent));
    dispatch(clearToast());
  };

  // Abrir edição de aluno existente
  const openEdit = (student) => {
    if (!student) return;
    dispatch(setEditing({ ...student }));
    dispatch(clearToast());
  };

  const closeEdit = () => {
    dispatch(clearEditing());
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleChange = (key, value) => {
    dispatch(setEditing({ ...editing, [key]: value }));
  };

  const handlePhoto = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      dispatch(setEditing({ ...editing, foto: reader.result }));
    };
    reader.readAsDataURL(f);
  };

  const removePhoto = () => {
    dispatch(setEditing({ ...editing, foto: '' }));
  };

  const saveStudentHandler = async () => {
    if (!editing) return;
    
    // Validar dados com Yup
    const result = await validateSchema(studentSchema, editing);
    
    if (!result.valid) {
      setErrors(result.errors);
      const firstError = Object.values(result.errors)[0];
      dispatch(setToast(firstError));
      return;
    }
    
    setErrors({});
    
    // Verificar se é novo ou atualização
    const isNew = !students.some(s => s.id === editing.id);
    
    if (isNew) {
      await dispatch(createStudent(editing));
    } else {
      await dispatch(updateStudent(editing));
    }
    
    closeEdit();
  };

  const removeStudent = (id) => {
    dispatch(setConfirming(id));
  };

  const confirmRemove = async (id) => {
    await dispatch(deleteStudent(id));
    dispatch(clearConfirming());
  };

  const cancelRemove = () => {
    dispatch(clearConfirming());
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => dispatch(clearToast()), 2000);
      return () => clearTimeout(timer);
    }
  }, [toast, dispatch]);

  return (
  <div className="alunos-container center" style={{minHeight:'calc(100vh - 56px)', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
      <main className="site-container">
        <div className="alunos-header">
          <h1>Gestão de Alunos</h1>
          <button className="btn primary" onClick={addNewStudent}>+ Adicionar Aluno</button>
        </div>

        {loading && students.length === 0 ? (
          <div className="empty">
            <p>Carregando alunos...</p>
          </div>
        ) : students.length === 0 ? (
          <div className="empty">
            <p>Nenhum aluno cadastrado ainda.</p>
            <button className="btn primary" onClick={addNewStudent} style={{marginTop:'16px'}}>Cadastrar Primeiro Aluno</button>
          </div>
        ) : (
          <div className="alunos-grid">
            {students.map(st => (
              <div className="aluno-card card" key={st.id}>
                <div className="aluno-photo">
                  {st.foto ? <img src={st.foto} alt={st.name} /> : <div className="photo-placeholder">📷</div>}
                </div>
                <div className="aluno-info">
                  <h3 className="aluno-name">{st.name}</h3>
                  {st.cpf && <p className="muted small">CPF: {st.cpf}</p>}
                  {st.email && <p className="muted small">Email: {st.email}</p>}
                  {st.pcd && <p className="muted small">PCD: {st.pcd}</p>}
                  {st.schoolClass && <p className="muted">Turma: {st.schoolClass}</p>}
                  {st.descricao && <p className="notes small">{st.descricao}</p>}
                  {st.notes && <p className="notes small">{st.notes}</p>}
                  <div className="inline-actions" style={{marginTop:'12px'}}>
                    <button className="btn small primary" onClick={() => openEdit(st)}>Editar</button>
                    <button className="btn small danger" onClick={() => removeStudent(st.id)}>Remover</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {editing && (
        <div className="edit-modal">
          <div className="edit-card card">
            <h2>{students.some(s=>s.id===editing.id) ? 'Editar Aluno' : 'Cadastrar Novo Aluno'}</h2>
            
            <div className="form-grid">
              <div className="form-left-section">
                <div className="form-row">
                  <label>Nome Completo *</label>
                  <input 
                    value={editing.name || ''} 
                    onChange={e=>handleChange('name', e.target.value)} 
                    placeholder="Nome completo do aluno"
                  />
                  {errors.name && <span className="error-text">{errors.name}</span>}
                </div>

                <div className="form-row">
                  <label>CPF</label>
                  <input 
                    value={editing.cpf || ''} 
                    onChange={e=>handleChange('cpf', e.target.value)} 
                    placeholder="000.000.000-00"
                  />
                  {errors.cpf && <span className="error-text">{errors.cpf}</span>}
                </div>

                <div className="form-row">
                  <label>Email</label>
                  <input 
                    type="email"
                    value={editing.email || ''} 
                    onChange={e=>handleChange('email', e.target.value)} 
                    placeholder="email@exemplo.com"
                  />
                  {errors.email && <span className="error-text">{errors.email}</span>}
                </div>

                <div className="form-row">
                  <label>PCD (se houver)</label>
                  <input 
                    value={editing.pcd || ''} 
                    onChange={e=>handleChange('pcd', e.target.value)} 
                    placeholder="Deficiência (se houver)"
                  />
                </div>

                <Select
                  label="Série / Turma"
                  value={editing.schoolClass || ''}
                  onChange={e => handleChange('schoolClass', e.target.value)}
                  options={SERIES_OPTIONS}
                  placeholder="Selecione a série/turma"
                  error={errors.schoolClass}
                />
              </div>

              <div className="form-right-section">
                <div className="form-row">
                  <label>Foto</label>
                  <div className="photo-controls">
                    {editing.foto ? (
                      <div className="photo-preview">
                        <img src={editing.foto} alt="preview" />
                        <button className="btn ghost" onClick={removePhoto} type="button">Remover Foto</button>
                      </div>
                    ) : (
                      <div className="photo-placeholder small">📷 Sem foto</div>
                    )}
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhoto} />
                  </div>
                </div>
              </div>
            </div>

            <div className="form-row">
              <label>Descrição / Observações</label>
              <textarea 
                value={editing.descricao || editing.notes || ''} 
                onChange={e=>{
                  handleChange('descricao', e.target.value);
                  handleChange('notes', e.target.value);
                }} 
                rows={4}
                placeholder="Informações adicionais sobre o aluno..."
              />
              {(errors.descricao || errors.notes) && (
                <span className="error-text">{errors.descricao || errors.notes}</span>
              )}
            </div>

            <div className="modal-actions">
              <button className="btn primary" onClick={saveStudentHandler}>Salvar</button>
              <button className="btn ghost" onClick={closeEdit}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="toast">{toast}</div>}
      {confirming && (
        <div className="modal-backdrop">
          <div className="modal card">
            <h3>Confirmar exclusão</h3>
            <p>Deseja realmente remover este aluno?</p>
            <div style={{display:'flex',gap:10,justifyContent:'flex-end',marginTop:12}}>
              <button className="btn ghost" onClick={cancelRemove}>Cancelar</button>
              <button className="btn danger" onClick={() => confirmRemove(confirming)}>Remover</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Alunos;
