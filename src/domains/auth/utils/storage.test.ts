import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  saveToken,
  getToken,
  removeToken,
  saveUser,
  getUser,
  removeUser,
} from './storage';
import type { User } from '../types/auth.types';

// ─── localStorage mock ────────────────────────────────────────────────────────

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

const MOCK_USER: User = {
  id: 'user-1',
  username: 'rick_sanchez',
  email: 'rick@c137.com',
};

// ─────────────────────────────────────────────────────────────────────────────

describe('Token storage helpers', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.restoreAllMocks();
  });

  it('saveToken guarda el token en localStorage', () => {
    saveToken('my-token');
    expect(localStorageMock.getItem('memory_app_token')).toBe('my-token');
  });

  it('getToken retorna el token guardado', () => {
    localStorageMock.setItem('memory_app_token', 'stored-token');
    expect(getToken()).toBe('stored-token');
  });

  it('getToken retorna null cuando no hay token', () => {
    expect(getToken()).toBeNull();
  });

  it('removeToken elimina el token de localStorage', () => {
    localStorageMock.setItem('memory_app_token', 'my-token');
    removeToken();
    expect(localStorageMock.getItem('memory_app_token')).toBeNull();
  });
});

// ─────────────────────────────────────────────────────────────────────────────

describe('User storage helpers', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.restoreAllMocks();
  });

  it('saveUser serializa y guarda el usuario', () => {
    saveUser(MOCK_USER);
    const raw = localStorageMock.getItem('memory_app_user');
    expect(JSON.parse(raw!)).toEqual(MOCK_USER);
  });

  it('getUser retorna el usuario correctamente deserializado', () => {
    localStorageMock.setItem('memory_app_user', JSON.stringify(MOCK_USER));
    const user = getUser();
    expect(user).toEqual(MOCK_USER);
  });

  it('getUser retorna null cuando no hay usuario guardado', () => {
    expect(getUser()).toBeNull();
  });

  it('getUser retorna null y limpia la entrada si el JSON es inválido', () => {
    localStorageMock.setItem('memory_app_user', 'not-valid-json{');
    const user = getUser();
    expect(user).toBeNull();
  });

  it('getUser retorna null y limpia la entrada si faltan campos requeridos del User', () => {
    const incomplete = { id: 'user-1', username: 'rick' }; // falta email
    localStorageMock.setItem('memory_app_user', JSON.stringify(incomplete));
    const user = getUser();
    expect(user).toBeNull();
    // El type guard debe haber limpiado la entrada inválida
    expect(localStorageMock.getItem('memory_app_user')).toBeNull();
  });

  it('getUser retorna null si el valor guardado no es un objeto', () => {
    localStorageMock.setItem('memory_app_user', JSON.stringify([1, 2, 3]));
    expect(getUser()).toBeNull();
  });

  it('removeUser elimina el usuario de localStorage', () => {
    localStorageMock.setItem('memory_app_user', JSON.stringify(MOCK_USER));
    removeUser();
    expect(localStorageMock.getItem('memory_app_user')).toBeNull();
  });
});
