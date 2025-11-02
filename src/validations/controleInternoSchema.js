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
  today.setHours(23, 59, 59, 999); // Permitir até o fim do dia de hoje
  return date <= today;
};

// Função auxiliar para validar data posterior
const validateAfterDate = (value, compareDate) => {
  if (!value || !compareDate) return true;
  const date = new Date(value);
  const compare = new Date(compareDate);
  return date >= compare;
};

export const controleInternoSchema = yup.object({
  aluno: yup
    .string()
    .required('Selecione um aluno')
    .test('not-empty', 'Selecione um aluno válido', (value) => {
      return value && value.trim().length > 0;
    }),
  
  ingresso: yup
    .string()
    .required('Data de ingresso é obrigatória')
    .trim()
    .test('date-valid', 'Data de ingresso inválida', validateDate)
    .test('not-future', 'Data de ingresso não pode ser no futuro', validateNotFuture)
    .test('not-too-old', 'Data de ingresso não pode ser anterior a 1900', function(value) {
      if (!value) return true;
      const date = new Date(value);
      return date.getFullYear() >= 1900;
    }),
  
  primeiraAvaliacao: yup
    .string()
    .required('Data da primeira avaliação é obrigatória')
    .trim()
    .test('date-valid', 'Data da primeira avaliação inválida', validateDate)
    .test('after-ingresso', 'Primeira avaliação deve ser posterior ou igual à data de ingresso', function(value) {
      const { ingresso } = this.parent;
      return validateAfterDate(value, ingresso);
    }),
  
  segundaAvaliacao: yup
    .string()
    .required('Data da segunda avaliação é obrigatória')
    .trim()
    .test('date-valid', 'Data da segunda avaliação inválida', validateDate)
    .test('after-first', 'Segunda avaliação deve ser posterior ou igual à primeira avaliação', function(value) {
      const { primeiraAvaliacao } = this.parent;
      return validateAfterDate(value, primeiraAvaliacao);
    }),
  
  primeiraEntrevista: yup
    .string()
    .required('Data da primeira entrevista é obrigatória')
    .trim()
    .test('date-valid', 'Data da primeira entrevista inválida', validateDate)
    .test('after-ingresso', 'Primeira entrevista deve ser posterior ou igual à data de ingresso', function(value) {
      const { ingresso } = this.parent;
      return validateAfterDate(value, ingresso);
    }),
  
  segundaEntrevista: yup
    .string()
    .required('Data da segunda entrevista é obrigatória')
    .trim()
    .test('date-valid', 'Data da segunda entrevista inválida', validateDate)
    .test('after-first', 'Segunda entrevista deve ser posterior ou igual à primeira entrevista', function(value) {
      const { primeiraEntrevista } = this.parent;
      return validateAfterDate(value, primeiraEntrevista);
    }),
  
  resultado: yup
    .string()
    .required('Resultado é obrigatório')
    .trim()
    .test('no-only-spaces', 'Resultado não pode conter apenas espaços', (value) => {
      if (!value) return true;
      return value.trim().length > 0;
    })
    .min(10, 'Resultado deve ter pelo menos 10 caracteres')
    .max(500, 'Resultado deve ter no máximo 500 caracteres')
    .test('no-consecutive-spaces', 'Resultado não pode conter espaços consecutivos excessivos', (value) => {
      if (!value) return true;
      return !/\s{4,}/.test(value);
    }),
});

export default controleInternoSchema;

