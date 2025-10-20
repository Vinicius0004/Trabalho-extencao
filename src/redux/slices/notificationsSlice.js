import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../utils/api';

const STORAGE_KEY = 'notificacoes-v1';

// Load initial state from localStorage
const loadState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
    return [];
  } catch (err) {
    console.warn('Failed to load notifications:', err);
    return [];
  }
};

const formatDate = (d) => {
  try {
    const date = d ? new Date(d) : new Date();
    return date.toISOString().slice(0, 10);
  } catch {
    return new Date().toISOString().slice(0, 10);
  }
};

// Async thunks
export const fetchNotifications = createAsyncThunk(
  'notifications/fetch',
  async (_, { rejectWithValue }) => {
    try {
      return await api.get('/notifications', STORAGE_KEY);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createNotification = createAsyncThunk(
  'notifications/create',
  async ({ title, when }, { rejectWithValue }) => {
    try {
      const newNotification = {
        id: Date.now(),
        title,
        when: formatDate(when),
        read: false,
        createdAt: new Date().toISOString(),
      };
      return await api.post('/notifications', newNotification, STORAGE_KEY);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const toggleNotificationRead = createAsyncThunk(
  'notifications/toggle',
  async (id, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const notification = state.notifications.items.find(i => i.id === id);
      if (!notification) throw new Error('Notification not found');
      
      const updated = { ...notification, read: !notification.read };
      return await api.patch(`/notifications/${id}`, updated, STORAGE_KEY);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteNotification = createAsyncThunk(
  'notifications/delete',
  async (id, { rejectWithValue }) => {
    try {
      return await api.delete(`/notifications/${id}`, id, STORAGE_KEY);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const markAllAsReadAsync = createAsyncThunk(
  'notifications/markAllRead',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const notifications = state.notifications.items;
      
      // Atualizar todas as notificações não lidas
      const updatePromises = notifications
        .filter(n => !n.read)
        .map(n => 
          api.patch(`/notifications/${n.id}`, { ...n, read: true }, STORAGE_KEY)
        );
      
      await Promise.all(updatePromises);
      return notifications.map(n => ({ ...n, read: true }));
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  items: loadState(),
  loading: false,
  error: null,
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setNotifications: (state, action) => {
      state.items = action.payload;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(action.payload));
    },
    addNotification: (state, action) => {
      const when = formatDate(action.payload.when);
      const newItem = {
        id: Date.now(),
        title: action.payload.title,
        when,
        read: false,
      };
      state.items = [newItem, ...state.items];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    },
    toggleNotification: (state, action) => {
      const item = state.items.find(i => i.id === action.payload);
      if (item) {
        item.read = !item.read;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
      }
    },
    removeNotification: (state, action) => {
      state.items = state.items.filter(i => i.id !== action.payload);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    },
    markAllAsRead: (state) => {
      state.items = state.items.map(i => ({ ...i, read: true }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    },
    clearAllNotifications: (state) => {
      state.items = [];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.items = loadState();
      })
      // Create
      .addCase(createNotification.fulfilled, (state, action) => {
        state.items = [action.payload, ...state.items];
      })
      // Toggle
      .addCase(toggleNotificationRead.fulfilled, (state, action) => {
        const index = state.items.findIndex(i => i.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      // Delete
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.items = state.items.filter(i => i.id !== action.payload);
      })
      // Mark all as read
      .addCase(markAllAsReadAsync.fulfilled, (state, action) => {
        state.items = action.payload;
      });
  },
});

export const {
  setNotifications,
  addNotification,
  toggleNotification,
  removeNotification,
  markAllAsRead,
  clearAllNotifications,
} = notificationsSlice.actions;

export default notificationsSlice.reducer;
