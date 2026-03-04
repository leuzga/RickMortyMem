import React from 'react';
import { Toast } from './Toast';
import { useToastStore } from './useToastStore';
import { ToastProps } from './Toast.types';
import styles from './ToastContainer.module.css';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className={styles.toastContainer}>
      {toasts.map((toast: ToastProps) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
          autoClose={toast.autoClose}
          duration={toast.duration}
        />
      ))}
    </div>
  );
};
