import { create } from 'zustand';
import { User, LoginCredentials, RegisterCredentials } from '../types/auth.types';
import { loginRequest, registerRequest } from '../services/auth.api';
import { saveToken, getToken, removeToken } from '../utils/storage';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: !!getToken(),
  isLoading: false,
  error: null,

  clearError: () => set((state) => ({ ...state, error: null })),

  login: async (credentials) => {
    set((state) => ({ ...state, isLoading: true, error: null }));
    const response = await loginRequest(credentials);

    if (response.success && response.data) {
      saveToken(response.data.tokens.accessToken);
      set((state) => ({
        ...state,
        user: response.data!.user,
        isAuthenticated: true,
        isLoading: false
      }));
    } else {
      set((state) => ({ ...state, error: response.error || 'Error fatal', isLoading: false }));
    }
  },

  register: async (credentials) => {
    set((state) => ({ ...state, isLoading: true, error: null }));
    const response = await registerRequest(credentials);

    if (response.success) {
      set((state) => ({ ...state, isLoading: false }));
      // Opcionalmente auto-login aquí
    } else {
      set((state) => ({ ...state, error: response.error || 'Error al registrar', isLoading: false }));
    }
  },

  logout: () => {
    removeToken();
    set((state) => ({ ...state, user: null, isAuthenticated: false }));
  }
}));