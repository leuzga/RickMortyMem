/**
 * Tipos del dominio OAuth.
 * Todos los objetos son readonly para garantizar inmutabilidad.
 */

// ─── Providers ────────────────────────────────────────────────────────────────

export type OAuthProvider = 'google' | 'github';

export const OAUTH_PROVIDERS = ['google', 'github'] as const satisfies readonly OAuthProvider[];

// ─── Entidades inmutables ─────────────────────────────────────────────────────

export interface OAuthUser {
  readonly id: string;
  readonly email: string;
  readonly name: string | null;
  readonly avatarUrl: string | null;
  readonly provider: OAuthProvider;
}

export interface OAuthSession {
  readonly accessToken: string;
  readonly refreshToken: string | null;
  readonly expiresAt: number | null;
  readonly provider: OAuthProvider;
}

export interface OAuthCallbackResult {
  readonly user: OAuthUser;
  readonly session: OAuthSession;
}

// ─── Result type (pattern matching safe) ─────────────────────────────────────

export type OAuthResult<T> =
  | { readonly success: true; readonly data: T }
  | { readonly success: false; readonly error: string };

// ─── Type guards ──────────────────────────────────────────────────────────────

export const isOAuthProvider = (value: unknown): value is OAuthProvider =>
  value === 'google' || value === 'github';

export const isOAuthUser = (value: unknown): value is OAuthUser => {
  if (typeof value !== 'object' || value === null) return false;
  const obj = value as Record<string, unknown>;
  return (
    typeof obj['id'] === 'string' &&
    typeof obj['email'] === 'string' &&
    (obj['name'] === null || typeof obj['name'] === 'string') &&
    (obj['avatarUrl'] === null || typeof obj['avatarUrl'] === 'string') &&
    isOAuthProvider(obj['provider'])
  );
};
