import * as yup from 'yup';

// Função auxiliar para validar data
const validateDate = (value) => {
  if (!value) return false;
  const date = new Date(value);
  return !isNaN(date.getTime());
};

export const notificacaoSchema = yup.object({
  title: yup
    .string()
    .required('Título é obrigatório')
    .trim()
    .test('no-only-spaces', 'Título não pode conter apenas espaços', (value) => {
      if (!value) return true;
      return value.trim().length > 0;
    })
    .min(3, 'Título deve ter pelo menos 3 caracteres')
    .max(200, 'Título deve ter no máximo 200 caracteres')
    .test('no-consecutive-spaces', 'Título não pode conter espaços consecutivos', (value) => {
      if (!value) return true;
      return !/\s{2,}/.test(value);
    }),
  
  when: yup
    .string()
    .required('Data é obrigatória')
    .trim()
    .test('date-valid', 'Data inválida', validateDate)
    .test('not-too-old', 'Data não pode ser anterior a 1900', function(value) {
      if (!value) return true;
      const date = new Date(value);
      return date.getFullYear() >= 1900;
    }),
  
  description: yup
    .string()
    .nullable()
    .transform((value) => {
      if (!value || value === '') return null;
      return value.trim();
    })
    .test('min-length-if-provided', 'Descrição deve ter pelo menos 3 caracteres', function(value) {
      if (!value) return true;
      return value.trim().length >= 3;
    })
    .max(500, 'Descrição deve ter no máximo 500 caracteres')
    .test('no-only-spaces', 'Descrição não pode conter apenas espaços', (value) => {
      if (!value) return true;
      return value.trim().length > 0;
    }),
});

export default notificacaoSchema;

