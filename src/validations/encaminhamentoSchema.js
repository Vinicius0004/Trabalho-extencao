import * as yup from 'yup';

// Função auxiliar para validar data
const validateDate = (value) => {
  if (!value) return false;
  const date = new Date(value);
  return !isNaN(date.getTime());
};

// Função auxiliar para validar data não futura
const validateNotFuture = (value) => {
  if (!value) return true;
  const date = new Date(value);
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  return date <= today;
};

// Função auxiliar para validar email
const isValidEmail = (value) => {
  if (!value) return true;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value.trim().toLowerCase());
};

// Função auxiliar para validar telefone
const isValidPhone = (value) => {
  if (!value) return true;
  // Remove caracteres permitidos e verifica se sobram apenas dígitos
  const cleanPhone = value.replace(/[\s\(\)\-\+]/g, '');
  // Telefone deve ter entre 10 e 15 dígitos
  return /^\d{10,15}$/.test(cleanPhone);
};

export const encaminhamentoSchema = yup.object({
  aluno: yup
    .string()
    .required('Selecione um aluno')
    .test('not-empty', 'Selecione um aluno válido', (value) => {
      return value && value.trim().length > 0;
    }),
  
  dataAdmissao: yup
    .string()
    .required('Data de admissão é obrigatória')
    .trim()
    .test('date-valid', 'Data de admissão inválida', validateDate)
    .test('not-future', 'Data de admissão não pode ser no futuro', validateNotFuture)
    .test('not-too-old', 'Data de admissão não pode ser anterior a 1900', function(value) {
      if (!value) return true;
      const date = new Date(value);
      return date.getFullYear() >= 1900;
    }),
  
  empresa: yup
    .string()
    .required('Nome da empresa é obrigatório')
    .trim()
    .test('no-only-spaces', 'Nome da empresa não pode conter apenas espaços', (value) => {
      if (!value) return true;
      return value.trim().length > 0;
    })
    .min(2, 'Nome da empresa deve ter pelo menos 2 caracteres')
    .max(200, 'Nome da empresa deve ter no máximo 200 caracteres')
    .matches(/^[a-zA-ZÀ-ÿ\u00C0-\u017F0-9\s&\-\.]+$/, 'Nome da empresa deve conter apenas letras, números e caracteres especiais permitidos (&, -, .)')
    .test('no-consecutive-spaces', 'Nome da empresa não pode conter espaços consecutivos', (value) => {
      if (!value) return true;
      return !/\s{2,}/.test(value);
    }),
  
  funcao: yup
    .string()
    .required('Função é obrigatória')
    .trim()
    .test('no-only-spaces', 'Função não pode conter apenas espaços', (value) => {
      if (!value) return true;
      return value.trim().length > 0;
    })
    .min(2, 'Função deve ter pelo menos 2 caracteres')
    .max(100, 'Função deve ter no máximo 100 caracteres')
    .matches(/^[a-zA-ZÀ-ÿ\u00C0-\u017F\s\-]+$/, 'Função deve conter apenas letras, hífens e espaços')
    .test('no-consecutive-spaces', 'Função não pode conter espaços consecutivos', (value) => {
      if (!value) return true;
      return !/\s{2,}/.test(value);
    }),
  
  contatoRH: yup
    .string()
    .required('Contato do RH é obrigatório')
    .trim()
    .test('no-only-spaces', 'Contato do RH não pode conter apenas espaços', (value) => {
      if (!value) return true;
      return value.trim().length > 0;
    })
    .min(3, 'Contato do RH deve ter pelo menos 3 caracteres')
    .max(100, 'Contato do RH deve ter no máximo 100 caracteres')
    .test('valid-format', 'Contato deve ser um email válido ou telefone (10-15 dígitos)', function(value) {
      if (!value) return true;
      const trimmed = value.trim();
      return isValidEmail(trimmed) || isValidPhone(trimmed);
    }),
  
  dataDesligamento: yup
    .string()
    .nullable()
    .transform((value) => {
      if (!value || value === '') return null;
      return value.trim();
    })
    .test('date-valid', 'Data de desligamento inválida', function(value) {
      if (!value) return true;
      return validateDate(value);
    })
    .test('not-future', 'Data de desligamento não pode ser no futuro', function(value) {
      if (!value) return true;
      return validateNotFuture(value);
    })
    .test('after-admissao', 'Data de desligamento deve ser posterior ou igual à data de admissão', function(value) {
      if (!value) return true;
      const { dataAdmissao } = this.parent;
      if (!dataAdmissao) return true;
      const desligamentoDate = new Date(value);
      const admissaoDate = new Date(dataAdmissao);
      return desligamentoDate >= admissaoDate;
    }),
});

export default encaminhamentoSchema;

