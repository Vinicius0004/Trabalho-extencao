# 🔗 Integração Completa - json-server + Redux + React

## ✅ Status da Integração

### Arquivos Atualizados

| Componente | Status | Descrição |
|------------|--------|-----------|
| ✅ **src/utils/api.js** | Criado | Helper de API com fallback para localStorage |
| ✅ **src/redux/slices/studentsSlice.js** | Atualizado | CRUD completo com json-server |
| ✅ **src/redux/slices/evaluationsSlice.js** | Atualizado | Sistema de avaliações integrado |
| ✅ **src/redux/slices/forwardingSlice.js** | Atualizado | Encaminhamentos com API |
| ✅ **src/redux/slices/internalControlSlice.js** | Atualizado | Controle interno integrado |
| ✅ **src/redux/slices/notificationsSlice.js** | Atualizado | Notificações com sync |
| ✅ **src/redux/slices/reportsSlice.js** | Atualizado | Relatórios com API |
| ✅ **src/redux/slices/authSlice.js** | Atualizado | Autenticação com json-server |
| ✅ **src/pages/Alunos.jsx** | Atualizado | Interface integrada com API |

---

## 🎯 Como Funciona

### 1. Arquitetura de 3 Camadas

```
┌─────────────────────────────────────────┐
│         REACT COMPONENTS                │
│   (Alunos.jsx, LoginPage.jsx, etc)     │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│         REDUX SLICES                    │
│  (studentsSlice, authSlice, etc)        │
│  - Actions (createStudent, login, etc)  │
│  - Reducers (state management)          │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│         API HELPER                      │
│  (src/utils/api.js)                     │
│  - api.get() / post() / put() /delete() │
│  - Fallback para localStorage           │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│         JSON SERVER                     │
│  (http://localhost:3001)                │
│  - db.json como banco de dados          │
└─────────────────────────────────────────┘
```

### 2. Fluxo de Dados

#### Carregando Dados (GET)

```javascript
// 1. Componente monta e dispara ação
useEffect(() => {
  dispatch(fetchStudents());
}, []);

// 2. Redux Slice processa (studentsSlice.js)
export const fetchStudents = createAsyncThunk(
  'students/fetch',
  async () => {
    return await api.get('/students', STORAGE_KEY);
  }
);

// 3. API Helper faz requisição (api.js)
const response = await fetch('http://localhost:3001/students');
const data = await response.json();
localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); // backup
return data;

// 4. Dados retornam ao Redux
.addCase(fetchStudents.fulfilled, (state, action) => {
  state.students = action.payload;
  state.loading = false;
});

// 5. Componente renderiza com dados novos
const { students } = useSelector(state => state.students);
```

#### Salvando Dados (POST/PUT)

```javascript
// 1. Usuário clica em "Salvar"
const saveStudentHandler = async () => {
  if (isNew) {
    await dispatch(createStudent(editing));
  } else {
    await dispatch(updateStudent(editing));
  }
};

// 2. Redux processa
export const createStudent = createAsyncThunk(
  'students/create',
  async (studentData) => {
    return await api.post('/students', studentData, STORAGE_KEY);
  }
);

// 3. API Helper envia ao servidor
const response = await fetch('http://localhost:3001/students', {
  method: 'POST',
  body: JSON.stringify(data)
});

// 4. Servidor salva no db.json
// db.json é atualizado automaticamente

// 5. Dados retornam e Redux atualiza state
.addCase(createStudent.fulfilled, (state, action) => {
  state.students = [action.payload, ...state.students];
  state.toast = 'Aluno cadastrado com sucesso!';
});
```

---

## 🔄 Sincronização Automática

### localStorage como Backup

Todos os dados são salvos **simultaneamente** em dois lugares:

1. **json-server** (banco principal)
2. **localStorage** (backup offline)

```javascript
// Exemplo do API Helper
async get(endpoint, storageKey) {
  try {
    // Tentar buscar do servidor
    const data = await fetch(`${API_BASE}${endpoint}`).then(r => r.json());
    
    // Salvar backup no localStorage
    localStorage.setItem(storageKey, JSON.stringify(data));
    
    return data;
  } catch (error) {
    // Se servidor offline, usar backup
    const localData = localStorage.getItem(storageKey);
    if (localData) return JSON.parse(localData);
    throw error;
  }
}
```

### Modo Offline

Se o json-server não estiver rodando:

