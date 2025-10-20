# Exemplo de Integração com JSON Server

Este documento mostra como adaptar seus Redux slices existentes para usar o `json-server` em vez de `localStorage`.

## 🔄 Antes e Depois

### Exemplo 1: authSlice.js - Login

#### ❌ Antes (API Real)
```javascript
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) throw new Error('Login failed');
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
```

#### ✅ Depois (JSON Server)
```javascript
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      // Buscar todos os usuários com o email fornecido
      const response = await fetch(`http://localhost:3001/users?email=${email}`);
      if (!response.ok) throw new Error('Erro ao buscar usuário');
      
      const users = await response.json();
      const user = users.find(u => u.password === password);
      
      if (!user) {
        throw new Error('Email ou senha inválidos');
      }
      
      // Retornar dados do usuário e token simulado
      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        token: `fake-jwt-${user.id}-${Date.now()}`
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
```

### Exemplo 2: studentsSlice.js - CRUD Completo

#### ❌ Antes (LocalStorage)
```javascript
// Apenas localStorage
const studentsSlice = createSlice({
  name: 'students',
  initialState: { students: loadState() },
  reducers: {
    addStudent: (state, action) => {
      state.students = [action.payload, ...state.students];
      saveState(state.students);
    }
  }
});
```

#### ✅ Depois (JSON Server com Fallback para LocalStorage)
```javascript
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const STORAGE_KEY = 'alunos-cadastrados-v1';
const API_URL = 'http://localhost:3001/students';

// Async thunks
export const fetchStudents = createAsyncThunk(
  'students/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Erro ao buscar alunos');
      return await response.json();
    } catch (error) {
      // Fallback: carregar do localStorage
      const localData = localStorage.getItem(STORAGE_KEY);
      if (localData) return JSON.parse(localData);
      return rejectWithValue(error.message);
    }
  }
);

export const createStudent = createAsyncThunk(
  'students/create',
  async (studentData, { rejectWithValue }) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...studentData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString()
        }),
      });
      if (!response.ok) throw new Error('Erro ao criar aluno');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateStudent = createAsyncThunk(
  'students/update',
  async (studentData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/${studentData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentData),
      });
      if (!response.ok) throw new Error('Erro ao atualizar aluno');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteStudent = createAsyncThunk(
  'students/delete',
  async (studentId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/${studentId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Erro ao deletar aluno');
      return studentId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const studentsSlice = createSlice({
  name: 'students',
  initialState: {
    students: [],
    loading: false,
    error: null,
    editing: null,
    confirming: null,
    toast: '',
  },
  reducers: {
    setEditing: (state, action) => {
      state.editing = action.payload;
    },
    clearEditing: (state) => {
      state.editing = null;
    },
    setConfirming: (state, action) => {
      state.confirming = action.payload;
    },
    clearConfirming: (state) => {
      state.confirming = null;
    },
    setToast: (state, action) => {
      state.toast = action.payload;
    },
    clearToast: (state) => {
      state.toast = '';
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.students = action.payload;
        // Salvar também no localStorage como backup
        localStorage.setItem(STORAGE_KEY, JSON.stringify(action.payload));
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create
      .addCase(createStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createStudent.fulfilled, (state, action) => {
        state.loading = false;
        state.students = [action.payload, ...state.students];
        state.toast = 'Aluno cadastrado com sucesso!';
        state.editing = null;
        // Salvar no localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.students));
      })
      .addCase(createStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.toast = 'Erro ao cadastrar aluno';
      })
      // Update
      .addCase(updateStudent.fulfilled, (state, action) => {
        const index = state.students.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.students[index] = action.payload;
        }
        state.toast = 'Aluno atualizado com sucesso!';
        state.editing = null;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.students));
      })
      // Delete
      .addCase(deleteStudent.fulfilled, (state, action) => {
        state.students = state.students.filter(s => s.id !== action.payload);
        state.toast = 'Aluno removido com sucesso!';
        state.confirming = null;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.students));
      });
  },
});

export const {
  setEditing,
  clearEditing,
  setConfirming,
  clearConfirming,
  setToast,
  clearToast,
} = studentsSlice.actions;

export default studentsSlice.reducer;
```

### Exemplo 3: Uso no Componente React

#### ❌ Antes
```javascript
import { useDispatch, useSelector } from 'react-redux';
import { addStudent, removeStudent } from '../redux/slices/studentsSlice';

