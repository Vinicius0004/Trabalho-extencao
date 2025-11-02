import React from 'react';

export default function Input({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  required = false,
  disabled = false,
  id,
  name,
  autoComplete,
  ...props
}) {
  const inputId = id || name || `input-${label?.toLowerCase().replace(/\s+/g, '-')}`;
  const errorId = error ? `${inputId}-error` : undefined;

  return (
    <div className="form-row">
      {label && (
        <label htmlFor={inputId}>
          {label}
          {required && <span aria-label="obrigatório" style={{color: 'var(--danger)', marginLeft: '4px'}}>*</span>}
        </label>
      )}
      <input
        id={inputId}
        name={name}
        type={type}
        value={value || ''}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        autoComplete={autoComplete}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={errorId}
        className={error ? 'input-error' : ''}
        {...props}
      />
      {error && (
        <span id={errorId} className="error-text" role="alert" aria-live="polite">
          {error}
        </span>
      )}
    </div>
  );
}