- ✅ Aplicação continua funcionando
- ✅ Dados são salvos no localStorage
- ⚠️ Não há sincronização entre dispositivos
- ⚠️ Ao reiniciar servidor, dados locais NÃO são enviados automaticamente

---

## 📋 Thunks Disponíveis

### Students (Alunos)

```javascript
import { 
  fetchStudents,    // GET /students
  createStudent,    // POST /students
  updateStudent,    // PUT /students/:id
  deleteStudent     // DELETE /students/:id
} from '../redux/slices/studentsSlice';

// Uso:
dispatch(fetchStudents());
dispatch(createStudent({ name: 'João', age: 16, ... }));
dispatch(updateStudent({ id: 1, name: 'João Silva', ... }));
dispatch(deleteStudent(1));
```

### Evaluations (Avaliações)

```javascript
import {
  fetchEvaluations,           // GET /evaluations
  submitEvaluation,           // POST /evaluations
  fetchEvaluationsByStudent   // GET /evaluations?studentId=X
} from '../redux/slices/evaluationsSlice';

// Uso:
dispatch(fetchEvaluations());
dispatch(submitEvaluation({ 
  payload: { answers: {...} }, 
  studentId: '123',
  studentName: 'João'
}));
dispatch(fetchEvaluationsByStudent('123'));
```

### Forwarding (Encaminhamentos)

```javascript
import {
  fetchForwarding,      // GET /forwarding
  submitForwarding,     // POST /forwarding
  updateForwarding,     // PUT /forwarding/:id
  deleteForwarding      // DELETE /forwarding/:id
} from '../redux/slices/forwardingSlice';
```

### Internal Control (Controle Interno)

```javascript
import {
  fetchInternalControl,     // GET /internalControl
  submitInternalControl,    // POST /internalControl
  updateInternalControl,    // PUT /internalControl/:id
  deleteInternalControl     // DELETE /internalControl/:id
} from '../redux/slices/internalControlSlice';
```

### Notifications (Notificações)

```javascript
import {
  fetchNotifications,         // GET /notifications
  createNotification,         // POST /notifications
  toggleNotificationRead,     // PATCH /notifications/:id
  deleteNotification,         // DELETE /notifications/:id
  markAllAsReadAsync          // PATCH múltiplas notificações
} from '../redux/slices/notificationsSlice';
```

### Reports (Relatórios)

```javascript
import {
  fetchReports,              // GET /reports
  createReport,              // POST /reports
  updateReportMarketStart,   // PUT /reports/:id
  deleteReport               // DELETE /reports/:id
} from '../redux/slices/reportsSlice';
```

### Auth (Autenticação)

```javascript
import {
  login,          // GET /users?email=X + validação
  register,       // POST /users
  resetPassword   // PUT /users/:id (atualiza senha)
} from '../redux/slices/authSlice';

// Uso:
dispatch(login({ email: 'admin@ong.com', password: 'admin123' }));
dispatch(register({ name: 'Novo', email: 'novo@email.com', password: '123' }));
dispatch(resetPassword({ email: 'user@email.com', code: '123456', newPassword: 'nova' }));
```

---

## 🚀 Como Usar nos Componentes

### Padrão Completo

```javascript
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStudents, createStudent } from '../redux/slices/studentsSlice';

function MeuComponente() {
  const dispatch = useDispatch();
  const { students, loading, error } = useSelector(state => state.students);

  // Carregar dados ao montar
  useEffect(() => {
    dispatch(fetchStudents());
  }, [dispatch]);

  // Criar novo aluno
  const handleCreate = async () => {
    const newStudent = {
      name: 'Novo Aluno',
      age: 16,
      school: 'E.E. Exemplo',
      grade: '2º Ano',
      contact: '(11) 99999-9999'
    };
    
    await dispatch(createStudent(newStudent));
  };

  // Loading state
  if (loading && students.length === 0) {
    return <div>Carregando...</div>;
  }

  // Error state
  if (error) {
    return <div>Erro: {error}</div>;
  }

  return (
    <div>
      <button onClick={handleCreate}>Adicionar Aluno</button>
      {students.map(student => (
        <div key={student.id}>{student.name}</div>
      ))}
    </div>
  );
}
```

---

## ⚙️ Configuração Necessária

### 1. Iniciar json-server

```bash
# Terminal 1
npm run server
```

### 2. Iniciar Frontend

```bash
# Terminal 2
npm run dev
```

### 3. Verificar Integração

Abra o console do navegador e execute:

```javascript
// Deve retornar array de alunos
fetch('http://localhost:3001/students')
  .then(r => r.json())
  .then(console.log);
```

