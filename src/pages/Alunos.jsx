import React, { useEffect, useState, useRef } from 'react';
import './Alunos.css';

function Alunos() {
  const STORAGE_KEY = 'alunos-cadastrados-v1';
  const [students, setStudents] = useState([]);
  const [editing, setEditing] = useState(null);
  const [toast, setToast] = useState('');
  const [confirming, setConfirming] = useState(null);
  const fileInputRef = useRef();

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setStudents(JSON.parse(raw));
    } catch (err) {
      console.warn('Erro ao carregar alunos', err);
    }
  }, []);

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
    setEditing(newStudent);
    setToast('');
  };

  // Abrir edição de aluno existente
  const openEdit = (student) => {
    if (!student) return;
    setEditing({ ...student });
    setToast('');
  };

  const closeEdit = () => {
    setEditing(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleChange = (key, value) => setEditing(prev => ({ ...prev, [key]: value }));

  const handlePhoto = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setEditing(prev => ({ ...prev, foto: reader.result }));
    reader.readAsDataURL(f);
  };

  const removePhoto = () => setEditing(prev => ({ ...prev, foto: '' }));

  const saveStudent = () => {
    if (!editing) return;
    if (!editing.name || editing.name.trim() === '') {
      setToast('Nome é obrigatório');
      setTimeout(() => setToast(''), 1800);
      return;
    }

    let updated;
    const exists = students.some(s => s.id === editing.id);
    if (exists) {
      updated = students.map(s => (s.id === editing.id ? editing : s));
      setToast('Aluno atualizado com sucesso!');
    } else {
      updated = [editing, ...students];
      setToast('Aluno cadastrado com sucesso!');
    }

    setStudents(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setTimeout(() => setToast(''), 2000);
    } catch (err) {
      console.error('Falha ao salvar aluno', err);
      setToast('Erro ao salvar');
      setTimeout(() => setToast(''), 2000);
    }
    closeEdit();
  };

  const removeStudent = (id) => {
    setConfirming(id);
  };

  const confirmRemove = (id) => {
    const updated = students.filter(s => s.id !== id);
    setStudents(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setToast('Aluno removido');
      setTimeout(() => setToast(''), 1600);
    } catch (err) {
      console.error(err);
    }
    setConfirming(null);
  };

  const cancelRemove = () => setConfirming(null);

  return (
  <div className="alunos-container center" style={{minHeight:'calc(100vh - 56px)', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
      <main className="site-container">
        <div className="alunos-header">
          <h1>Gestão de Alunos</h1>
          <button className="btn primary" onClick={addNewStudent}>+ Adicionar Aluno</button>
        </div>

        {students.length === 0 ? (
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
                </div>

                <div className="form-row">
                  <label>CPF</label>
                  <input 
                    value={editing.cpf || ''} 
                    onChange={e=>handleChange('cpf', e.target.value)} 
                    placeholder="000.000.000-00"
                  />
                </div>

                <div className="form-row">
                  <label>Email</label>
                  <input 
                    type="email"
                    value={editing.email || ''} 
                    onChange={e=>handleChange('email', e.target.value)} 
                    placeholder="email@exemplo.com"
                  />
                </div>

                <div className="form-row">
                  <label>PCD (se houver)</label>
                  <input 
                    value={editing.pcd || ''} 
                    onChange={e=>handleChange('pcd', e.target.value)} 
                    placeholder="Deficiência (se houver)"
                  />
                </div>

                <div className="form-row">
                  <label>Série / Turma</label>
                  <input 
                    value={editing.schoolClass || ''} 
                    onChange={e=>handleChange('schoolClass', e.target.value)} 
                    placeholder="Ex: 3º Ano A"
                  />
                </div>
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
            </div>

            <div className="modal-actions">
              <button className="btn primary" onClick={saveStudent}>Salvar</button>
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
