import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setFormField,
  submitInternalControl,
  clearStatusMessage,
} from '../redux/slices/internalControlSlice';
import { fetchStudents } from '../redux/slices/studentsSlice';
import { validateSchema } from '../validations';
import { controleInternoSchema } from '../validations/controleInternoSchema';
import Input from '../components/Input';
import Select from '../components/Select';
import Button from '../components/Button';
import StatusMessage from '../components/StatusMessage';
import './ControleInterno.css';

export default function ControleInterno() {
  const dispatch = useDispatch();
  const { form, loading, statusMessage } = useSelector((state) => state.internalControl);
  const { students } = useSelector((state) => state.students);
  const [errors, setErrors] = useState({});
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Carregar lista de alunos ao montar o componente
  useEffect(() => {
    dispatch(fetchStudents());
  }, [dispatch]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    dispatch(setFormField({ field: name, value }));
    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  }, [dispatch, errors]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    // Validar com Yup
    const result = await validateSchema(controleInternoSchema, form);
    
    if (!result.valid) {
      setErrors(result.errors);
      // Scroll para o primeiro erro
      const firstErrorField = Object.keys(result.errors)[0];
      const errorElement = document.querySelector(`[name="${firstErrorField}"]`);
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        errorElement.focus();
      }
      return;
    }
    
    setErrors({});
    
    try {
      await dispatch(submitInternalControl({
        ...form,
        id: Date.now(),
        submittedAt: new Date().toISOString(),
      })).unwrap();
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (error) {
      // Error is handled by Redux
    }
  }, [dispatch, form]);

  const studentOptions = students.map(student => ({
    value: student.name,
    label: student.name
  }));

  return (
    <div className="controleinterno-container">
      <div className="controleinterno-header">
        <h2>Controle Interno</h2>
        <p className="form-subtitle">Registro de avaliações e entrevistas com alunos</p>
      </div>
      
      {statusMessage && (
        <StatusMessage 
          message={statusMessage} 
          type="success" 
          onClose={() => dispatch(clearStatusMessage())}
        />
      )}
      
      {submitSuccess && (
        <StatusMessage 
          message="Formulário enviado com sucesso!" 
          type="success"
        />
      )}
      
      <form className="controleinterno-form" onSubmit={handleSubmit} noValidate>
        <Select
          label="Selecionar Nome do Aluno"
          name="aluno"
          value={form.aluno}
          onChange={handleChange}
          options={studentOptions}
          placeholder="Selecione um aluno"
          error={errors.aluno}
          required
          disabled={loading || students.length === 0}
        />
        
        <Input
          label="Ingresso"
          type="date"
          name="ingresso"
          value={form.ingresso}
          onChange={handleChange}
          error={errors.ingresso}
          required
          disabled={loading}
        />
        
        <Input
          label="Primeira Avaliação"
          type="date"
          name="primeiraAvaliacao"
          value={form.primeiraAvaliacao}
          onChange={handleChange}
          error={errors.primeiraAvaliacao}
          required
          disabled={loading}
        />
        
        <Input
          label="Segunda Avaliação"
          type="date"
          name="segundaAvaliacao"
          value={form.segundaAvaliacao}
          onChange={handleChange}
          error={errors.segundaAvaliacao}
          required
          disabled={loading}
        />
        
        <Input
          label="Primeira Entrevista com os Pais"
          type="date"
          name="primeiraEntrevista"
          value={form.primeiraEntrevista}
          onChange={handleChange}
          error={errors.primeiraEntrevista}
          required
          disabled={loading}
        />
        
        <Input
          label="Segunda Entrevista com os Pais"
          type="date"
          name="segundaEntrevista"
          value={form.segundaEntrevista}
          onChange={handleChange}
          error={errors.segundaEntrevista}
          required
          disabled={loading}
        />
        
        <Input
          label="Resultado"
          type="text"
          name="resultado"
          value={form.resultado}
          onChange={handleChange}
          placeholder="Resultado da avaliação"
          error={errors.resultado}
          required
          disabled={loading}
        />
        
        <Button 
          type="submit" 
          disabled={loading}
          loading={loading}
          variant="primary"
        >
          Enviar Formulário
        </Button>
      </form>
    </div>
  );
}