function Alunos() {
  const dispatch = useDispatch();
  const students = useSelector(state => state.students.students);

  const handleAdd = (studentData) => {
    const newStudent = {
      id: Date.now().toString(),
      ...studentData,
    };
    dispatch(addStudent(newStudent));
  };

  const handleRemove = (id) => {
    dispatch(removeStudent(id));
  };

  return (
    // JSX
  );
}
```

#### ✅ Depois
```javascript
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchStudents, 
  createStudent, 
  deleteStudent 
} from '../redux/slices/studentsSlice';

function Alunos() {
  const dispatch = useDispatch();
  const { students, loading, error } = useSelector(state => state.students);

  // Carregar alunos ao montar o componente
  useEffect(() => {
    dispatch(fetchStudents());
  }, [dispatch]);

  const handleAdd = async (studentData) => {
    await dispatch(createStudent(studentData));
  };

  const handleRemove = async (id) => {
    await dispatch(deleteStudent(id));
  };

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    // JSX
  );
}
```

## 🎯 Estratégia de Migração Progressiva

### Opção 1: Híbrida (Recomendada para Transição)
Mantenha tanto localStorage quanto json-server funcionando:

```javascript
const API_URL = 'http://localhost:3001/students';
const USE_JSON_SERVER = true; // Flag para alternar

export const saveStudent = async (studentData) => {
  if (USE_JSON_SERVER) {
    // Usar json-server
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(studentData),
    });
    return await response.json();
  } else {
    // Usar localStorage
    const students = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    students.push(studentData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
    return studentData;
  }
};
```

### Opção 2: Try-Catch com Fallback
Tente json-server primeiro, fallback para localStorage:

```javascript
export const fetchStudents = createAsyncThunk(
  'students/fetch',
  async () => {
    try {
      // Tentar buscar do json-server
      const response = await fetch('http://localhost:3001/students');
      if (response.ok) {
        const data = await response.json();
        // Salvar no localStorage como backup
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        return data;
      }
      throw new Error('Server unavailable');
    } catch {
      // Fallback para localStorage
      console.warn('Using localStorage fallback');
      const localData = localStorage.getItem(STORAGE_KEY);
      return localData ? JSON.parse(localData) : [];
    }
  }
);
```

## 🔧 Configuração de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_URL=http://localhost:3001
VITE_USE_JSON_SERVER=true
```

E use no código:

```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const USE_JSON_SERVER = import.meta.env.VITE_USE_JSON_SERVER === 'true';
```

## 📚 Recursos Úteis

### Helper para Requisições
```javascript
// src/utils/api.js
const API_BASE = 'http://localhost:3001';

export const api = {
  get: async (endpoint) => {
    const response = await fetch(`${API_BASE}${endpoint}`);
    if (!response.ok) throw new Error(`GET ${endpoint} failed`);
    return response.json();
  },

  post: async (endpoint, data) => {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`POST ${endpoint} failed`);
    return response.json();
  },

  put: async (endpoint, data) => {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`PUT ${endpoint} failed`);
    return response.json();
  },

  delete: async (endpoint) => {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error(`DELETE ${endpoint} failed`);
    return response.json();
  },
};

// Uso:
import { api } from './utils/api';

export const fetchStudents = createAsyncThunk(
  'students/fetch',
  async () => await api.get('/students')
);

export const createStudent = createAsyncThunk(
  'students/create',
  async (data) => await api.post('/students', data)
);
```

## ⚠️ Pontos de Atenção

1. **IDs:** json-server gera IDs automáticos se você não fornecer
2. **CORS:** Já está habilitado por padrão no json-server
3. **Sincronização:** As alterações no db.json são imediatas
4. **Validação:** json-server não valida dados, você deve fazer isso no frontend
5. **Autenticação:** json-server não tem autenticação real, apenas simulação

## 🚀 Próximos Passos

1. ✅ Criar `db.json` com estrutura completa
2. ✅ Instalar e configurar json-server
3. ⬜ Atualizar Redux slices para usar json-server
4. ⬜ Testar todas as operações CRUD
5. ⬜ Implementar tratamento de erros robusto
6. ⬜ Adicionar loading states em todos os componentes

