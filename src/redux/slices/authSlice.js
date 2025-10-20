import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../utils/api';

const STORAGE_KEY = 'auth-state-v1';

// Load initial state from localStorage
const loadState = () => {
  try {
    const serializedState = localStorage.getItem(STORAGE_KEY);
    if (serializedState === null) {
      return {
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
        token: null,
      };
    }
    return JSON.parse(serializedState);
  } catch {
    return {
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,
      token: null,
    };
  }
};

// Save state to localStorage
const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, serializedState);
  } catch (err) {
    console.warn('Failed to save auth state:', err);
  }
};

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      // Buscar usuário por email
      const response = await fetch(`http://localhost:3001/users?email=${email}`);
      
      if (!response.ok) {
        // Fallback para localStorage
        const localUsers = JSON.parse(localStorage.getItem('users-v1') || '[]');
        const user = localUsers.find(u => u.email === email && u.password === password);
        
        if (!user) {
          throw new Error('Email ou senha inválidos');
        }
        
        return {
          user: { 
            id: user.id, 
            name: user.name, 
            email: user.email, 
            role: user.role || 'user' 
          },
          token: `fake-jwt-${user.id}-${Date.now()}`,
        };
      }
      
      const users = await response.json();
      const user = users.find(u => u.password === password);
      
      if (!user) {
        throw new Error('Email ou senha inválidos');
      }
      
      return {
        user: { 
          id: user.id, 
          name: user.name, 
          email: user.email, 
          role: user.role || 'user' 
        },
        token: `fake-jwt-${user.id}-${Date.now()}`,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async ({ email, name, password }, { rejectWithValue }) => {
    try {
      // Verificar se usuário já existe
      const checkResponse = await fetch(`http://localhost:3001/users?email=${email}`);
      
      if (checkResponse.ok) {
        const existingUsers = await checkResponse.json();
        if (existingUsers.length > 0) {
          throw new Error('Email já cadastrado');
        }
      }
      
      // Criar novo usuário
      const newUser = {
        id: Date.now(),
        name,
        email,
        password,
        role: 'user',
        createdAt: new Date().toISOString(),
      };
      
      const response = await fetch('http://localhost:3001/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });
      
      if (!response.ok) {
        // Fallback para localStorage
        const localUsers = JSON.parse(localStorage.getItem('users-v1') || '[]');
        localUsers.push(newUser);
        localStorage.setItem('users-v1', JSON.stringify(localUsers));
        
        return {
          user: { 
            id: newUser.id, 
            name: newUser.name, 
            email: newUser.email, 
            role: newUser.role 
          },
          token: `fake-jwt-${newUser.id}-${Date.now()}`,
        };
      }
      
      const createdUser = await response.json();
      
      return {
        user: { 
          id: createdUser.id, 
          name: createdUser.name, 
          email: createdUser.email, 
          role: createdUser.role 
        },
        token: `fake-jwt-${createdUser.id}-${Date.now()}`,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ email, code, newPassword }, { rejectWithValue }) => {
    try {
      // Buscar usuário por email
      const response = await fetch(`http://localhost:3001/users?email=${email}`);
      
      if (!response.ok) {
        throw new Error('Usuário não encontrado');
      }
      
      const users = await response.json();
      const user = users[0];
      
      if (!user) {
        throw new Error('Usuário não encontrado');
      }
      
      // Validar código (simplificado - em produção seria mais complexo)
      if (code !== '123456') {
        throw new Error('Código de verificação inválido');
      }
      
      // Atualizar senha
      const updatedUser = { ...user, password: newPassword };
      const updateResponse = await fetch(`http://localhost:3001/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser),
      });
      
      if (!updateResponse.ok) {
        throw new Error('Erro ao atualizar senha');
      }
      
      return { success: true };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = loadState();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.token = null;
      state.error = null;
      saveState(state);
    },
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      saveState(state);
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        saveState(state);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        saveState(state);
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearError, setUser } = authSlice.actions;
export default authSlice.reducer;
