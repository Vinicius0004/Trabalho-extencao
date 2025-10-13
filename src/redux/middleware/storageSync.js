/**
 * Middleware para sincronizar o Redux com eventos de storage (sincronização entre abas)
 */

export const storageSyncMiddleware = (store) => {
  // Listen to storage events from other tabs
  if (typeof window !== 'undefined') {
    window.addEventListener('storage', (event) => {
      if (event.key === 'notificacoes-v1' && event.newValue) {
        try {
          const items = JSON.parse(event.newValue);
          store.dispatch({ type: 'notifications/setNotifications', payload: items });
        } catch (e) {
          console.warn('Failed to sync notifications from storage event:', e);
        }
      }
    });
  }

  return (next) => (action) => {
    return next(action);
  };
};

export default storageSyncMiddleware;

