import { createSlice } from '@reduxjs/toolkit';

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

// Save state to localStorage
const saveState = (students) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
  } catch (err) {
    console.warn('Failed to save reports:', err);
  }
};

const initialState = {
  students: loadState(),
  searchQuery: '',
  status: '',
  confirming: null,
};

const reportsSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    setStudents: (state, action) => {
      state.students = action.payload;
      saveState(state.students);
    },
    addStudent: (state, action) => {
      state.students = [action.payload, ...state.students];
      saveState(state.students);
    },
    updateMarketStart: (state, action) => {
      const { id, date } = action.payload;
      const student = state.students.find(s => s.id === id);
      if (student) {
        student.marketStart = date;
        saveState(state.students);
        state.status = 'Alteração salva.';
      }
    },
    removeStudent: (state, action) => {
      state.students = state.students.filter(s => s.id !== action.payload);
      saveState(state.students);
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

