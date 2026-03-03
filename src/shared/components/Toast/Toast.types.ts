export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  id: string;
  message: string;
  type?: ToastType;
  onClose: () => void;
  autoClose?: boolean;
  duration?: number;
}

export interface ToastState {
  toasts: ToastProps[];
}
