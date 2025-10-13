# 🚀 Guia Rápido - Redux no Projeto

## ⚡ Início Rápido

### 1. Usar Redux em um Componente

```javascript
import { useDispatch, useSelector } from 'react-redux';
import { minhaAction } from '../redux/slices/meuSlice';

function MeuComponente() {
  // Acessar o estado
  const { dados, loading } = useSelector((state) => state.meuSlice);
  
  // Despachar ações
  const dispatch = useDispatch();
  
  const handleClick = () => {
    dispatch(minhaAction(payload));
  };
  
  return (
    <div>
      {loading ? 'Carregando...' : dados.map(...)}
      <button onClick={handleClick}>Ação</button>
    </div>
  );
}
```

### 2. Ações Assíncronas

```javascript
const handleEnviar = async () => {
  try {
    await dispatch(acaoAssincrona(dados)).unwrap();
    alert('Sucesso!');
  } catch (erro) {
    alert('Erro: ' + erro);
  }
};
```

---

## 📦 Slices Disponíveis

### 🔐 authSlice - Autenticação
```javascript
import { login, register, logout, resetPassword } from '../redux/slices/authSlice';

// Login
dispatch(login({ email, password }))

// Registro
dispatch(register({ email, name, password }))

// Logout
dispatch(logout())

// Recuperar senha
dispatch(resetPassword({ email, code, newPassword }))

// Acessar estado
const { user, isAuthenticated, loading } = useSelector(state => state.auth);
```

### 👨‍🎓 studentsSlice - Alunos
```javascript
import { addStudent, updateStudent, removeStudent, saveStudent } from '../redux/slices/studentsSlice';

// Adicionar
dispatch(addStudent(novoAluno))

// Atualizar
dispatch(updateStudent(alunoAtualizado))

// Remover
dispatch(removeStudent(id))

// Salvar (add ou update)
dispatch(saveStudent(aluno))

// Acessar estado
const { students, editing, toast } = useSelector(state => state.students);
```

### 📝 evaluationsSlice - Avaliações
```javascript
import { setAnswer, setPage, saveDraftNow, submitEvaluation } from '../redux/slices/evaluationsSlice';

// Definir resposta
dispatch(setAnswer({ index: 0, value: 'sim' }))

// Mudar página
dispatch(setPage(1))

// Salvar rascunho
dispatch(saveDraftNow())

// Enviar avaliação
dispatch(submitEvaluation({ payload, studentId }))

// Acessar estado
const { answers, page, selectedStudent } = useSelector(state => state.evaluations);
```

### 🔔 notificationsSlice - Notificações
```javascript
import { addNotification, toggleNotification, removeNotification } from '../redux/slices/notificationsSlice';

// Adicionar
dispatch(addNotification({ title: 'Lembrete', when: '2025-10-20' }))

// Marcar lido/não lido
dispatch(toggleNotification(id))

// Remover
dispatch(removeNotification(id))

// Acessar estado
const { items } = useSelector(state => state.notifications);
```

### 📊 reportsSlice - Relatórios
```javascript
import { updateMarketStart, setSearchQuery } from '../redux/slices/reportsSlice';

// Atualizar data
dispatch(updateMarketStart({ id, date }))

// Buscar
dispatch(setSearchQuery('nome'))

// Acessar estado
const { students, searchQuery } = useSelector(state => state.reports);
```

### 📋 internalControlSlice - Controle Interno
```javascript
import { setFormField, resetForm, submitInternalControl } from '../redux/slices/internalControlSlice';

// Definir campo
dispatch(setFormField({ field: 'aluno', value: 'João' }))

// Resetar
dispatch(resetForm())

// Enviar
dispatch(submitInternalControl(formData))

// Acessar estado
const { form, loading } = useSelector(state => state.internalControl);
```

### 🏢 forwardingSlice - Encaminhamento
```javascript
import { setFormField, resetForm, submitForwarding } from '../redux/slices/forwardingSlice';

// Definir campo
dispatch(setFormField({ field: 'empresa', value: 'Empresa X' }))

// Resetar
dispatch(resetForm())

// Enviar
dispatch(submitForwarding(formData))

// Acessar estado
const { form, loading } = useSelector(state => state.forwarding);
```

---

## 🎯 Padrões Comuns

