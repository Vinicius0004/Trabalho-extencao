import { createSlice } from '@reduxjs/toolkit';

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

// Save state to localStorage
const saveState = (items) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    // Dispatch storage event for cross-tab sync
    window.dispatchEvent(new StorageEvent('storage', {
      key: STORAGE_KEY,
      newValue: JSON.stringify(items),
    }));
  } catch (err) {
    console.warn('Failed to save notifications:', err);
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

const initialState = {
  items: loadState(),
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setNotifications: (state, action) => {
      state.items = action.payload;
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
      saveState(state.items);
    },
    toggleNotification: (state, action) => {
      const item = state.items.find(i => i.id === action.payload);
      if (item) {
        item.read = !item.read;
        saveState(state.items);
      }
    },
    removeNotification: (state, action) => {
      state.items = state.items.filter(i => i.id !== action.payload);
      saveState(state.items);
    },
    markAllAsRead: (state) => {
      state.items = state.items.map(i => ({ ...i, read: true }));
      saveState(state.items);
    },
    clearAllNotifications: (state) => {
      state.items = [];
      saveState(state.items);
    },
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

