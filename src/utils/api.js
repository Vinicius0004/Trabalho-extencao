const API_BASE = 'http://localhost:3001';
let serverAvailable = true;

const checkServer = async () => {
  try {
    const response = await fetch(`${API_BASE}/users`, { method: 'HEAD' });
    serverAvailable = response.ok;
    return serverAvailable;
  } catch {
    serverAvailable = false;
    return false;
  }
};

// Fazer requisição com fallback para localStorage
const api = {
  // GET - Buscar dados
  get: async (endpoint, storageKey = null) => {
    try {
      const response = await fetch(`${API_BASE}${endpoint}`);
      if (!response.ok) throw new Error(`GET ${endpoint} failed`);
      const data = await response.json();
      
      // Salvar no localStorage como backup
      if (storageKey) {
        localStorage.setItem(storageKey, JSON.stringify(data));
      }
      
      return data;
    } catch (error) {
      console.warn(`API offline, usando localStorage para ${endpoint}`);
      
      // Fallback para localStorage
      if (storageKey) {
        const localData = localStorage.getItem(storageKey);
        if (localData) return JSON.parse(localData);
      }
      
      throw error;
    }
  },

  // POST - Criar novo registro
  post: async (endpoint, data, storageKey = null) => {
    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error(`POST ${endpoint} failed`);
      const result = await response.json();
      
      // Atualizar localStorage
      if (storageKey) {
        const existing = JSON.parse(localStorage.getItem(storageKey) || '[]');
        localStorage.setItem(storageKey, JSON.stringify([result, ...existing]));
      }
      
      return result;
    } catch (error) {
      console.warn(`API offline, salvando apenas no localStorage`);
      
      // Fallback: salvar apenas localmente
      if (storageKey) {
        const newData = { ...data, id: data.id || Date.now().toString() };
        const existing = JSON.parse(localStorage.getItem(storageKey) || '[]');
        localStorage.setItem(storageKey, JSON.stringify([newData, ...existing]));
        return newData;
      }
      
      throw error;
    }
  },

  // PUT - Atualizar registro completo
  put: async (endpoint, data, storageKey = null) => {
    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error(`PUT ${endpoint} failed`);
      const result = await response.json();
      
      // Atualizar localStorage
      if (storageKey) {
        const existing = JSON.parse(localStorage.getItem(storageKey) || '[]');
        const updated = existing.map(item => 
          item.id === data.id ? result : item
        );
        localStorage.setItem(storageKey, JSON.stringify(updated));
      }
      
      return result;
    } catch (error) {
      console.warn(`API offline, atualizando apenas no localStorage`);
      
      // Fallback: atualizar apenas localmente
      if (storageKey) {
        const existing = JSON.parse(localStorage.getItem(storageKey) || '[]');
        const updated = existing.map(item => 
          item.id === data.id ? data : item
        );
        localStorage.setItem(storageKey, JSON.stringify(updated));
        return data;
      }
      
      throw error;
    }
  },

  // PATCH - Atualizar registro parcial
  patch: async (endpoint, data, storageKey = null) => {
    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error(`PATCH ${endpoint} failed`);
      const result = await response.json();
      
      // Atualizar localStorage
      if (storageKey) {
        const existing = JSON.parse(localStorage.getItem(storageKey) || '[]');
        const updated = existing.map(item => 
          item.id === result.id ? { ...item, ...result } : item
        );
        localStorage.setItem(storageKey, JSON.stringify(updated));
      }
      
      return result;
    } catch (error) {
      console.warn(`API offline, atualizando apenas no localStorage`);
      
      // Fallback: atualizar apenas localmente
      if (storageKey && data.id) {
        const existing = JSON.parse(localStorage.getItem(storageKey) || '[]');
        const updated = existing.map(item => 
          item.id === data.id ? { ...item, ...data } : item
        );
        localStorage.setItem(storageKey, JSON.stringify(updated));
        return data;
      }
      
      throw error;
    }
  },

  // DELETE - Remover registro
  delete: async (endpoint, id, storageKey = null) => {
    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error(`DELETE ${endpoint} failed`);
      
      // Remover do localStorage
      if (storageKey) {
        const existing = JSON.parse(localStorage.getItem(storageKey) || '[]');
        const filtered = existing.filter(item => item.id !== id);
        localStorage.setItem(storageKey, JSON.stringify(filtered));
      }
      
      return id;
    } catch (error) {
      console.warn(`API offline, removendo apenas do localStorage`);
      
      // Fallback: remover apenas localmente
      if (storageKey) {
        const existing = JSON.parse(localStorage.getItem(storageKey) || '[]');
        const filtered = existing.filter(item => item.id !== id);
        localStorage.setItem(storageKey, JSON.stringify(filtered));
        return id;
      }
      
      throw error;
    }
  },
};

export { api, checkServer, API_BASE };

