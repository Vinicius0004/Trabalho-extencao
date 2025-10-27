import * as yup from 'yup';

export const encaminhamentoSchema = yup.object({
  aluno: yup
    .string()
    .required('Selecione um aluno'),
  
  dataAdmissao: yup
    .string()
    .required('Data de admissão é obrigatória')
    .test('date-valid', 'Data de admissão inválida', (value) => {
      if (!value) return false;
      const date = new Date(value);
      return !isNaN(date.getTime());
    })
    .test('not-future', 'Data de admissão não pode ser no futuro', function(value) {
      if (!value) return true;
      return new Date(value) <= new Date();
    }),
  
  empresa: yup
    .string()
    .required('Nome da empresa é obrigatório')
    .min(2, 'Nome da empresa deve ter pelo menos 2 caracteres')
    .max(200, 'Nome da empresa deve ter no máximo 200 caracteres')
    .matches(/^[a-zA-ZÀ-ÿ0-9\s&\-\.]+$/, 'Nome da empresa deve conter apenas letras, números e alguns caracteres especiais')
    .trim(),
  
  funcao: yup
    .string()
    .required('Função é obrigatória')
    .min(2, 'Função deve ter pelo menos 2 caracteres')
    .max(100, 'Função deve ter no máximo 100 caracteres')
    .matches(/^[a-zA-ZÀ-ÿ\s\-]+$/, 'Função deve conter apenas letras')
    .trim(),
  
  contatoRH: yup
    .string()
    .required('Contato do RH é obrigatório')
    .min(3, 'Contato do RH deve ter pelo menos 3 caracteres')
    .max(100, 'Contato do RH deve ter no máximo 100 caracteres')
    .test('contact-format', 'Contato deve ter formato válido (email ou telefone)', (value) => {
      if (!value) return true;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^[\d\s\(\)\-\+]+$/;
      return emailRegex.test(value) || phoneRegex.test(value);
    })
    .trim(),
  
  dataDesligamento: yup
    .string()
    .nullable()
    .transform((value) => value === '' ? null : value)
    .test('date-valid', 'Data de desligamento inválida', function(value) {
      if (!value) return true;
      const date = new Date(value);
      if (isNaN(date.getTime())) return false;
      
      // Validar se desligamento é posterior à admissão
      const { dataAdmissao } = this.parent;
      if (dataAdmissao && value) {
        const admissaoDate = new Date(dataAdmissao);
        const desligamentoDate = new Date(value);
        if (desligamentoDate < admissaoDate) {
          return this.createError({
            message: 'Data de desligamento deve ser posterior à data de admissão'
          });
        }
      }
      return true;
    }),
});

export default encaminhamentoSchema;

