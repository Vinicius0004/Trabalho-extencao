import * as yup from 'yup';

export const notificacaoSchema = yup.object({
  title: yup
    .string()
    .required('Título é obrigatório')
    .min(3, 'Título deve ter pelo menos 3 caracteres')
    .max(200, 'Título deve ter no máximo 200 caracteres')
    .trim(),
  
  when: yup
    .string()
    .required('Data é obrigatória')
    .test('date-valid', 'Data inválida', (value) => {
      if (!value) return false;
      return !isNaN(Date.parse(value));
    }),
  
  description: yup
    .string()
    .nullable()
    .max(500, 'Descrição deve ter no máximo 500 caracteres'),
});

export default notificacaoSchema;

