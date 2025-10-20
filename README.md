# 🎓 Sistema de Gestão de Alunos - ONG

Sistema completo de gestão de alunos para ONGs, desenvolvido com React + Redux + Vite.

## ✨ Funcionalidades

- 👥 **Cadastro de Alunos** - Gerenciamento completo de alunos ✅ Integrado
- 📊 **Avaliações** - Sistema de avaliação de alunos ✅ Integrado
- 📝 **Encaminhamentos** - Gestão de encaminhamentos ao mercado de trabalho ✅ Integrado
- 📋 **Controle Interno** - Acompanhamento de processos internos ✅ Integrado
- 🔔 **Notificações** - Sistema de notificações ✅ Integrado
- 📈 **Relatórios** - Relatórios e análises ✅ Integrado
- 🔐 **Autenticação** - Sistema de login e controle de acesso ✅ Integrado

### 🔄 Integração Completa

**Todos os dados são compartilhados!** Quando você cadastra um aluno, ele aparece automaticamente em:
- Sistema de Avaliações
- Encaminhamentos
- Controle Interno
- Relatórios

**Sincronização automática** entre:
- 🌐 json-server (API REST)
- 💾 localStorage (backup offline)
- ⚛️ Redux (estado da aplicação)
- 🖥️ Componentes React (interface)

## 🚀 Início Rápido

### Pré-requisitos

- Node.js (v22.8.0 ou superior)
- npm (v9.9.4 ou superior)

### Instalação

```bash
# Instalar dependências
npm install
```

### Executar o Projeto

**Terminal 1 - Servidor JSON (Backend Simulado):**
```bash
npm run server
```
✅ Servidor API rodando em: http://localhost:3001

**Terminal 2 - Frontend React:**
```bash
npm run dev
```
✅ Frontend rodando em: http://localhost:5173

## 📦 Banco de Dados Local

Este projeto usa **json-server** para simular uma API REST completa com armazenamento local.

### Comandos do Banco de Dados

```bash
npm run server          # Iniciar servidor JSON
npm run server:delay    # Iniciar com delay (simula latência)
npm run db:backup       # Criar backup do banco
npm run db:restore      # Restaurar do backup
npm run db:reset        # Resetar para estado inicial
```

### 📚 Documentação do Banco de Dados

- **[INICIO_RAPIDO_DB.md](INICIO_RAPIDO_DB.md)** - Guia de início rápido
- **[GUIA_DB_JSON.md](GUIA_DB_JSON.md)** - Documentação completa
- **[EXEMPLO_INTEGRACAO_JSON_SERVER.md](EXEMPLO_INTEGRACAO_JSON_SERVER.md)** - Exemplos de código
- **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** - Referência rápida
- **[RESUMO_CONFIGURACAO_DB.txt](RESUMO_CONFIGURACAO_DB.txt)** - Resumo da configuração

### 🔑 Credenciais de Teste

**Administrador:**
- Email: `admin@ong.com`
- Senha: `admin123`

**Usuário:**
- Email: `joao@ong.com`
- Senha: `senha123`

## 🛠️ Tecnologias

- **React** 19.1.1 - Biblioteca UI
- **Redux Toolkit** 2.9.0 - Gerenciamento de estado
- **React Router** 7.8.1 - Roteamento
- **Vite** 7.1.2 - Build tool
- **json-server** - Backend simulado
- **ESLint** - Linting

## 📁 Estrutura do Projeto

```
src/
├── pages/              # Páginas da aplicação
│   ├── HomePage.jsx
│   ├── LoginPage.jsx
│   ├── Alunos.jsx
│   ├── AvaliacaoAlunos.jsx
│   ├── Encaminhamento.jsx
│   ├── ControleInterno.jsx
│   ├── Relatorios.jsx
│   └── notificacoes.jsx
├── redux/              # Redux store e slices
│   ├── store.js
│   ├── slices/
│   │   ├── authSlice.js
│   │   ├── studentsSlice.js
│   │   ├── evaluationsSlice.js
│   │   ├── forwardingSlice.js
│   │   ├── internalControlSlice.js
│   │   ├── notificationsSlice.js
│   │   └── reportsSlice.js
│   └── middleware/
│       └── storageSync.js
├── components/         # Componentes reutilizáveis
│   └── Header.jsx
└── styles/            # Estilos globais
    └── global.css

db.json                # Banco de dados local
```

## 📡 API Endpoints

Base URL: `http://localhost:3001`

| Endpoint | Descrição |
|----------|-----------|
| `/users` | Usuários e autenticação |
| `/students` | Cadastro de alunos |
| `/evaluations` | Avaliações |
| `/forwarding` | Encaminhamentos |
| `/internalControl` | Controle interno |
| `/notifications` | Notificações |
| `/reports` | Relatórios |

## 🔧 Scripts Disponíveis

```bash
npm run dev              # Iniciar frontend
npm run build            # Build de produção
npm run preview          # Preview do build
npm run lint             # Executar ESLint
npm run server           # Iniciar json-server
npm run server:delay     # Iniciar json-server com delay
npm run db:backup        # Backup do banco
npm run db:restore       # Restaurar backup
npm run db:reset         # Resetar banco
```

## 📖 Documentação Redux

- **[GUIA_RAPIDO_REDUX.md](GUIA_RAPIDO_REDUX.md)** - Guia rápido do Redux
- **[README_REDUX.md](README_REDUX.md)** - Documentação Redux
- **[REDUX_IMPLEMENTATION.md](REDUX_IMPLEMENTATION.md)** - Implementação
- **[CHANGELOG_REDUX.md](CHANGELOG_REDUX.md)** - Changelog

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/NovaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/NovaFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto é privado e de uso exclusivo da organização.

## 👥 Equipe

Desenvolvido para gestão de alunos em programas sociais.

---

## 📖 Leia Primeiro

**🎯 Integração Completa:** [README_INTEGRACAO.md](README_INTEGRACAO.md) ⭐⭐⭐  
**⚡ Início Rápido:** [INICIO_RAPIDO_DB.md](INICIO_RAPIDO_DB.md)  
**📝 Referência Rápida:** [QUICK_REFERENCE.md](QUICK_REFERENCE.md)  
**🔧 Documentação Técnica:** [INTEGRACAO_COMPLETA.md](INTEGRACAO_COMPLETA.md)
