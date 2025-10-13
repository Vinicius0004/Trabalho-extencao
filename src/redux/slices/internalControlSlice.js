import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

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

// Save state to localStorage
const saveState = (records) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch (err) {
    console.warn('Failed to save internal control:', err);
  }
};

// Async thunk for submitting internal control form
export const submitInternalControl = createAsyncThunk(
  'internalControl/submit',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/controle-interno', {
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
      .addCase(submitInternalControl.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitInternalControl.fulfilled, (state, action) => {
        state.loading = false;
        state.records = [action.payload, ...state.records];
        saveState(state.records);
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

