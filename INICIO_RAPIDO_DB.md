# 🚀 Início Rápido - Banco de Dados Local

## ⚡ Configuração em 3 Passos

### 1️⃣ Instalar Dependências
```bash
npm install
```

### 2️⃣ Iniciar o Servidor JSON (Terminal 1)
```bash
npm run server
```
✅ Servidor rodando em: http://localhost:3001

### 3️⃣ Iniciar o Frontend (Terminal 2)
```bash
npm run dev
```
✅ Frontend rodando em: http://localhost:5173

---

## 📋 Comandos Essenciais

### Servidor
```bash
npm run server          # Servidor normal
npm run server:delay    # Servidor com delay de 500ms (testes)
```

### Banco de Dados
```bash
npm run db:backup       # Criar backup do db.json
npm run db:restore      # Restaurar do backup
npm run db:reset        # Resetar para estado inicial
```

---

## 🎯 Testando a API

### 1. Abra o navegador em: http://localhost:3001

Você verá a interface do json-server com todos os endpoints disponíveis.

### 2. Teste via Console do Navegador

#### Listar Alunos
```javascript
fetch('http://localhost:3001/students')
  .then(r => r.json())
  .then(console.log);
```

#### Adicionar Aluno
```javascript
fetch('http://localhost:3001/students', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'José Santos',
    age: 16,
    school: 'E.E. Teste',
    grade: '2º Ano EM',
    contact: '(11) 99999-9999',
    createdAt: new Date().toISOString()
  })
})
.then(r => r.json())
.then(console.log);
```

#### Buscar Usuário para Login
```javascript
fetch('http://localhost:3001/users?email=admin@ong.com')
  .then(r => r.json())
  .then(users => {
    const user = users.find(u => u.password === 'admin123');
    console.log(user ? 'Login OK' : 'Senha errada');
  });
```

---

## 🔑 Credenciais de Teste

### Admin
- **Email:** admin@ong.com
- **Senha:** admin123

### Usuário Normal
- **Email:** joao@ong.com
- **Senha:** senha123

---

## 📊 Estrutura do Banco

```
db.json
├── users              (2 usuários)
├── students           (3 alunos)
├── evaluations        (2 avaliações)
├── forwarding         (2 encaminhamentos)
├── internalControl    (2 registros)
├── notifications      (3 notificações)
└── reports           (3 relatórios)
```

---

## 🧪 Fluxo de Teste Completo

### 1. Fazer Backup
```bash
npm run db:backup
```

### 2. Testar CRUD de Alunos

**Listar:**
```bash
curl http://localhost:3001/students
```

**Criar:**
```bash
curl -X POST http://localhost:3001/students \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Teste\",\"age\":16,\"school\":\"E.E. Test\",\"grade\":\"2º\",\"contact\":\"11999999999\"}"
```

**Atualizar:**
```bash
curl -X PATCH http://localhost:3001/students/1729876543210 \
  -H "Content-Type: application/json" \
  -d "{\"grade\":\"3º Ano EM\"}"
```

**Deletar:**
```bash
curl -X DELETE http://localhost:3001/students/1729876543210
```

### 3. Restaurar Backup
```bash
npm run db:restore
```

---

## 🔧 Integração com Redux

### Exemplo: Buscar Alunos

```javascript
// src/redux/slices/studentsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchStudents = createAsyncThunk(
  'students/fetch',
  async () => {
    const response = await fetch('http://localhost:3001/students');
    return await response.json();
  }
);

const studentsSlice = createSlice({
  name: 'students',
  initialState: { students: [], loading: false },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudents.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.students = action.payload;
      });
  },
});
```

### Uso no Componente

```javascript
// src/pages/Alunos.jsx
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStudents } from '../redux/slices/studentsSlice';

function Alunos() {
  const dispatch = useDispatch();
  const { students, loading } = useSelector(state => state.students);

  useEffect(() => {
    dispatch(fetchStudents());
  }, [dispatch]);

  if (loading) return <div>Carregando...</div>;

  return (
    <div>
      <h1>Alunos</h1>
      {students.map(student => (
        <div key={student.id}>{student.name}</div>
      ))}
    </div>
  );
}
```

---

## 📚 Documentação Adicional

| Arquivo | Descrição |
|---------|-----------|
| `README_DB_JSON.md` | Visão geral e referência rápida |
| `GUIA_DB_JSON.md` | Guia completo de uso e operações |
| `EXEMPLO_INTEGRACAO_JSON_SERVER.md` | Exemplos detalhados de integração |
| `db.json` | Arquivo do banco de dados |
| `db-reset.js` | Script de gerenciamento do banco |

---

## ⚠️ Importante

1. **Servidor deve estar rodando** antes de fazer requisições
2. **Porta 3001** deve estar livre
3. **Alterações são persistentes** - faça backup antes de testes
4. **Não use em produção** - apenas para desenvolvimento

---

## 🐛 Solução de Problemas

### Erro: Porta 3001 em uso
```bash
# Windows PowerShell
netstat -ano | findstr :3001
taskkill /PID [PID_NUMBER] /F
```

### Erro: json-server não encontrado
```bash
npm install --save-dev json-server
```

### Erro: db.json corrompido
```bash
# Restaurar do backup
npm run db:restore

# Ou resetar para o inicial
npm run db:reset
```

### CORS Error
Certifique-se de usar `http://localhost:3001` (não `127.0.0.1`)

---

## ✅ Checklist de Verificação

- [ ] Node.js instalado
- [ ] Dependências instaladas (`npm install`)
- [ ] Arquivo `db.json` existe
- [ ] Servidor JSON rodando (porta 3001)
- [ ] Frontend rodando (porta 5173)
- [ ] Consegue acessar http://localhost:3001
- [ ] Consegue fazer requisições da aplicação

---

## 🎓 Próximos Passos

1. ✅ Ambiente configurado
2. ⬜ Testar endpoints via browser/curl
3. ⬜ Integrar com Redux slices
4. ⬜ Implementar autenticação simulada
5. ⬜ Adicionar validações no frontend
6. ⬜ Implementar CRUD completo em todos os módulos

---

## 💡 Dicas

- Use o navegador para visualizar dados facilmente
- Faça backup antes de testes destrutivos
- Use `server:delay` para simular latência real
- Monitore o terminal do json-server para ver as requisições
- Use ferramentas como Postman ou Thunder Client para testes

---

**Pronto! Seu banco de dados local está configurado e pronto para uso! 🎉**

