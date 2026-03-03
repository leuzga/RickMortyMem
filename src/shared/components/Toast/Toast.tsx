import React from 'react';
import { ToastProps } from './Toast.types';
import { TOAST_ICONS, ARIA_LABELS, TOAST_CLOSE_SYMBOL } from '../../constants/ui.constants';
import styles from './Toast.module.css';

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
    <div className={`${styles.toast} ${styles[`toast${type.charAt(0).toUpperCase() + type.slice(1)}`]}`}>
      <div className={styles.toastIcon}>
        {getToastIcon()}
      </div>
      <div className={styles.toastMessage}>
        {message}
      </div>
      <button
        className={styles.toastClose}
        onClick={onClose}
        aria-label={ARIA_LABELS.TOAST_CLOSE}
      >
        {TOAST_CLOSE_SYMBOL}
      </button>
    </div>
  );
};
