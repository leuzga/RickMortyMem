import { create } from 'zustand';
import { ToastProps, ToastState } from './Toast.types';

// Pure helper: generates a unique string ID without external dependencies
const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
};

interface ToastStore extends ToastState {
  showToast: (message: string, type?: ToastProps['type'], duration?: number) => void;
  removeToast: (id: string) => void;
  clearAllToasts: () => void;
}

export const useToastStore = create<ToastStore>((set, get) => ({
  toasts: [],

  showToast: (message: string, type = 'info', duration = 3000) => {
    const id = generateId();
    const newToast: ToastProps = {
      id,
      message,
      type,
      onClose: () => get().removeToast(id),
      autoClose: true,
      duration,
    };

    set((state) => ({
      toasts: [...state.toasts, newToast],
    }));
  },

  removeToast: (id: string) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },

  clearAllToasts: () => {
    set({ toasts: [] });
  },
}));

// Exported for testing purposes only
export { generateId };
