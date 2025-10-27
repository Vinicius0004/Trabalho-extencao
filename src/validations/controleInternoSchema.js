import * as yup from 'yup';

export const controleInternoSchema = yup.object({
  aluno: yup
    .string()
    .required('Selecione um aluno'),
  
  ingresso: yup
    .string()
    .required('Data de ingresso é obrigatória')
    .test('date-valid', 'Data de ingresso inválida', (value) => {
      if (!value) return false;
      const date = new Date(value);
      return !isNaN(date.getTime()) && date <= new Date();
    })
    .test('not-future', 'Data de ingresso não pode ser no futuro', function(value) {
      if (!value) return true;
      return new Date(value) <= new Date();
    }),
  
  primeiraAvaliacao: yup
    .string()
    .required('Data da primeira avaliação é obrigatória')
    .test('date-valid', 'Data da primeira avaliação inválida', (value) => {
      if (!value) return false;
      const date = new Date(value);
      return !isNaN(date.getTime());
    }),
  
  segundaAvaliacao: yup
    .string()
    .required('Data da segunda avaliação é obrigatória')
    .test('date-valid', 'Data da segunda avaliação inválida', (value) => {
      if (!value) return false;
      const date = new Date(value);
      return !isNaN(date.getTime());
    })
    .test('after-first', 'Segunda avaliação deve ser posterior à primeira', function(value) {
      const { primeiraAvaliacao } = this.parent;
      if (!primeiraAvaliacao || !value) return true;
      return new Date(value) >= new Date(primeiraAvaliacao);
    }),
  
  primeiraEntrevista: yup
    .string()
    .required('Data da primeira entrevista é obrigatória')
    .test('date-valid', 'Data da primeira entrevista inválida', (value) => {
      if (!value) return false;
      const date = new Date(value);
      return !isNaN(date.getTime());
    }),
  
  segundaEntrevista: yup
    .string()
    .required('Data da segunda entrevista é obrigatória')
    .test('date-valid', 'Data da segunda entrevista inválida', (value) => {
      if (!value) return false;
      const date = new Date(value);
      return !isNaN(date.getTime());
    })
    .test('after-first', 'Segunda entrevista deve ser posterior à primeira', function(value) {
      const { primeiraEntrevista } = this.parent;
      if (!primeiraEntrevista || !value) return true;
      return new Date(value) >= new Date(primeiraEntrevista);
    }),
  
  resultado: yup
    .string()
    .required('Resultado é obrigatório')
    .min(10, 'Resultado deve ter pelo menos 10 caracteres')
    .max(500, 'Resultado deve ter no máximo 500 caracteres')
    .trim(),
});

export default controleInternoSchema;

