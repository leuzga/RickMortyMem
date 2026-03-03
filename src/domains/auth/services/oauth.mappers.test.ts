/**
 * Tests de oauth.mappers.ts — funciones puras de transformación OAuth.
 */

import { describe, it, expect, vi } from 'vitest';
import type { User, Session } from '@supabase/supabase-js';

vi.mock('../../../shared/services/supabase.client', () => ({
  supabase: { auth: { signInWithOAuth: vi.fn(), signOut: vi.fn(), getSession: vi.fn() } },
}));

import {
  mapSupabaseUserToOAuthUser,
  mapSupabaseSessionToOAuthSession,
  validateOAuthCallbackResult,
} from './oauth.mappers';

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const mockUser = Object.freeze({
  id: 'user-abc-123',
  email: 'rick@c137.com',
  app_metadata: { provider: 'google' },
  user_metadata: { full_name: 'Rick Sanchez', avatar_url: 'https://cdn.avatar/rick.jpg' },
} as unknown as User);

const mockUserNoEmail = Object.freeze({ ...mockUser, email: undefined } as unknown as User);
const mockUserGithub = Object.freeze({ ...mockUser, app_metadata: { provider: 'github' } } as unknown as User);

const mockSession = Object.freeze({
  access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test',
  refresh_token: 'refresh-token-abc',
  expires_at: 1999999999,
  user: mockUser,
} as unknown as Session);

const mockSessionNoToken = Object.freeze({ ...mockSession, access_token: '' } as unknown as Session);

// ─── mapSupabaseUserToOAuthUser ───────────────────────────────────────────────

describe('mapSupabaseUserToOAuthUser', () => {
  it('retorna OAuthUser válido para Google', () => {
    const result = mapSupabaseUserToOAuthUser(mockUser, 'google');
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.id).toBe('user-abc-123');
    expect(result.data.email).toBe('rick@c137.com');
    expect(result.data.name).toBe('Rick Sanchez');
    expect(result.data.avatarUrl).toBe('https://cdn.avatar/rick.jpg');
    expect(result.data.provider).toBe('google');
  });

  it('retorna OAuthUser válido para GitHub', () => {
    const result = mapSupabaseUserToOAuthUser(mockUserGithub, 'github');
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.provider).toBe('github');
  });

  it('retorna error si el usuario no tiene email', () => {
    const result = mapSupabaseUserToOAuthUser(mockUserNoEmail, 'google');
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.error).toContain('email');
  });

  it('devuelve objeto congelado (inmutable)', () => {
    const result = mapSupabaseUserToOAuthUser(mockUser, 'google');
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(() => { (result.data as unknown as Record<string, unknown>)['email'] = 'hacked'; }).toThrow();
  });

  it('retorna null en name si user_metadata no tiene full_name', () => {
    const userNoName = { ...mockUser, user_metadata: {} } as unknown as User;
    const result = mapSupabaseUserToOAuthUser(userNoName, 'google');
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.name).toBeNull();
  });
});

// ─── mapSupabaseSessionToOAuthSession ────────────────────────────────────────

describe('mapSupabaseSessionToOAuthSession', () => {
  it('mapea correctamente una sesión válida', () => {
    const result = mapSupabaseSessionToOAuthSession(mockSession, 'google');
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.accessToken).toBe(mockSession.access_token);
    expect(result.data.refreshToken).toBe(mockSession.refresh_token);
    expect(result.data.expiresAt).toBe(mockSession.expires_at);
    expect(result.data.provider).toBe('google');
  });

  it('retorna error si access_token está vacío', () => {
    const result = mapSupabaseSessionToOAuthSession(mockSessionNoToken, 'google');
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.error).toContain('access token');
  });

  it('devuelve objeto congelado', () => {
    const result = mapSupabaseSessionToOAuthSession(mockSession, 'github');
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(() => { (result.data as unknown as Record<string, unknown>)['accessToken'] = 'hacked'; }).toThrow();
  });
});

// ─── validateOAuthCallbackResult ─────────────────────────────────────────────

describe('validateOAuthCallbackResult', () => {
  it('retorna OAuthCallbackResult cuando user y session son válidos', () => {
    const result = validateOAuthCallbackResult(mockUser, mockSession);
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.user.email).toBe('rick@c137.com');
    expect(result.data.session.accessToken).toBe(mockSession.access_token);
  });

  it('retorna error si user es null', () => {
    expect(validateOAuthCallbackResult(null, mockSession).success).toBe(false);
  });

  it('retorna error si session es null', () => {
    expect(validateOAuthCallbackResult(mockUser, null).success).toBe(false);
  });

  it('retorna error si ambos son null', () => {
    const result = validateOAuthCallbackResult(null, null);
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.error).toContain('inválida');
  });

  it('usa "google" como provider por defecto si app_metadata.provider es desconocido', () => {
    const userUnknown = { ...mockUser, app_metadata: { provider: 'unknown' } } as unknown as User;
    const result = validateOAuthCallbackResult(userUnknown, mockSession);
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.user.provider).toBe('google');
  });
});
