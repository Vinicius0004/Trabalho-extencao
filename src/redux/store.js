import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import studentsReducer from './slices/studentsSlice';
import evaluationsReducer from './slices/evaluationsSlice';
import notificationsReducer from './slices/notificationsSlice';
import reportsReducer from './slices/reportsSlice';
import internalControlReducer from './slices/internalControlSlice';
import forwardingReducer from './slices/forwardingSlice';
import storageSyncMiddleware from './middleware/storageSync';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    students: studentsReducer,
    evaluations: evaluationsReducer,
    notifications: notificationsReducer,
    reports: reportsReducer,
    internalControl: internalControlReducer,
    forwarding: forwardingReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(storageSyncMiddleware),
});

export default store;

