# 🚀 Quick Reference - Banco de Dados Local

## Comandos Rápidos

```bash
# Iniciar servidor JSON (Terminal 1)
npm run server

# Iniciar frontend (Terminal 2)
npm run dev

# Gerenciar banco de dados
npm run db:backup          # Criar backup
npm run db:restore         # Restaurar backup
npm run db:reset           # Resetar ao inicial
```

## URLs Base

- **API:** http://localhost:3001
- **Frontend:** http://localhost:5173
- **Dashboard JSON Server:** http://localhost:3001

## Endpoints Principais

| Endpoint | Descrição |
|----------|-----------|
| `/users` | Usuários/Autenticação |
| `/students` | Alunos |
| `/evaluations` | Avaliações |
| `/forwarding` | Encaminhamentos |
| `/internalControl` | Controle Interno |
| `/notifications` | Notificações |
| `/reports` | Relatórios |

## Credenciais de Teste

```javascript
// Admin
{ email: "admin@ong.com", password: "admin123" }

// Usuário
{ email: "joao@ong.com", password: "senha123" }
```

## Operações CRUD

```javascript
// GET - Listar
fetch('http://localhost:3001/students')
  .then(r => r.json())

// GET - Um registro
fetch('http://localhost:3001/students/1')
  .then(r => r.json())

// POST - Criar
fetch('http://localhost:3001/students', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Novo', age: 16, ... })
})

// PATCH - Atualizar parcial
fetch('http://localhost:3001/students/1', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ grade: '3º Ano' })
})

// DELETE - Remover
fetch('http://localhost:3001/students/1', {
  method: 'DELETE'
})
```

## Filtros e Queries

```javascript
// Filtrar por campo
/students?name=Ana

// Múltiplos filtros
/students?age=16&grade=2º Ano EM

// Busca full-text
/students?q=Ana

// Paginação
/students?_page=1&_limit=10

// Ordenação
/students?_sort=name&_order=asc

// Range
/students?age_gte=16&age_lte=18
```

## Integração Redux (Exemplo)

```javascript
import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchStudents = createAsyncThunk(
  'students/fetch',
  async () => {
    const res = await fetch('http://localhost:3001/students');
    return await res.json();
  }
);

export const createStudent = createAsyncThunk(
  'students/create',
  async (data) => {
    const res = await fetch('http://localhost:3001/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  }
);
```

## Problemas Comuns

### Porta 3001 ocupada
```bash
# Ver processo
netstat -ano | findstr :3001

# Matar processo
taskkill /PID [PID] /F
```

### Servidor não inicia
```bash
# Reinstalar
npm install --save-dev json-server

# Verificar db.json existe
dir db.json
```

### CORS Error
Use `http://localhost:3001` (não `127.0.0.1`)

### Dados corrompidos
```bash
npm run db:restore    # ou
npm run db:reset
```

## Documentação Completa

- **Início Rápido:** `INICIO_RAPIDO_DB.md`
- **Guia Completo:** `GUIA_DB_JSON.md`
- **Exemplos:** `EXEMPLO_INTEGRACAO_JSON_SERVER.md`
- **Resumo:** `RESUMO_CONFIGURACAO_DB.txt`

---

**Tip:** Mantenha este arquivo aberto enquanto desenvolve! 💡

