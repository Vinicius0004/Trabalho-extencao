import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../utils/api';

const STORAGE_KEY = 'relatorios-v1';

// Load initial state from localStorage
const loadState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
    
    // Default mock data
    return [
      { 
        id: 1, 
        name: 'Ana Silva', 
        evaluations: 3, 
        marketStart: '2019-06-01', 
        lastEvaluation: '2024-08-01', 
        lastAnswers: {0:'sim',1:'sim',2:'nao',3:'maioria',4:'sim',5:'nao'} 
      },
      { 
        id: 2, 
        name: 'Bruno Costa', 
        evaluations: 1, 
        marketStart: '2021-11-15', 
        lastEvaluation: '2023-12-12', 
        lastAnswers: {0:'nao',1:'nao',2:'nao',3:'raras',4:'nao'} 
      },
      { 
        id: 3, 
        name: 'Carla Sousa', 
        evaluations: 2, 
        marketStart: '2018-02-20', 
        lastEvaluation: '2024-01-05', 
        lastAnswers: {0:'sim',1:'maioria',2:'sim',3:'sim',4:'maioria'} 
      },
    ];
  } catch (err) {
    console.warn('Failed to load reports:', err);
    return [];
  }
};

// Async thunks
export const fetchReports = createAsyncThunk(
  'reports/fetch',
  async (_, { rejectWithValue }) => {
    try {
      return await api.get('/reports', STORAGE_KEY);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createReport = createAsyncThunk(
  'reports/create',
  async (reportData, { rejectWithValue }) => {
    try {
      const newReport = {
        ...reportData,
        id: Date.now(),
        evaluations: reportData.evaluations || 0,
        marketStart: reportData.marketStart || '',
        lastEvaluation: reportData.lastEvaluation || '',
        lastAnswers: reportData.lastAnswers || {},
      };
      return await api.post('/reports', newReport, STORAGE_KEY);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateReportMarketStart = createAsyncThunk(
  'reports/updateMarketStart',
  async ({ id, date }, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const report = state.reports.students.find(s => s.id === id);
      if (!report) throw new Error('Report not found');
      
      const updated = { ...report, marketStart: date };
      return await api.put(`/reports/${id}`, updated, STORAGE_KEY);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteReport = createAsyncThunk(
  'reports/delete',
  async (id, { rejectWithValue }) => {
    try {
      return await api.delete(`/reports/${id}`, id, STORAGE_KEY);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  students: loadState(),
  searchQuery: '',
  status: '',
  confirming: null,
  loading: false,
  error: null,
};

const reportsSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    setStudents: (state, action) => {
      state.students = action.payload;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(action.payload));
    },
    addStudent: (state, action) => {
      state.students = [action.payload, ...state.students];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.students));
    },
    updateMarketStart: (state, action) => {
      const { id, date } = action.payload;
      const student = state.students.find(s => s.id === id);
      if (student) {
        student.marketStart = date;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.students));
        state.status = 'Alteração salva.';
      }
    },
    removeStudent: (state, action) => {
      state.students = state.students.filter(s => s.id !== action.payload);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.students));
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    clearStatus: (state) => {
      state.status = '';
    },
    setConfirming: (state, action) => {
      state.confirming = action.payload;
    },
    clearConfirming: (state) => {
      state.confirming = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReports.fulfilled, (state, action) => {
        state.loading = false;
        state.students = action.payload;
      })
      .addCase(fetchReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.students = loadState();
      })
      // Create
      .addCase(createReport.fulfilled, (state, action) => {
        state.students = [action.payload, ...state.students];
        state.status = 'Relatório criado com sucesso!';
      })
      // Update market start
      .addCase(updateReportMarketStart.fulfilled, (state, action) => {
        const index = state.students.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.students[index] = action.payload;
        }
        state.status = 'Alteração salva.';
      })
      // Delete
      .addCase(deleteReport.fulfilled, (state, action) => {
        state.students = state.students.filter(s => s.id !== action.payload);
        state.status = 'Relatório removido.';
        state.confirming = null;
      });
  },
});

export const {
  setStudents,
  addStudent,
  updateMarketStart,
  removeStudent,
  setSearchQuery,
  setStatus,
  clearStatus,
  setConfirming,
  clearConfirming,
} = reportsSlice.actions;

export default reportsSlice.reducer;
