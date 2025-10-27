import * as yup from 'yup';

export const loginSchema = yup.object({
  email: yup
    .string()
    .required('Email é obrigatório')
    .email('Email deve ter um formato válido')
    .lowercase('Email deve estar em minúsculas'),
  
  password: yup
    .string()
    .required('Senha é obrigatória')
    .min(6, 'Senha deve ter pelo menos 6 caracteres')
    .max(100, 'Senha deve ter no máximo 100 caracteres'),
});

export const registerSchema = yup.object({
  name: yup
    .string()
    .required('Nome é obrigatório')
    .min(3, 'Nome deve ter pelo menos 3 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .matches(/^[a-zA-ZÀ-ÿ\s]+$/, 'Nome deve conter apenas letras')
    .trim(),
  
  email: yup
    .string()
    .required('Email é obrigatório')
    .email('Email deve ter um formato válido')
    .lowercase('Email deve estar em minúsculas')
    .test('email-domain', 'Email deve ter um domínio válido', (value) => {
      if (!value) return true;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value);
    }),
  
  password: yup
    .string()
    .required('Senha é obrigatória')
    .min(8, 'Senha deve ter pelo menos 8 caracteres')
    .max(100, 'Senha deve ter no máximo 100 caracteres')
    .matches(/^(?=.*[a-z])/, 
      'Senha deve conter pelo menos uma letra minúscula')
    .matches(/^(?=.*[A-Z])/, 
      'Senha deve conter pelo menos uma letra maiúscula')
    .matches(/^(?=.*\d)/, 
      'Senha deve conter pelo menos um número')
    .matches(/^(?=.*[@$!%*?&])/, 
      'Senha deve conter pelo menos um caractere especial (@$!%*?&)'),
  
  confirmPassword: yup
    .string()
    .required('Confirmação de senha é obrigatória')
    .oneOf([yup.ref('password')], 'As senhas devem ser iguais'),
});

export default { loginSchema, registerSchema };

