// Função para inicializar dados do db.json no localStorage
export const initializeLocalStorage = async () => {
  try {
    // Verificar se já existe dados no localStorage
    const usersExist = localStorage.getItem('users-v1');
    
    if (!usersExist) {
      try {
        const response = await fetch('/db.json');
        if (response.ok) {
          const dbData = await response.json();
          
          // Inicializar usuários no localStorage
          if (dbData.users && dbData.users.length > 0) {
            localStorage.setItem('users-v1', JSON.stringify(dbData.users));
            console.log('✅ Usuários inicializados do db.json');
          }
        }
      } catch (error) {
        console.warn('Não foi possível carregar db.json na inicialização:', error);
      }
    }
  } catch (error) {
    console.warn('Erro ao inicializar localStorage:', error);
  }
};

