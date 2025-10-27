// Export all validation schemas
export { default as studentSchema } from './studentSchema';
export { loginSchema, registerSchema } from './authSchema';
export { default as controleInternoSchema } from './controleInternoSchema';
export { default as encaminhamentoSchema } from './encaminhamentoSchema';
export { default as notificacaoSchema } from './notificacaoSchema';

// Helper function for validation
export const validateSchema = async (schema, values) => {
  try {
    await schema.validate(values, { abortEarly: false });
    return { valid: true, errors: {} };
  } catch (err) {
    const errors = {};
    err.inner.forEach((error) => {
      errors[error.path] = error.message;
    });
    return { valid: false, errors };
  }
};

