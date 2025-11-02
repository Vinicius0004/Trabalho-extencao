import React from 'react';

export default function Button({
  children,
  type = 'button',
  variant = 'primary',
  onClick,
  disabled = false,
  loading = false,
  className = '',
  ariaLabel,
  ...props
}) {
  const baseClass = 'btn';
  const variantClass = variant !== 'primary' ? variant : '';
  const combinedClass = `${baseClass} ${variantClass} ${className}`.trim();

  return (
    <button
      type={type}
      className={combinedClass}
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      aria-busy={loading}
      {...props}
    >
      {loading ? (
        <>
          <span className="spinner" style={{width: '16px', height: '16px', borderWidth: '2px', marginRight: '8px'}}></span>
          <span>Carregando...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}

