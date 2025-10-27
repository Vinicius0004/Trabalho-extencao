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
    .min(3, 'Nome deve ter pelo menos 3 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .matches(/^[a-zA-ZÀ-ÿ\s]+$/, 'Nome deve conter apenas letras')
    .trim(),
  
  cpf: yup
    .string()
    .nullable()
    .transform((value) => value === '' || !value ? null : value)
    .test('cpf-format', 'CPF inválido', function(value) {
      if (!value) return true;
      const cleanCpf = value.replace(/\D/g, '');
      return cleanCpf.length === 11 && validateCPF(value);
    }),
  
  email: yup
    .string()
    .nullable()
    .transform((value) => value === '' ? null : value)
    .when([], ([], schema) => schema.email('Email deve ter um formato válido')),
  
  pcd: yup
    .string()
    .nullable()
    .max(100, 'PCD deve ter no máximo 100 caracteres'),
  
  descricao: yup
    .string()
    .nullable()
    .max(500, 'Descrição deve ter no máximo 500 caracteres'),
  
  schoolClass: yup
    .string()
    .nullable()
    .max(50, 'Turma deve ter no máximo 50 caracteres'),
  
  notes: yup
    .string()
    .nullable()
    .max(1000, 'Anotações deve ter no máximo 1000 caracteres'),
});

export default studentSchema;

