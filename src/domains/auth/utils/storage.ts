/**
 * Utilidades de almacenamiento para tokens y usuarios de autenticación.
 * Sigue principios de programación funcional con manejo de errores.
 */

import type { User } from '../types/auth.types';

const TOKEN_KEY = 'memory_app_token';
const USER_KEY = 'memory_app_user';

// ─── Type guard ───────────────────────────────────────────────────────────────

const isUser = (value: unknown): value is User => {
  if (typeof value !== 'object' || value === null) return false;
  const obj = value as Record<string, unknown>;
  return (
    typeof obj['id'] === 'string' &&
    typeof obj['username'] === 'string' &&
    typeof obj['email'] === 'string'
  );
};

// ─── Token helpers ────────────────────────────────────────────────────────────

export const saveToken = (token: string): void => {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.error('Error saving token:', error);
    throw new Error('No se pudo guardar el token de autenticación');
  }
};

export const getToken = (): string | null => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

export const removeToken = (): void => {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    console.error('Error removing token:', error);
    throw new Error('No se pudo eliminar el token de autenticación');
  }
};

// ─── User helpers ─────────────────────────────────────────────────────────────

export const saveUser = (user: User): void => {
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (error) {
    console.error('Error saving user:', error);
    throw new Error('No se pudo guardar el usuario');
  }
};

export const getUser = (): User | null => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!isUser(parsed)) {
      console.warn('Stored user data is invalid, clearing.');
      localStorage.removeItem(USER_KEY);
      return null;
    }
    return parsed;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
};

export const removeUser = (): void => {
  try {
    localStorage.removeItem(USER_KEY);
  } catch (error) {
    console.error('Error removing user:', error);
    throw new Error('No se pudo eliminar el usuario de sesión');
  }
};
