/**
 * Tests de auth.utils.ts — funciones puras del dominio de autenticación.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { getLayoutTitle, isOAuthCallback, oauthUserToUser } from './auth.utils';
import type { ActiveForm } from './auth.utils';
import type { OAuthCallbackResult } from '../types/oauth.types';

// ─── getLayoutTitle ───────────────────────────────────────────────────────────

describe('getLayoutTitle', () => {
  it('retorna título correcto para "login"', () => {
    expect(getLayoutTitle('login')).toBe('Hello, welcome!');
  });

  it('retorna título correcto para "register"', () => {
    expect(getLayoutTitle('register')).toBe('Create Account');
  });

  it('retorna título correcto para "forgot-password"', () => {
    expect(getLayoutTitle('forgot-password')).toBe('¿Olvidó su contraseña?');
  });

  it('cubre todos los valores de ActiveForm', () => {
    const forms: ActiveForm[] = ['login', 'register', 'forgot-password'];
    forms.forEach((form) => {
      expect(typeof getLayoutTitle(form)).toBe('string');
      expect(getLayoutTitle(form).length).toBeGreaterThan(0);
    });
  });
});

// ─── isOAuthCallback ──────────────────────────────────────────────────────────

describe('isOAuthCallback', () => {
  const originalLocation = window.location;

  beforeEach(() => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      writable: true,
      value: { ...originalLocation, hash: '', search: '' },
    });
  });

  afterEach(() => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      writable: true,
      value: originalLocation,
    });
  });

  it('retorna false sin parámetros OAuth', () => {
    expect(isOAuthCallback()).toBe(false);
  });

  it('retorna true con access_token en el hash', () => {
    window.location.hash = '#access_token=eyJhb...';
    expect(isOAuthCallback()).toBe(true);
  });

  it('retorna true con code= en el query string', () => {
    window.location.search = '?code=abc123&state=xyz';
    expect(isOAuthCallback()).toBe(true);
  });

  it('retorna false para hash/query sin relevancia OAuth', () => {
    window.location.hash = '#section-1';
    window.location.search = '?page=2';
    expect(isOAuthCallback()).toBe(false);
  });
});

// ─── oauthUserToUser ──────────────────────────────────────────────────────────

const makeOAuthResult = (name: string | null, email: string): OAuthCallbackResult =>
  Object.freeze({
    user: Object.freeze({ id: 'uid-1', email, name, avatarUrl: null, provider: 'google' as const }),
    session: Object.freeze({ accessToken: 'tok', refreshToken: null, expiresAt: null, provider: 'google' as const }),
  });

describe('oauthUserToUser', () => {
  it('usa full_name como username cuando está disponible', () => {
    const result = oauthUserToUser(makeOAuthResult('Rick Sanchez', 'rick@c137.com'));
    expect(result.username).toBe('Rick Sanchez');
    expect(result.email).toBe('rick@c137.com');
    expect(result.id).toBe('uid-1');
  });

  it('usa la parte local del email cuando name es null', () => {
    const result = oauthUserToUser(makeOAuthResult(null, 'morty@c137.com'));
    expect(result.username).toBe('morty');
  });

  it('devuelve objeto congelado (inmutable)', () => {
    const result = oauthUserToUser(makeOAuthResult('Rick', 'rick@c137.com'));
    expect(() => {
      (result as unknown as Record<string, unknown>)['username'] = 'hacked';
    }).toThrow();
  });
});
