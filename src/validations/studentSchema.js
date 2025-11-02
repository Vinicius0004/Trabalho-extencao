import * as yup from 'yup';

// Função para validar CPF
const validateCPF = (cpf) => {
  if (!cpf) return true;
  
  // Remove caracteres não numéricos
  const cleanCpf = cpf.replace(/\D/g, '');
  
  // Verifica se tem 11 dígitos
  if (cleanCpf.length !== 11) return false;
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cleanCpf)) return false;
  
  // Valida os dígitos verificadores
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCpf.charAt(i)) * (10 - i);
  }
  let digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cleanCpf.charAt(9))) return false;
  
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCpf.charAt(i)) * (11 - i);
  }
  digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cleanCpf.charAt(10))) return false;
  
  return true;
};

export const studentSchema = yup.object({
  name: yup
    .string()
    .required('Nome é obrigatório')
    .trim()
    .min(3, 'Nome deve ter pelo menos 3 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .test('no-only-spaces', 'Nome não pode conter apenas espaços', (value) => {
      if (!value) return true;
      return value.trim().length > 0;
    })
    .matches(/^[a-zA-ZÀ-ÿ\u00C0-\u017F\s]+$/, 'Nome deve conter apenas letras e espaços')
    .test('no-consecutive-spaces', 'Nome não pode conter espaços consecutivos', (value) => {
      if (!value) return true;
      return !/\s{2,}/.test(value);
    }),
  
  cpf: yup
    .string()
    .nullable()
    .transform((value) => {
      if (!value || value === '') return null;
      return value.trim();
    })
    .test('cpf-format', 'CPF deve ter 11 dígitos', function(value) {
      if (!value) return true;
      const cleanCpf = value.replace(/\D/g, '');
      return cleanCpf.length === 11;
    })
    .test('cpf-valid', 'CPF inválido', function(value) {
      if (!value) return true;
      return validateCPF(value);
    }),
  
  email: yup
    .string()
    .nullable()
    .transform((value) => {
      if (!value || value === '') return null;
      return value.trim().toLowerCase();
    })
    .test('email-format', 'Email deve ter um formato válido', function(value) {
      if (!value) return true;
      return yup.string().email().isValidSync(value);
    })
    .test('valid-domain', 'Email deve ter um domínio válido', (value) => {
      if (!value) return true;
      const parts = value.split('@');
      if (parts.length !== 2) return false;
      const domain = parts[1];
      return domain.includes('.') && !domain.startsWith('.') && !domain.endsWith('.');
    })
    .max(254, 'Email deve ter no máximo 254 caracteres'),
  
  pcd: yup
    .string()
    .nullable()
    .transform((value) => {
      if (!value || value === '') return null;
      return value.trim();
    })
    .max(100, 'PCD deve ter no máximo 100 caracteres')
    .test('min-length-if-provided', 'PCD deve ter pelo menos 2 caracteres', function(value) {
      if (!value) return true;
      return value.trim().length >= 2;
    }),
  
  descricao: yup
    .string()
    .nullable()
    .transform((value) => {
      if (!value || value === '') return null;
      return value.trim();
    })
    .max(500, 'Descrição deve ter no máximo 500 caracteres')
    .test('min-length-if-provided', 'Descrição deve ter pelo menos 3 caracteres', function(value) {
      if (!value) return true;
      return value.trim().length >= 3;
    }),
  
  schoolClass: yup
    .string()
    .nullable()
    .transform((value) => {
      if (!value || value === '') return null;
      return value.trim();
    })
    .max(50, 'Turma deve ter no máximo 50 caracteres')
    .test('min-length-if-provided', 'Turma deve ter pelo menos 1 caractere', function(value) {
      if (!value) return true;
      return value.trim().length >= 1;
    }),
  
  notes: yup
    .string()
    .nullable()
    .transform((value) => {
      if (!value || value === '') return null;
      return value.trim();
    })
    .max(1000, 'Anotações deve ter no máximo 1000 caracteres')
    .test('min-length-if-provided', 'Anotações deve ter pelo menos 3 caracteres', function(value) {
      if (!value) return true;
      return value.trim().length >= 3;
    }),
});

export default studentSchema;

