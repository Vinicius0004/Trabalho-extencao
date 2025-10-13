import { createSlice } from '@reduxjs/toolkit';

const STORAGE_KEY = 'alunos-cadastrados-v1';

// Load initial state from localStorage
const loadState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
    return [];
  } catch (err) {
    console.warn('Failed to load students:', err);
    return [];
  }
};

// Save state to localStorage
const saveState = (students) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
  } catch (err) {
    console.warn('Failed to save students:', err);
  }
};

const initialState = {
  students: loadState(),
  editing: null,
  confirming: null,
  toast: '',
};

const studentsSlice = createSlice({
  name: 'students',
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
    updateStudent: (state, action) => {
      const index = state.students.findIndex(s => s.id === action.payload.id);
      if (index !== -1) {
        state.students[index] = action.payload;
        saveState(state.students);
      }
    },
    removeStudent: (state, action) => {
      state.students = state.students.filter(s => s.id !== action.payload);
      saveState(state.students);
    },
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
    saveStudent: (state, action) => {
      const student = action.payload;
      if (!student.name || student.name.trim() === '') {
        state.toast = 'Nome é obrigatório';
        return;
      }

      const exists = state.students.some(s => s.id === student.id);
      if (exists) {
        const index = state.students.findIndex(s => s.id === student.id);
        state.students[index] = student;
        state.toast = 'Aluno atualizado com sucesso!';
      } else {
        state.students = [student, ...state.students];
        state.toast = 'Aluno cadastrado com sucesso!';
      }
      
      saveState(state.students);
      state.editing = null;
    },
  },
});

export const {
  setStudents,
  addStudent,
  updateStudent,
  removeStudent,
  setEditing,
  clearEditing,
  setConfirming,
  clearConfirming,
  setToast,
  clearToast,
  saveStudent,
} = studentsSlice.actions;

export default studentsSlice.reducer;

