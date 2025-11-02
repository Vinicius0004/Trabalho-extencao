import React from 'react';

export default function Select({
  label,
  value,
  onChange,
  options = [],
  placeholder = 'Selecione...',
  error,
  required = false,
  disabled = false,
  id,
  name,
  ...props
}) {
  const selectId = id || name || `select-${label?.toLowerCase().replace(/\s+/g, '-')}`;
  const errorId = error ? `${selectId}-error` : undefined;

  return (
    <div className="form-row">
      {label && (
        <label htmlFor={selectId}>
          {label}
          {required && <span aria-label="obrigatório" style={{color: 'var(--danger)', marginLeft: '4px'}}>*</span>}
        </label>
      )}
      <select
        id={selectId}
        name={name}
        value={value || ''}
        onChange={onChange}
        disabled={disabled}
        required={required}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={errorId}
        className={error ? 'input-error' : ''}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => {
          const optionValue = typeof option === 'object' ? option.value : option;
          const optionLabel = typeof option === 'object' ? option.label : option;
          return (
            <option key={optionValue} value={optionValue}>
              {optionLabel}
            </option>
          );
        })}
      </select>
      {error && (
        <span id={errorId} className="error-text" role="alert" aria-live="polite">
          {error}
        </span>
      )}
    </div>
  );
}

