import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../utils/api';

const DRAFT_KEY = 'avaliacao-draft-v1';
const STORAGE_KEY = 'avaliacoes-v1';

// Load draft from localStorage
const loadDraft = () => {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        answers: parsed.answers || {},
        page: parsed.page || 0,
        selectedStudent: parsed.selectedStudent || '',
        lastSaved: parsed.updatedAt ? new Date(parsed.updatedAt) : null,
      };
    }
  } catch (err) {
    console.warn('Failed to load evaluation draft:', err);
  }
  return {
    answers: {},
    page: 0,
    selectedStudent: '',
    lastSaved: null,
  };
};

// Save draft to localStorage
const saveDraft = (state) => {
  try {
    const payload = {
      answers: state.answers,
      page: state.page,
      selectedStudent: state.selectedStudent,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(payload));
  } catch (err) {
    console.warn('Failed to save evaluation draft:', err);
  }
};

// Async thunk for submitting evaluation
export const submitEvaluation = createAsyncThunk(
  'evaluations/submit',
  async ({ payload, studentId, studentName }, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const userId = state.auth?.user?.id || 1;
      
      const evaluationData = {
        studentId,
        studentName,
        answers: payload,
        submittedAt: new Date().toISOString(),
        evaluatedBy: userId,
      };
      
      return await api.post('/evaluations', evaluationData, STORAGE_KEY);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch all evaluations
export const fetchEvaluations = createAsyncThunk(
  'evaluations/fetch',
  async (_, { rejectWithValue }) => {
    try {
      return await api.get('/evaluations', STORAGE_KEY);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch evaluations by student
export const fetchEvaluationsByStudent = createAsyncThunk(
  'evaluations/fetchByStudent',
  async (studentId, { rejectWithValue }) => {
    try {
      return await api.get(`/evaluations?studentId=${studentId}`, STORAGE_KEY);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const draft = loadDraft();

const initialState = {
  answers: draft.answers,
  page: draft.page,
  selectedStudent: draft.selectedStudent,
  lastSaved: draft.lastSaved,
  statusMessage: '',
  loading: false,
  error: null,
  evaluations: [],
};

const evaluationsSlice = createSlice({
  name: 'evaluations',
  initialState,
  reducers: {
    setAnswer: (state, action) => {
      const { index, value } = action.payload;
      state.answers[index] = value;
      saveDraft(state);
      state.lastSaved = new Date();
    },
    setPage: (state, action) => {
      state.page = action.payload;
      saveDraft(state);
    },
    setSelectedStudent: (state, action) => {
      state.selectedStudent = action.payload;
      saveDraft(state);
    },
    saveDraftNow: (state) => {
      saveDraft(state);
      state.lastSaved = new Date();
      state.statusMessage = 'Rascunho salvo';
    },
    clearDraft: (state) => {
      state.answers = {};
      state.page = 0;
      state.selectedStudent = '';
      state.lastSaved = null;
      localStorage.removeItem(DRAFT_KEY);
      state.statusMessage = 'Rascunho removido';
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
      // Submit evaluation
      .addCase(submitEvaluation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitEvaluation.fulfilled, (state, action) => {
        state.loading = false;
        state.answers = {};
        state.page = 0;
        state.selectedStudent = '';
        state.lastSaved = null;
        state.evaluations = [action.payload, ...state.evaluations];
        localStorage.removeItem(DRAFT_KEY);
        state.statusMessage = 'Avaliação enviada com sucesso!';
      })
      .addCase(submitEvaluation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        saveDraft(state);
        state.statusMessage = 'Falha ao enviar. As respostas foram salvas localmente.';
      })
      // Fetch evaluations
      .addCase(fetchEvaluations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvaluations.fulfilled, (state, action) => {
        state.loading = false;
        state.evaluations = action.payload;
      })
      .addCase(fetchEvaluations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch by student
      .addCase(fetchEvaluationsByStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvaluationsByStudent.fulfilled, (state, action) => {
        state.loading = false;
        state.evaluations = action.payload;
      })
      .addCase(fetchEvaluationsByStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setAnswer,
  setPage,
  setSelectedStudent,
  saveDraftNow,
  clearDraft,
  setStatusMessage,
  clearStatusMessage,
} = evaluationsSlice.actions;

export default evaluationsSlice.reducer;
