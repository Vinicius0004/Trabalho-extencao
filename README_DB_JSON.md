# 📦 Banco de Dados Local - db.json

## ⚡ Início Rápido

### 1. Instalar Dependências (Já feito)
```bash
npm install
```

### 2. Iniciar o JSON Server
```bash
npm run server
```
O servidor estará em: **http://localhost:3001**

### 3. Iniciar o Frontend (em outro terminal)
```bash
npm run dev
```

## 🎯 URLs Disponíveis

| Recurso | URL | Descrição |
|---------|-----|-----------|
| Usuários | `http://localhost:3001/users` | Autenticação e gerenciamento |
| Alunos | `http://localhost:3001/students` | Cadastro de alunos |
| Avaliações | `http://localhost:3001/evaluations` | Avaliações dos alunos |
| Encaminhamentos | `http://localhost:3001/forwarding` | Encaminhamentos ao mercado |
| Controle Interno | `http://localhost:3001/internalControl` | Processos internos |
| Notificações | `http://localhost:3001/notifications` | Sistema de notificações |
| Relatórios | `http://localhost:3001/reports` | Relatórios e análises |

## 🔧 Scripts Disponíveis

```bash
# Servidor JSON (sem delay)
npm run server

# Servidor JSON (com delay de 500ms - simula latência)
npm run server:delay

# Frontend (Vite)
npm run dev
```

## 📝 Exemplo de Uso

### Listar todos os alunos
```javascript
const response = await fetch('http://localhost:3001/students');
const students = await response.json();
```

### Adicionar novo aluno
```javascript
const response = await fetch('http://localhost:3001/students', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Maria Silva',
    age: 16,
    school: 'E.E. Exemplo',
    grade: '2º Ano EM',
    contact: '(11) 99999-9999'
  })
});
const newStudent = await response.json();
```

### Atualizar aluno
```javascript
await fetch('http://localhost:3001/students/1', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ grade: '3º Ano EM' })
});
```

### Deletar aluno
```javascript
await fetch('http://localhost:3001/students/1', {
  method: 'DELETE'
});
```

## 📚 Documentação Completa

- **GUIA_DB_JSON.md** - Guia completo de uso e operações
- **EXEMPLO_INTEGRACAO_JSON_SERVER.md** - Exemplos de integração com Redux

## 🔑 Usuários de Teste

```javascript
{
  email: "admin@ong.com",
  password: "admin123",
  role: "admin"
}

{
  email: "joao@ong.com",
  password: "senha123",
  role: "user"
}
```

## ⚠️ Importante

- As alterações no `db.json` são **persistentes**
- Faça backup antes de testes: `cp db.json db.backup.json`
- Para restaurar: `cp db.backup.json db.json`
- Este é um ambiente de **desenvolvimento**, não use em produção

## 🆘 Problemas Comuns

### Porta já em uso
```bash
# Matar processo na porta 3001 (Windows)
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

### Servidor não inicia
```bash
# Reinstalar json-server
npm install --save-dev json-server

# Verificar se o arquivo existe
dir db.json
```

### CORS Error
O json-server já tem CORS habilitado. Se ainda tiver problemas, verifique se está acessando `http://localhost:3001` e não `http://127.0.0.1:3001`

## 📞 Suporte

Para mais informações, consulte:
- [Documentação do json-server](https://github.com/typicode/json-server)
- GUIA_DB_JSON.md (documentação completa deste projeto)

