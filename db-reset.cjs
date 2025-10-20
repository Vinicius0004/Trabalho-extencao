// Script para resetar ou fazer backup do db.json
const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'db.json');
const BACKUP_FILE = path.join(__dirname, 'db.backup.json');

// Dados iniciais padrão
const initialData = {
  users: [
    {
      id: 1,
      name: "Administrador",
      email: "admin@ong.com",
      password: "admin123",
      role: "admin",
      createdAt: "2024-01-01T00:00:00.000Z"
    },
    {
      id: 2,
      name: "João Silva",
      email: "joao@ong.com",
      password: "senha123",
      role: "user",
      createdAt: "2024-02-15T00:00:00.000Z"
    }
  ],
  students: [
    {
      id: "1729876543210",
      name: "Ana Clara Santos",
      age: 16,
      school: "E.E. João da Silva",
      grade: "2º Ano EM",
      contact: "(11) 98765-4321",
      createdAt: "2024-01-15T10:30:00.000Z"
    },
    {
      id: "1729876543211",
      name: "Pedro Henrique Oliveira",
      age: 17,
      school: "E.E. Maria Aparecida",
      grade: "3º Ano EM",
      contact: "(11) 91234-5678",
      createdAt: "2024-02-20T14:45:00.000Z"
    },
    {
      id: "1729876543212",
      name: "Mariana Costa",
      age: 15,
      school: "E.E. José Bonifácio",
      grade: "1º Ano EM",
      contact: "(11) 97654-3210",
      createdAt: "2024-03-10T09:15:00.000Z"
    }
  ],
  evaluations: [
    {
      id: 1,
      studentId: "1729876543210",
      studentName: "Ana Clara Santos",
      answers: {
        "0": "sim",
        "1": "sim",
        "2": "maioria",
        "3": "sim",
        "4": "nao",
        "5": "sim"
      },
      submittedAt: "2024-08-01T15:30:00.000Z",
      evaluatedBy: 1
    },
    {
      id: 2,
      studentId: "1729876543211",
      studentName: "Pedro Henrique Oliveira",
      answers: {
        "0": "maioria",
        "1": "sim",
        "2": "sim",
        "3": "raras",
        "4": "sim"
      },
      submittedAt: "2024-09-15T11:20:00.000Z",
      evaluatedBy: 1
    }
  ],
  forwarding: [
    {
      id: 1,
      aluno: "Ana Clara Santos",
      dataAdmissao: "2024-01-15",
      empresa: "Tech Solutions Ltda",
      funcao: "Jovem Aprendiz - Administrativo",
      contatoRH: "rh@techsolutions.com.br",
      dataDesligamento: "",
      createdAt: "2024-01-20T10:00:00.000Z"
    },
    {
      id: 2,
      aluno: "Pedro Henrique Oliveira",
      dataAdmissao: "2024-03-01",
      empresa: "Comercial ABC",
      funcao: "Assistente de Vendas",
      contatoRH: "(11) 3333-4444",
      dataDesligamento: "2024-08-30",
      createdAt: "2024-03-05T14:30:00.000Z"
    }
  ],
  internalControl: [
    {
      id: 1,
      aluno: "Ana Clara Santos",
      ingresso: "2024-01-10",
      primeiraAvaliacao: "2024-02-15",
      segundaAvaliacao: "2024-08-01",
      primeiraEntrevista: "2024-01-25",
      segundaEntrevista: "2024-02-10",
      resultado: "Aprovada",
      createdAt: "2024-01-10T09:00:00.000Z"
    },
    {
      id: 2,
      aluno: "Pedro Henrique Oliveira",
      ingresso: "2024-02-01",
      primeiraAvaliacao: "2024-03-10",
      segundaAvaliacao: "2024-09-15",
      primeiraEntrevista: "2024-02-15",
      segundaEntrevista: "2024-02-28",
      resultado: "Aprovado",
      createdAt: "2024-02-01T10:30:00.000Z"
    }
  ],
  notifications: [
    {
      id: 1,
      title: "Nova avaliação pendente para Ana Clara Santos",
      when: "2024-10-20",
      read: false,
      createdAt: "2024-10-20T08:00:00.000Z"
    },
    {
      id: 2,
      title: "Entrevista agendada com Pedro Henrique",
      when: "2024-10-21",
      read: false,
      createdAt: "2024-10-19T15:30:00.000Z"
    },
    {
      id: 3,
      title: "Relatório mensal disponível",
      when: "2024-10-15",
      read: true,
      createdAt: "2024-10-15T12:00:00.000Z"
    }
  ],
  reports: [
    {
      id: 1,
      name: "Ana Clara Santos",
      evaluations: 2,
      marketStart: "2024-01-15",
      lastEvaluation: "2024-08-01",
      lastAnswers: {
        "0": "sim",
        "1": "sim",
        "2": "maioria",
        "3": "sim",
        "4": "nao",
        "5": "sim"
      }
    },
    {
      id: 2,
      name: "Pedro Henrique Oliveira",
      evaluations: 1,
      marketStart: "2024-03-01",
      lastEvaluation: "2024-09-15",
      lastAnswers: {
        "0": "maioria",
        "1": "sim",
        "2": "sim",
        "3": "raras",
        "4": "sim"
      }
    },
    {
      id: 3,
      name: "Mariana Costa",
      evaluations: 0,
      marketStart: "",
      lastEvaluation: "",
      lastAnswers: {}
    }
  ]
};

// Comandos disponíveis
const commands = {
  backup: () => {
    if (fs.existsSync(DB_FILE)) {
      fs.copyFileSync(DB_FILE, BACKUP_FILE);
      console.log('✅ Backup criado: db.backup.json');
    } else {
      console.log('❌ Arquivo db.json não encontrado');
    }
  },

  restore: () => {
    if (fs.existsSync(BACKUP_FILE)) {
      fs.copyFileSync(BACKUP_FILE, DB_FILE);
      console.log('✅ Banco restaurado do backup');
    } else {
      console.log('❌ Arquivo de backup não encontrado');
    }
  },

  reset: () => {
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
    console.log('✅ Banco de dados resetado para o estado inicial');
  },

  help: () => {
    console.log(`
📦 Gerenciador do db.json

Comandos disponíveis:

  node db-reset.cjs backup   - Cria um backup do db.json atual
  node db-reset.cjs restore  - Restaura o db.json do backup
  node db-reset.cjs reset    - Reseta o db.json para o estado inicial
  node db-reset.cjs help     - Mostra esta ajuda

Exemplos:
  node db-reset.cjs backup
  node db-reset.cjs restore
  node db-reset.cjs reset
    `);
  }
};

// Executar comando
const command = process.argv[2];

if (!command || !commands[command]) {
  console.log('❌ Comando inválido. Use: node db-reset.cjs help');
  process.exit(1);
}

commands[command]();

