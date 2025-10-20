# Guia de Uso do db.json - Banco de Dados Local

## 📋 Visão Geral

Este projeto está configurado para usar um arquivo `db.json` como banco de dados local, servido pelo `json-server`. Isso permite desenvolvimento e testes sem necessidade de um backend real.

## 🚀 Como Usar

### 1. Iniciar o Servidor JSON

Execute um dos seguintes comandos:

```bash
# Servidor básico (sem delay)
npm run server

# Servidor com delay de 500ms (simula latência de rede)
npm run server:delay
```

O servidor estará disponível em: `http://localhost:3001`

### 2. Rodar em Paralelo com o Frontend

Você precisará de dois terminais:

**Terminal 1 - Frontend:**
```bash
npm run dev
```

**Terminal 2 - Backend (JSON Server):**
```bash
npm run server
```

## 📊 Estrutura do Banco de Dados

O arquivo `db.json` contém as seguintes coleções:

### Users (Usuários)
- **Endpoint:** `http://localhost:3001/users`
- **Campos:** id, name, email, password, role, createdAt
- **Uso:** Autenticação e gerenciamento de usuários

### Students (Alunos)
- **Endpoint:** `http://localhost:3001/students`
- **Campos:** id, name, age, school, grade, contact, createdAt
- **Uso:** Cadastro de alunos

### Evaluations (Avaliações)
- **Endpoint:** `http://localhost:3001/evaluations`
- **Campos:** id, studentId, studentName, answers, submittedAt, evaluatedBy
- **Uso:** Armazenar avaliações de alunos

### Forwarding (Encaminhamentos)
- **Endpoint:** `http://localhost:3001/forwarding`
- **Campos:** id, aluno, dataAdmissao, empresa, funcao, contatoRH, dataDesligamento, createdAt
- **Uso:** Gestão de encaminhamentos ao mercado de trabalho

### Internal Control (Controle Interno)
- **Endpoint:** `http://localhost:3001/internalControl`
- **Campos:** id, aluno, ingresso, primeiraAvaliacao, segundaAvaliacao, primeiraEntrevista, segundaEntrevista, resultado, createdAt
- **Uso:** Controle interno de processos

### Notifications (Notificações)
- **Endpoint:** `http://localhost:3001/notifications`
- **Campos:** id, title, when, read, createdAt
- **Uso:** Sistema de notificações

### Reports (Relatórios)
- **Endpoint:** `http://localhost:3001/reports`
- **Campos:** id, name, evaluations, marketStart, lastEvaluation, lastAnswers
- **Uso:** Relatórios e análises

## 🔌 Operações da API REST

O json-server suporta automaticamente todas as operações REST:

### GET - Listar/Obter
```javascript
// Listar todos
fetch('http://localhost:3001/students')

// Obter um específico
fetch('http://localhost:3001/students/1')

// Filtrar
fetch('http://localhost:3001/students?name=Ana')

// Paginar
fetch('http://localhost:3001/students?_page=1&_limit=10')

// Ordenar
fetch('http://localhost:3001/students?_sort=name&_order=asc')
```

### POST - Criar
```javascript
fetch('http://localhost:3001/students', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    id: Date.now().toString(),
    name: 'Novo Aluno',
    age: 16,
    school: 'E.E. Exemplo',
    grade: '2º Ano EM',
    contact: '(11) 99999-9999',
    createdAt: new Date().toISOString()
  })
})
```

### PUT - Atualizar (completo)
```javascript
fetch('http://localhost:3001/students/1', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    id: 1,
    name: 'Aluno Atualizado',
    age: 17,
    school: 'E.E. Atualizada',
    grade: '3º Ano EM',
    contact: '(11) 88888-8888',
    createdAt: '2024-01-15T10:30:00.000Z'
  })
})
```

### PATCH - Atualizar (parcial)
```javascript
fetch('http://localhost:3001/students/1', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    grade: '3º Ano EM'
  })
})
```

### DELETE - Remover
```javascript
fetch('http://localhost:3001/students/1', {
  method: 'DELETE'
})
```

## 🔄 Integração com Redux

Para usar o json-server com seus Redux slices, você pode atualizar os `createAsyncThunk` para apontar para `http://localhost:3001`:

### Exemplo - authSlice.js

```javascript
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      // Buscar usuário por email
      const response = await fetch(`http://localhost:3001/users?email=${email}`);
      const users = await response.json();
      
      const user = users.find(u => u.email === email && u.password === password);
      
      if (!user) {
        throw new Error('Credenciais inválidas');
      }
      
      return {
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
        token: 'fake-jwt-token-' + user.id
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
```

### Exemplo - evaluationsSlice.js

```javascript
export const submitEvaluation = createAsyncThunk(
  'evaluations/submit',
  async ({ payload, studentId }, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:3001/evaluations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          payload, 
          studentId,
          submittedAt: new Date().toISOString(),
          evaluatedBy: 1 // ID do usuário logado
        }),
      });
      
      if (!response.ok) throw new Error(`Status ${response.status}`);
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
```

## 🛠️ Dicas e Truques

### 1. Backup do Banco de Dados
Antes de fazer testes, faça uma cópia do `db.json`:
```bash
cp db.json db.backup.json
```

### 2. Restaurar o Banco
Para voltar ao estado inicial:
```bash
cp db.backup.json db.json
```

### 3. Visualizar os Dados
Acesse no navegador:
- Ver todos os alunos: `http://localhost:3001/students`
- Ver todas as avaliações: `http://localhost:3001/evaluations`
- Ver dashboard: `http://localhost:3001`

### 4. Resetar Dados
Para limpar uma coleção:
```javascript
// Deletar todos os alunos
fetch('http://localhost:3001/students')
  .then(res => res.json())
  .then(students => {
    students.forEach(student => {
      fetch(`http://localhost:3001/students/${student.id}`, {
        method: 'DELETE'
      });
    });
  });
```

## ⚠️ Considerações Importantes

1. **Dados Persistem:** As alterações no `db.json` são salvas automaticamente
2. **Sem Autenticação Real:** O json-server não valida tokens JWT reais
3. **Desenvolvimento Apenas:** Esta solução é para desenvolvimento, não para produção
4. **Conflitos de ID:** Use `Date.now()` ou UUIDs para gerar IDs únicos
5. **CORS:** O json-server já tem CORS habilitado por padrão

## 📝 Próximos Passos

1. Atualize seus Redux slices para usar as URLs do json-server
2. Teste todas as operações CRUD
3. Implemente tratamento de erros adequado
4. Considere adicionar mais dados de exemplo conforme necessário

## 🔗 Recursos Adicionais

- [Documentação oficial do json-server](https://github.com/typicode/json-server)
- [Exemplos de queries](https://github.com/typicode/json-server#routes)

