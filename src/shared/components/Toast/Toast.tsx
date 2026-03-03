import React from 'react';
import { ToastProps } from './Toast.types';
import { TOAST_ICONS, ARIA_LABELS, TOAST_CLOSE_SYMBOL } from '../../constants/ui.constants';
import './Toast.css';

export const Toast: React.FC<Omit<ToastProps, 'id'>> = ({
  message,
  type = 'info',
  onClose,
  autoClose = true,
  duration = 3000
}) => {
  React.useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  const getToastIcon = (): string => {
    return TOAST_ICONS[type] ?? TOAST_ICONS.info;
  };

  return (
    <div className={`toast toast--${type}`}>
      <div className="toast__icon">
        {getToastIcon()}
      </div>
      <div className="toast__message">
        {message}
      </div>
      <button
        className="toast__close"
        onClick={onClose}
        aria-label={ARIA_LABELS.TOAST_CLOSE}
      >
        {TOAST_CLOSE_SYMBOL}
      </button>
    </div>
  );
};
