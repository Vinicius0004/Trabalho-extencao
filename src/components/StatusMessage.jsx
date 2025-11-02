import React, { useEffect, useState } from 'react';
import './StatusMessage.css';

export default function StatusMessage({ message, type = 'success', duration = 3000, onClose }) {
  const [isVisible, setIsVisible] = useState(!!message);

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      if (duration > 0) {
        const timer = setTimeout(() => {
          setIsVisible(false);
          if (onClose) {
            setTimeout(onClose, 300); // Wait for fade out
          }
        }, duration);
        return () => clearTimeout(timer);
      }
    } else {
      setIsVisible(false);
    }
  }, [message, duration, onClose]);

  if (!message || !isVisible) return null;

  return (
    <div 
      className={`status-message status-${type} ${isVisible ? 'status-visible' : ''}`}
      role="alert"
      aria-live="polite"
    >
      <span className="status-icon">
        {type === 'success' && '✓'}
        {type === 'error' && '✕'}
        {type === 'warning' && '⚠'}
        {type === 'info' && 'ℹ'}
      </span>
      <span className="status-text">{message}</span>
      {onClose && (
        <button 
          className="status-close"
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          aria-label="Fechar"
        >
          ✕
        </button>
      )}
    </div>
  );
}

