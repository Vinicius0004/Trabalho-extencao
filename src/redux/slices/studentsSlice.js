import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../utils/api';

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

// Async thunks
export const fetchStudents = createAsyncThunk(
  'students/fetch',
  async (_, { rejectWithValue }) => {
    try {
      return await api.get('/students', STORAGE_KEY);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createStudent = createAsyncThunk(
  'students/create',
  async (studentData, { rejectWithValue }) => {
    try {
      const newStudent = {
        ...studentData,
        id: studentData.id || Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      return await api.post('/students', newStudent, STORAGE_KEY);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateStudent = createAsyncThunk(
  'students/update',
  async (studentData, { rejectWithValue }) => {
    try {
      return await api.put(`/students/${studentData.id}`, studentData, STORAGE_KEY);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteStudent = createAsyncThunk(
  'students/delete',
  async (studentId, { rejectWithValue }) => {
    try {
      return await api.delete(`/students/${studentId}`, studentId, STORAGE_KEY);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  students: loadState(),
  loading: false,
  error: null,
  editing: null,
  confirming: null,
  toast: '',
};

const studentsSlice = createSlice({
  name: 'students',
  initialState,
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
    // Manter compatibilidade com código existente
    addStudent: (state, action) => {
      state.students = [action.payload, ...state.students];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.students));
    },
    removeStudent: (state, action) => {
      state.students = state.students.filter(s => s.id !== action.payload);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.students));
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
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.students));
      state.editing = null;
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
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // Manter dados locais em caso de erro
        state.students = loadState();
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
      })
      .addCase(createStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.toast = 'Erro ao cadastrar aluno';
      })
      // Update
      .addCase(updateStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStudent.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.students.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.students[index] = action.payload;
        }
        state.toast = 'Aluno atualizado com sucesso!';
        state.editing = null;
      })
      .addCase(updateStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.toast = 'Erro ao atualizar aluno';
      })
      // Delete
      .addCase(deleteStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteStudent.fulfilled, (state, action) => {
        state.loading = false;
        state.students = state.students.filter(s => s.id !== action.payload);
        state.toast = 'Aluno removido com sucesso!';
        state.confirming = null;
      })
      .addCase(deleteStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.toast = 'Erro ao remover aluno';
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
  addStudent,
  removeStudent,
  saveStudent,
} = studentsSlice.actions;

export default studentsSlice.reducer;