### Loading State
```javascript
const { loading } = useSelector(state => state.meuSlice);

return (
  <button disabled={loading}>
    {loading ? 'Carregando...' : 'Enviar'}
  </button>
);
```

### Error Handling
```javascript
const { error } = useSelector(state => state.meuSlice);

return (
  <>
    {error && <div className="error">{error}</div>}
  </>
);
```

### Confirmação
```javascript
const { confirming } = useSelector(state => state.meuSlice);

const handleRemove = (id) => {
  dispatch(setConfirming(id));
};

const confirmRemove = () => {
  dispatch(removeItem(confirming));
  dispatch(clearConfirming());
};

return (
  <>
    {confirming && (
      <div className="modal">
        <p>Confirmar exclusão?</p>
        <button onClick={confirmRemove}>Sim</button>
        <button onClick={() => dispatch(clearConfirming())}>Não</button>
      </div>
    )}
  </>
);
```

### Toast/Mensagens
```javascript
const { toast } = useSelector(state => state.meuSlice);

useEffect(() => {
  if (toast) {
    const timer = setTimeout(() => dispatch(clearToast()), 2000);
    return () => clearTimeout(timer);
  }
}, [toast, dispatch]);

return (
  <>
    {toast && <div className="toast">{toast}</div>}
  </>
);
```

---

## 🔍 Redux DevTools

### Como Usar:

1. Instale a extensão no navegador:
   - [Chrome](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd)
   - [Firefox](https://addons.mozilla.org/en-US/firefox/addon/reduxdevtools/)

2. Abra as ferramentas de desenvolvedor (F12)

3. Clique na aba "Redux"

4. Veja:
   - **Action**: Todas as ações disparadas
   - **State**: Estado completo da aplicação
   - **Diff**: O que mudou
   - **Trace**: De onde veio a ação

5. Funcionalidades:
   - **Time Travel**: Volte no tempo
   - **Skip**: Pule ações
   - **Export/Import**: Salve estados
   - **Dispatch**: Teste ações manualmente

---

## 💡 Dicas

### ✅ Faça
- Use `useSelector` para acessar o estado
- Use `useDispatch` para disparar ações
- Use `unwrap()` com ações assíncronas
- Mantenha lógica no slice, não no componente
- Use loading states
- Trate erros

### ❌ Evite
- Mutar o estado diretamente
- Lógica complexa em componentes
- Múltiplos dispatches quando um basta
- Esquecer de limpar timers/listeners
- Ignorar erros

---

## 📝 Estrutura de Arquivos

```
src/
├── redux/
│   ├── store.js                    # Store principal
│   ├── middleware/
│   │   └── storageSync.js         # Middleware de sync
│   └── slices/
│       ├── authSlice.js           # 🔐 Autenticação
│       ├── studentsSlice.js       # 👨‍🎓 Alunos
│       ├── evaluationsSlice.js    # 📝 Avaliações
│       ├── notificationsSlice.js  # 🔔 Notificações
│       ├── reportsSlice.js        # 📊 Relatórios
│       ├── internalControlSlice.js # 📋 Controle
│       └── forwardingSlice.js     # 🏢 Encaminhamento
├── pages/                          # Todas usam Redux
└── main.jsx                        # Provider configurado
```

---

## 🐛 Troubleshooting

### Problema: Estado não atualiza
**Solução:** Verifique se está usando `dispatch` e não mutando diretamente

### Problema: Loading infinito
**Solução:** Certifique-se de que a action async está sendo resolvida

### Problema: Erro ao persistir
**Solução:** Verifique se o localStorage está disponível e não está cheio

### Problema: Dados não sincronizam entre abas
**Solução:** Verifique o middleware `storageSync.js`

---

## 🎓 Recursos

- 📖 [Redux Toolkit](https://redux-toolkit.js.org/)
- 📖 [React-Redux](https://react-redux.js.org/)
- 📖 [Redux DevTools](https://github.com/reduxjs/redux-devtools)
- 📖 Documentação completa: `REDUX_IMPLEMENTATION.md`

---

## ✨ Resumo

```javascript
// 1. Importar
import { useDispatch, useSelector } from 'react-redux';
import { minhaAction } from '../redux/slices/meuSlice';

// 2. No componente
const dispatch = useDispatch();
const estado = useSelector(state => state.meuSlice);

// 3. Usar
dispatch(minhaAction(dados));
```

**É isso! Redux é simples quando você pega o jeito! 🚀**