---

## 📊 Estado do Redux

### Estrutura Completa do State

```javascript
{
  auth: {
    user: { id, name, email, role },
    isAuthenticated: boolean,
    loading: boolean,
    error: string | null,
    token: string | null
  },
  
  students: {
    students: [...],
    loading: boolean,
    error: string | null,
    editing: object | null,
    confirming: id | null,
    toast: string
  },
  
  evaluations: {
    answers: {},
    page: number,
    selectedStudent: string,
    lastSaved: Date | null,
    statusMessage: string,
    loading: boolean,
    error: string | null,
    evaluations: [...]
  },
  
  forwarding: {
    records: [...],
    form: {...},
    loading: boolean,
    error: string | null,
    statusMessage: string
  },
  
  internalControl: {
    records: [...],
    form: {...},
    loading: boolean,
    error: string | null,
    statusMessage: string
  },
  
  notifications: {
    items: [...],
    loading: boolean,
    error: string | null
  },
  
  reports: {
    students: [...],
    searchQuery: string,
    status: string,
    confirming: id | null,
    loading: boolean,
    error: string | null
  }
}
```

---

## 🧪 Testando a Integração

### 1. Teste de Alunos

```javascript
// No console do navegador (com app rodando):

// 1. Verificar se os dados estão sendo carregados
window.store = require('./src/redux/store').default;
console.log(store.getState().students);

// 2. Criar novo aluno via Redux
store.dispatch({
  type: 'students/create/fulfilled',
  payload: { id: Date.now(), name: 'Teste', age: 16 }
});

// 3. Verificar se salvou no servidor
fetch('http://localhost:3001/students').then(r=>r.json()).then(console.log);
```

### 2. Teste de Login

```javascript
// Tentar login
import { login } from './src/redux/slices/authSlice';
store.dispatch(login({ 
  email: 'admin@ong.com', 
  password: 'admin123' 
}));

// Verificar se autenticou
console.log(store.getState().auth);
```

### 3. Teste de Avaliações

```javascript
import { submitEvaluation } from './src/redux/slices/evaluationsSlice';

store.dispatch(submitEvaluation({
  payload: { 0: 'sim', 1: 'nao', 2: 'maioria' },
  studentId: '1729876543210',
  studentName: 'Ana Clara Santos'
}));
```

---

## ⚠️ Pontos de Atenção

### 1. Servidor Deve Estar Rodando

❌ **Erro Comum:**
```
Failed to fetch http://localhost:3001/students
```

✅ **Solução:**
```bash
npm run server
```

### 2. CORS

Se tiver problemas de CORS, verifique se está usando:
- ✅ `http://localhost:3001` (correto)
- ❌ `http://127.0.0.1:3001` (pode dar erro)

### 3. IDs Únicos

Sempre use IDs únicos ao criar registros:

```javascript
// ✅ Correto
{ id: Date.now().toString(), ... }
{ id: uuidv4(), ... }

// ❌ Errado
{ id: '1', ... } // Pode conflitar
```

### 4. Backup Regular

Faça backup do db.json regularmente:

```bash
npm run db:backup
```

---

## 📝 Próximos Passos

### Tarefas Pendentes

1. ⬜ Atualizar demais componentes para usar thunks:
   - `AvaliacaoAlunos.jsx`
   - `Encaminhamento.jsx`
   - `ControleInterno.jsx`
   - `Relatorios.jsx`
   - `notificacoes.jsx`
   - `LoginPage.jsx`
   - `Registrar.jsx`
   - `RecuperarSenha.jsx`

2. ⬜ Adicionar indicadores de loading em todos os componentes

3. ⬜ Implementar tratamento de erro global

4. ⬜ Adicionar retry automático em caso de falha

5. ⬜ Implementar sincronização offline→online

---

## 📚 Recursos

- **Documentação:** [GUIA_DB_JSON.md](GUIA_DB_JSON.md)
- **Exemplos:** [EXEMPLO_INTEGRACAO_JSON_SERVER.md](EXEMPLO_INTEGRACAO_JSON_SERVER.md)
- **Referência Rápida:** [QUICK_REFERENCE.md](QUICK_REFERENCE.md)

---

**✅ Integração Base Completa!**

O sistema está pronto para usar. Todos os dados salvos agora são sincronizados entre:
- json-server (http://localhost:3001)
- localStorage (backup)
- Redux state (estado da aplicação)

Continue atualizando os demais componentes seguindo o padrão do `Alunos.jsx`!

