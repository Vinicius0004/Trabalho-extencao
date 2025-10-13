import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

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

// Save state to localStorage
const saveState = (records) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch (err) {
    console.warn('Failed to save forwarding:', err);
  }
};

// Async thunk for submitting forwarding form
export const submitForwarding = createAsyncThunk(
  'forwarding/submit',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/encaminhamento', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Failed to submit');
      return await response.json();
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
      saveState(state.records);
    },
    removeRecord: (state, action) => {
      state.records = state.records.filter(r => r.id !== action.payload);
      saveState(state.records);
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
      .addCase(submitForwarding.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitForwarding.fulfilled, (state, action) => {
        state.loading = false;
        state.records = [action.payload, ...state.records];
        saveState(state.records);
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

