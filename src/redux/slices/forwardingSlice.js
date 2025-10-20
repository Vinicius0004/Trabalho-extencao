import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../utils/api';

const STORAGE_KEY = 'encaminhamento-v1';

// Load initial state from localStorage
const loadState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
    return [];
  } catch (err) {
    console.warn('Failed to load forwarding:', err);
    return [];
  }
};

// Async thunks
export const fetchForwarding = createAsyncThunk(
  'forwarding/fetch',
  async (_, { rejectWithValue }) => {
    try {
      return await api.get('/forwarding', STORAGE_KEY);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const submitForwarding = createAsyncThunk(
  'forwarding/submit',
  async (formData, { rejectWithValue }) => {
    try {
      const newRecord = {
        ...formData,
        id: Date.now(),
        createdAt: new Date().toISOString(),
      };
      return await api.post('/forwarding', newRecord, STORAGE_KEY);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateForwarding = createAsyncThunk(
  'forwarding/update',
  async (formData, { rejectWithValue }) => {
    try {
      return await api.put(`/forwarding/${formData.id}`, formData, STORAGE_KEY);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteForwarding = createAsyncThunk(
  'forwarding/delete',
  async (id, { rejectWithValue }) => {
    try {
      return await api.delete(`/forwarding/${id}`, id, STORAGE_KEY);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  records: loadState(),
  form: {
    aluno: '',
    dataAdmissao: '',
    empresa: '',
    funcao: '',
    contatoRH: '',
    dataDesligamento: '',
  },
  loading: false,
  error: null,
  statusMessage: '',
};

const forwardingSlice = createSlice({
  name: 'forwarding',
  initialState,
  reducers: {
    setFormField: (state, action) => {
      const { field, value } = action.payload;
      state.form[field] = value;
    },
    resetForm: (state) => {
      state.form = {
        aluno: '',
        dataAdmissao: '',
        empresa: '',
        funcao: '',
        contatoRH: '',
        dataDesligamento: '',
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
      .addCase(fetchForwarding.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchForwarding.fulfilled, (state, action) => {
        state.loading = false;
        state.records = action.payload;
      })
      .addCase(fetchForwarding.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.records = loadState();
      })
      // Submit
      .addCase(submitForwarding.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitForwarding.fulfilled, (state, action) => {
        state.loading = false;
        state.records = [action.payload, ...state.records];
        state.form = {
          aluno: '',
          dataAdmissao: '',
          empresa: '',
          funcao: '',
          contatoRH: '',
          dataDesligamento: '',
        };
        state.statusMessage = 'Formulário enviado com sucesso!';
      })
      .addCase(submitForwarding.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.statusMessage = 'Erro ao enviar formulário';
      })
      // Update
      .addCase(updateForwarding.fulfilled, (state, action) => {
        const index = state.records.findIndex(r => r.id === action.payload.id);
        if (index !== -1) {
          state.records[index] = action.payload;
        }
        state.statusMessage = 'Registro atualizado com sucesso!';
      })
      // Delete
      .addCase(deleteForwarding.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteForwarding.fulfilled, (state, action) => {
        state.loading = false;
        state.records = state.records.filter(r => r.id !== action.payload);
        state.statusMessage = 'Registro removido com sucesso!';
      })
      .addCase(deleteForwarding.rejected, (state, action) => {
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
} = forwardingSlice.actions;

export default forwardingSlice.reducer;
