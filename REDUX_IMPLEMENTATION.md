# Implementação Redux - Documentação

## Visão Geral

Este projeto foi migrado do React Context API para **Redux Toolkit** para melhor gerenciamento de estado global. Redux foi implementado em todas as páginas e componentes do projeto.

## Estrutura Redux

### Store (`src/redux/store.js`)
A store centraliza todo o estado da aplicação com os seguintes slices:
- **auth** - Autenticação e gerenciamento de usuários
- **students** - Gerenciamento de alunos
- **evaluations** - Avaliações de alunos
- **notifications** - Notificações e lembretes
- **reports** - Relatórios
- **internalControl** - Controle interno
- **forwarding** - Encaminhamento

## Slices Implementados

### 1. authSlice (`src/redux/slices/authSlice.js`)
**Estado:**
- `user`: Dados do usuário autenticado
- `isAuthenticated`: Status de autenticação
- `loading`: Estado de carregamento
- `error`: Mensagens de erro
- `token`: Token de autenticação

**Actions:**
- `login(credentials)` - Async: Realizar login
- `register(userData)` - Async: Registrar novo usuário
- `resetPassword(data)` - Async: Recuperar senha
- `logout()` - Fazer logout
- `clearError()` - Limpar erros
- `setUser(user)` - Definir usuário

**Persistência:** localStorage (`auth-state-v1`)

### 2. studentsSlice (`src/redux/slices/studentsSlice.js`)
**Estado:**
- `students`: Lista de alunos
- `editing`: Aluno em edição
- `confirming`: ID do aluno para confirmação
- `toast`: Mensagens temporárias

**Actions:**
- `setStudents(students)` - Definir lista de alunos
- `addStudent(student)` - Adicionar aluno
- `updateStudent(student)` - Atualizar aluno
- `removeStudent(id)` - Remover aluno
- `saveStudent(student)` - Salvar aluno (adicionar ou atualizar)
- `setEditing(student)` - Definir aluno em edição
- `clearEditing()` - Limpar edição
- `setConfirming(id)` - Definir confirmação
- `clearConfirming()` - Limpar confirmação
- `setToast(message)` - Mostrar mensagem
- `clearToast()` - Limpar mensagem

**Persistência:** localStorage (`alunos-cadastrados-v1`)

### 3. evaluationsSlice (`src/redux/slices/evaluationsSlice.js`)
**Estado:**
- `answers`: Respostas da avaliação
- `page`: Página atual
- `selectedStudent`: Aluno selecionado
- `lastSaved`: Data do último salvamento
- `statusMessage`: Mensagem de status
- `loading`: Estado de carregamento

**Actions:**
- `setAnswer({index, value})` - Definir resposta
- `setPage(page)` - Mudar página
- `setSelectedStudent(id)` - Selecionar aluno
- `saveDraftNow()` - Salvar rascunho
- `clearDraft()` - Limpar rascunho
- `setStatusMessage(message)` - Definir mensagem
- `clearStatusMessage()` - Limpar mensagem
- `submitEvaluation({payload, studentId})` - Async: Enviar avaliação

**Persistência:** localStorage (`avaliacao-draft-v1`)

### 4. notificationsSlice (`src/redux/slices/notificationsSlice.js`)
**Estado:**
- `items`: Lista de notificações

**Actions:**
- `setNotifications(items)` - Definir notificações
- `addNotification({title, when})` - Adicionar notificação
- `toggleNotification(id)` - Marcar como lido/não lido
- `removeNotification(id)` - Remover notificação
- `markAllAsRead()` - Marcar todas como lidas
- `clearAllNotifications()` - Limpar todas

**Persistência:** localStorage (`notificacoes-v1`) + Storage Events para sincronização entre abas

### 5. reportsSlice (`src/redux/slices/reportsSlice.js`)
**Estado:**
- `students`: Lista de alunos nos relatórios
- `searchQuery`: Texto de busca
- `status`: Mensagem de status
- `confirming`: ID para confirmação

**Actions:**
- `setStudents(students)` - Definir alunos
- `addStudent(student)` - Adicionar aluno
- `updateMarketStart({id, date})` - Atualizar data de mercado
- `removeStudent(id)` - Remover aluno
- `setSearchQuery(query)` - Definir busca
- `setStatus(message)` - Definir status
- `clearStatus()` - Limpar status
- `setConfirming(id)` - Definir confirmação
- `clearConfirming()` - Limpar confirmação

**Persistência:** localStorage (`relatorios-v1`)

### 6. internalControlSlice (`src/redux/slices/internalControlSlice.js`)
**Estado:**
- `records`: Registros de controle interno
- `form`: Dados do formulário
- `loading`: Estado de carregamento
- `error`: Mensagens de erro
- `statusMessage`: Mensagem de status

**Actions:**
- `setFormField({field, value})` - Definir campo do formulário
- `resetForm()` - Resetar formulário
- `addRecord(record)` - Adicionar registro
- `removeRecord(id)` - Remover registro
- `setStatusMessage(message)` - Definir mensagem
- `clearStatusMessage()` - Limpar mensagem
- `submitInternalControl(formData)` - Async: Enviar formulário

