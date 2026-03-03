import { create } from 'zustand';
import type { User, LoginCredentials, RegisterCredentials } from '../types/auth.types';
import { loginRequest, registerRequest } from '../services/auth.api';
import { handleOAuthCallback, signOutOAuth } from '../services/oauth.api';
import { saveToken, getToken, removeToken, saveUser, getUser, removeUser } from '../utils/storage';
import { oauthUserToUser } from '../utils/auth.utils';
import { useToastStore } from '../../../shared/components/Toast/useToastStore';
import { AUTH_MESSAGES } from '../constants/auth.constants';

// ─── State interface ──────────────────────────────────────────────────────────

interface AuthState {
  readonly user: User | null;
  readonly isAuthenticated: boolean;
  readonly isLoading: boolean;
  readonly error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials, onSuccess?: () => void) => Promise<void>;
  loginWithOAuthCallback: () => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

// ─── Initial state (restored from localStorage) ───────────────────────────────

const restoredUser = getUser();
const restoredToken = getToken();
const initialIsAuthenticated = !!restoredToken && restoredUser !== null;

// ─── Store ────────────────────────────────────────────────────────────────────

export const useAuthStore = create<AuthState>((set) => {
  const { showToast } = useToastStore.getState();

  return {
    user: initialIsAuthenticated ? restoredUser : null,
    isAuthenticated: initialIsAuthenticated,
    isLoading: false,
    error: null,

    clearError: () => set((prev) => ({ ...prev, error: null })),

    login: async (credentials) => {
      set((prev) => ({ ...prev, isLoading: true, error: null }));
      try {
        const response = await loginRequest(credentials);
        if (response.success && response.data) {
          saveToken(response.data.tokens.accessToken);
          saveUser(response.data.user);
          set((prev) => ({
            ...prev,
            user: response.data!.user,
            isAuthenticated: true,
            isLoading: false,
          }));
          showToast(AUTH_MESSAGES.LOGIN.SUCCESS, 'success');
        } else {
          const msg = response.error ?? AUTH_MESSAGES.LOGIN.ERROR;
          set((prev) => ({ ...prev, error: msg, isLoading: false }));
          showToast(msg, 'error');
        }
      } catch {
        set((prev) => ({ ...prev, error: AUTH_MESSAGES.LOGIN.ERROR, isLoading: false }));
        showToast(AUTH_MESSAGES.LOGIN.ERROR, 'error');
      }
    },

    register: async (credentials, onSuccess) => {
      set((prev) => ({ ...prev, isLoading: true, error: null }));
      try {
        const response = await registerRequest(credentials);
        if (response.success) {
          set((prev) => ({ ...prev, isLoading: false }));
          showToast(AUTH_MESSAGES.REGISTER.SUCCESS, 'success');
          onSuccess?.();
        } else {
          const msg = response.error ?? AUTH_MESSAGES.REGISTER.ERROR;
          set((prev) => ({ ...prev, error: msg, isLoading: false }));
          showToast(msg, 'error');
        }
      } catch {
        set((prev) => ({ ...prev, error: AUTH_MESSAGES.REGISTER.ERROR, isLoading: false }));
        showToast(AUTH_MESSAGES.REGISTER.ERROR, 'error');
      }
    },

    loginWithOAuthCallback: async () => {
      set((prev) => ({ ...prev, isLoading: true, error: null }));
      const result = await handleOAuthCallback();

      const nextState = result.success
        ? (() => {
          const user = oauthUserToUser(result.data);
          saveToken(result.data.session.accessToken);
          saveUser(user);
          showToast(AUTH_MESSAGES.LOGIN.SUCCESS, 'success');
          return { user, isAuthenticated: true, isLoading: false, error: null };
        })()
        : (() => {
          showToast(result.error, 'error');
          return { isLoading: false, error: result.error };
        })();

      set((prev) => ({ ...prev, ...nextState }));
    },

    logout: async () => {
      removeToken();
      removeUser();
      void signOutOAuth();
      set((prev) => ({ ...prev, user: null, isAuthenticated: false }));
      showToast(AUTH_MESSAGES.LOGOUT.SUCCESS, 'success');
    },
  };
});