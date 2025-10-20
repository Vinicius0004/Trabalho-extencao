import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../utils/api';

const STORAGE_KEY = 'controle-interno-v1';

// Load initial state from localStorage
const loadState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
    return [];
  } catch (err) {
    console.warn('Failed to load internal control:', err);
    return [];
  }
};

// Async thunks
export const fetchInternalControl = createAsyncThunk(
  'internalControl/fetch',
  async (_, { rejectWithValue }) => {
    try {
      return await api.get('/internalControl', STORAGE_KEY);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const submitInternalControl = createAsyncThunk(
  'internalControl/submit',
  async (formData, { rejectWithValue }) => {
    try {
      const newRecord = {
        ...formData,
        id: Date.now(),
        createdAt: new Date().toISOString(),
      };
      return await api.post('/internalControl', newRecord, STORAGE_KEY);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateInternalControl = createAsyncThunk(
  'internalControl/update',
  async (formData, { rejectWithValue }) => {
    try {
      return await api.put(`/internalControl/${formData.id}`, formData, STORAGE_KEY);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteInternalControl = createAsyncThunk(
  'internalControl/delete',
  async (id, { rejectWithValue }) => {
    try {
      return await api.delete(`/internalControl/${id}`, id, STORAGE_KEY);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  records: loadState(),
  form: {
    aluno: '',
    ingresso: '',
    primeiraAvaliacao: '',
    segundaAvaliacao: '',
    primeiraEntrevista: '',
    segundaEntrevista: '',
    resultado: '',
  },
  loading: false,
  error: null,
  statusMessage: '',
};

const internalControlSlice = createSlice({
  name: 'internalControl',
  initialState,
  reducers: {
    setFormField: (state, action) => {
      const { field, value } = action.payload;
      state.form[field] = value;
    },
    resetForm: (state) => {
      state.form = {
        aluno: '',
        ingresso: '',
        primeiraAvaliacao: '',
        segundaAvaliacao: '',
        primeiraEntrevista: '',
        segundaEntrevista: '',
        resultado: '',
      };
    },
    addRecord: (state, action) => {
      state.records = [action.payload, ...state.records];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.records));
    },
    removeRecord: (state, action) => {
      state.records = state.records.filter(r => r.id !== action.payload);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.records));
    },
    setStatusMessage: (state, action) => {
      state.statusMessage = action.payload;
    },
    clearStatusMessage: (state) => {
      state.statusMessage = '';
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchInternalControl.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInternalControl.fulfilled, (state, action) => {
        state.loading = false;
        state.records = action.payload;
      })
      .addCase(fetchInternalControl.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.records = loadState();
      })
      // Submit
      .addCase(submitInternalControl.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitInternalControl.fulfilled, (state, action) => {
        state.loading = false;
        state.records = [action.payload, ...state.records];
        state.form = {
          aluno: '',
          ingresso: '',
          primeiraAvaliacao: '',
          segundaAvaliacao: '',
          primeiraEntrevista: '',
          segundaEntrevista: '',
          resultado: '',
        };
        state.statusMessage = 'Formulário enviado com sucesso!';
      })
      .addCase(submitInternalControl.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.statusMessage = 'Erro ao enviar formulário';
      })
      // Update
      .addCase(updateInternalControl.fulfilled, (state, action) => {
        const index = state.records.findIndex(r => r.id === action.payload.id);
        if (index !== -1) {
          state.records[index] = action.payload;
        }
        state.statusMessage = 'Registro atualizado com sucesso!';
      })
      // Delete
      .addCase(deleteInternalControl.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteInternalControl.fulfilled, (state, action) => {
        state.loading = false;
        state.records = state.records.filter(r => r.id !== action.payload);
        state.statusMessage = 'Registro removido com sucesso!';
      })
      .addCase(deleteInternalControl.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.statusMessage = 'Erro ao remover registro';
      });
  },
});

export const {
  setFormField,
  resetForm,
  addRecord,
  removeRecord,
  setStatusMessage,
  clearStatusMessage,
} = internalControlSlice.actions;

export default internalControlSlice.reducer;