**Persistência:** localStorage (`controle-interno-v1`)

### 7. forwardingSlice (`src/redux/slices/forwardingSlice.js`)
**Estado:**
- `records`: Registros de encaminhamento
- `form`: Dados do formulário
- `loading`: Estado de carregamento
- `error`: Mensagens de erro
- `statusMessage`: Mensagem de status

**Actions:**
- `setFormField({field, value})` - Definir campo do formulário
- `resetForm()` - Resetar formulário
- `addRecord(record)` - Adicionar registro
- `removeRecord(id)` - Remover registro
- `setStatusMessage(message)` - Definir mensagem
- `clearStatusMessage()` - Limpar mensagem
- `submitForwarding(formData)` - Async: Enviar formulário

**Persistência:** localStorage (`encaminhamento-v1`)

## Como Usar Redux nos Componentes

### 1. Importar Hooks do Redux
```javascript
import { useDispatch, useSelector } from 'react-redux';
```

### 2. Importar Actions
```javascript
import { actionName } from '../redux/slices/sliceName';
```

### 3. Usar no Componente
```javascript
function MyComponent() {
  const dispatch = useDispatch();
  const { data, loading } = useSelector((state) => state.sliceName);
  
  const handleAction = () => {
    dispatch(actionName(payload));
  };
  
  return (
    // JSX
  );
}
```

### 4. Async Actions (Thunks)
```javascript
const handleAsyncAction = async () => {
  try {
    await dispatch(asyncAction(payload)).unwrap();
    // Success
  } catch (error) {
    // Error
  }
};
```

## Páginas Atualizadas

✅ **LoginPage** - Usa `authSlice` para autenticação
✅ **Registrar** - Usa `authSlice` para registro
✅ **RecuperarSenha** - Usa `authSlice` para recuperação de senha
✅ **Alunos** - Usa `studentsSlice` para gerenciar alunos
✅ **AvaliacaoAlunos** - Usa `evaluationsSlice` para avaliações
✅ **notificacoes** - Usa `notificationsSlice` para notificações
✅ **HomePage** - Usa `notificationsSlice` para lembretes
✅ **Relatorios** - Usa `reportsSlice` para relatórios
✅ **ControleInterno** - Usa `internalControlSlice` para controle
✅ **Encaminhamento** - Usa `forwardingSlice` para encaminhamento

## Benefícios da Implementação

1. **Estado Centralizado**: Todo o estado da aplicação em um único lugar
2. **Debugging**: Redux DevTools para inspecionar estado e actions
3. **Persistência**: Sincronização automática com localStorage
4. **Type Safety**: Melhor suporte a TypeScript (se necessário)
5. **Performance**: Otimizações automáticas de re-render
6. **Middleware**: Suporte a logging, API calls, etc.
7. **Previsibilidade**: Fluxo de dados unidirecional
8. **Testabilidade**: Fácil testar actions e reducers

## Dependências Adicionadas

```json
{
  "@reduxjs/toolkit": "^latest",
  "react-redux": "^latest"
}
```

## Estrutura de Arquivos

```
src/
├── redux/
│   ├── store.js
│   └── slices/
│       ├── authSlice.js
│       ├── studentsSlice.js
│       ├── evaluationsSlice.js
│       ├── notificationsSlice.js
│       ├── reportsSlice.js
│       ├── internalControlSlice.js
│       └── forwardingSlice.js
├── pages/
│   ├── LoginPage.jsx (✅ Redux)
│   ├── Registrar.jsx (✅ Redux)
│   ├── RecuperarSenha.jsx (✅ Redux)
│   ├── Alunos.jsx (✅ Redux)
│   ├── AvaliacaoAlunos.jsx (✅ Redux)
│   ├── notificacoes.jsx (✅ Redux)
│   ├── HomePage.jsx (✅ Redux)
│   ├── Relatorios.jsx (✅ Redux)
│   ├── ControleInterno.jsx (✅ Redux)
│   └── Encaminhamento.jsx (✅ Redux)
└── main.jsx (✅ Provider configurado)
```

## Notas Importantes

- ❌ **NotificationsContext.jsx** foi removido (substituído por Redux)
- ✅ Todos os dados persistem em localStorage
- ✅ Sincronização entre abas (notificações)
- ✅ Auto-save em avaliações
- ✅ Validações mantidas
- ✅ Feedback visual (loading states, toasts)

## Redux DevTools

Para usar as ferramentas de desenvolvimento do Redux:

1. Instale a extensão [Redux DevTools](https://github.com/reduxjs/redux-devtools) no navegador
2. Abra as ferramentas de desenvolvedor (F12)
3. Navegue até a aba "Redux"
4. Visualize estado, actions, e viaje no tempo!

## Próximos Passos Sugeridos

1. Implementar middleware de logging
2. Adicionar testes unitários para slices
3. Implementar RTK Query para chamadas de API
4. Adicionar TypeScript para type safety
5. Implementar persist com redux-persist (opcional)

---

**Implementação completa em:** $(date)
**Desenvolvido com:** Redux Toolkit + React-Redux

