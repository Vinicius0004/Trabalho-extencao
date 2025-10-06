import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

const STORAGE_KEY = 'notificacoes-v1';

const NotificationsContext = createContext(null);

export function useNotifications(){
  return useContext(NotificationsContext);
}

export function NotificationsProvider({ children }){
  const [items, setItems] = useState([]);

  // load once
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch (e){ console.warn('Failed to load notifications', e); }
  }, []);

  // listen to storage events (sync across tabs)
  useEffect(() => {
    const onStorage = (ev) => {
      if (ev.key === STORAGE_KEY) {
        try { setItems(ev.newValue ? JSON.parse(ev.newValue) : []); } catch(e){}
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const formatDate = (d) => {
    try {
      const date = d ? new Date(d) : new Date();
      return date.toISOString().slice(0,10);
    } catch(e){ return new Date().toISOString().slice(0,10); }
  }
  const add = useCallback((payload) => {
    const when = formatDate(payload.when);
    setItems(prev => {
      const next = [{ id: Date.now(), title: payload.title, when, read: false }, ...prev];
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch(e){ console.warn(e); }
      return next;
    });
  }, []);

  const toggle = useCallback((id) => {
    setItems(prev => {
      const next = prev.map(i => i.id === id ? { ...i, read: !i.read } : i);
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch(e){ console.warn(e); }
      return next;
    });
  }, []);

  const remove = useCallback((id) => {
    setItems(prev => {
      const next = prev.filter(i => i.id !== id);
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch(e){ console.warn(e); }
      return next;
    });
  }, []);

  return (
    <NotificationsContext.Provider value={{ items, add, toggle, remove }}>
      {children}
    </NotificationsContext.Provider>
  );
}

export default NotificationsContext;
