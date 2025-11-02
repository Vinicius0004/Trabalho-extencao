import * as yup from 'yup';

// Validação comum de email
const emailValidation = yup
  .string()
  .required('Email é obrigatório')
  .trim()
  .lowercase('Email deve estar em minúsculas')
  .max(254, 'Email deve ter no máximo 254 caracteres')
  .email('Email deve ter um formato válido')
  .test('no-leading-trailing-dots', 'Email não pode começar ou terminar com ponto', (value) => {
    if (!value) return true;
    const trimmed = value.trim();
    return !trimmed.startsWith('.') && !trimmed.endsWith('.');
  })
  .test('no-consecutive-dots', 'Email não pode conter pontos consecutivos', (value) => {
    if (!value) return true;
    return !value.includes('..');
  })
  .test('valid-domain', 'Email deve ter um domínio válido', (value) => {
    if (!value) return true;
    const parts = value.split('@');
    if (parts.length !== 2) return false;
    const domain = parts[1];
    return domain.includes('.') && !domain.startsWith('.') && !domain.endsWith('.');
  });

export const loginSchema = yup.object({
  email: emailValidation,
  
  password: yup
    .string()
    .required('Senha é obrigatória')
    .min(6, 'Senha deve ter pelo menos 6 caracteres')
    .max(100, 'Senha deve ter no máximo 100 caracteres')
    .test('no-whitespace', 'Senha não pode conter espaços em branco', (value) => {
      if (!value) return true;
      return !/\s/.test(value);
    })
    .test('no-empty', 'Senha não pode estar vazia', (value) => {
      return value && value.trim().length > 0;
    }),
});

export const registerSchema = yup.object({
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
  
  email: emailValidation,
  
  password: yup
    .string()
    .required('Senha é obrigatória')
    .min(8, 'Senha deve ter pelo menos 8 caracteres')
    .max(100, 'Senha deve ter no máximo 100 caracteres')
    .test('no-whitespace', 'Senha não pode conter espaços em branco', (value) => {
      if (!value) return true;
      return !/\s/.test(value);
    })
    .test('has-lowercase', 'Senha deve conter pelo menos uma letra minúscula', (value) => {
      if (!value) return true;
      return /[a-z]/.test(value);
    })
    .test('has-uppercase', 'Senha deve conter pelo menos uma letra maiúscula', (value) => {
      if (!value) return true;
      return /[A-Z]/.test(value);
    })
    .test('has-number', 'Senha deve conter pelo menos um número', (value) => {
      if (!value) return true;
      return /\d/.test(value);
    })
    .test('has-special-char', 'Senha deve conter pelo menos um caractere especial (@$!%*?&)', (value) => {
      if (!value) return true;
      return /[@$!%*?&]/.test(value);
    }),
  
  confirmPassword: yup
    .string()
    .required('Confirmação de senha é obrigatória')
    .test('passwords-match', 'As senhas devem ser iguais', function(value) {
      return this.parent.password === value;
    })
    .test('no-whitespace', 'Senha não pode conter espaços em branco', (value) => {
      if (!value) return true;
      return !/\s/.test(value);
    }),
});

export default { loginSchema, registerSchema };

