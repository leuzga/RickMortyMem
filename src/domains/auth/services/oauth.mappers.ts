/**
 * OAuth Mappers — funciones puras de transformación.
 *
 * Responsabilidad única: mapear tipos de Supabase a tipos del dominio OAuth.
 * Sin efectos secundarios. 100% testeables en aislamiento.
 */

import type { User, Session } from '@supabase/supabase-js';
import type {
  OAuthProvider,
  OAuthUser,
  OAuthSession,
  OAuthCallbackResult,
  OAuthResult,
} from '../types/oauth.types';
import { isOAuthProvider } from '../types/oauth.types';

/**
 * Mapea un User de Supabase a OAuthUser inmutable del dominio.
 */
export const mapSupabaseUserToOAuthUser = (
  user: User,
  provider: OAuthProvider
): OAuthResult<OAuthUser> => {
  if (!user.email) {
    return { success: false, error: 'El proveedor OAuth no devolvió un email válido' };
  }

  return {
    success: true,
    data: Object.freeze({
      id: user.id,
      email: user.email,
      name: (user.user_metadata?.['full_name'] as string | null) ?? null,
      avatarUrl: (user.user_metadata?.['avatar_url'] as string | null) ?? null,
      provider,
    }),
  };
};

/**
 * Mapea una Session de Supabase a OAuthSession inmutable del dominio.
 */
export const mapSupabaseSessionToOAuthSession = (
  session: Session,
  provider: OAuthProvider
): OAuthResult<OAuthSession> => {
  if (!session.access_token) {
    return { success: false, error: 'La sesión OAuth no contiene un access token válido' };
  }

  return {
    success: true,
    data: Object.freeze({
      accessToken: session.access_token,
      refreshToken: session.refresh_token ?? null,
      expiresAt: session.expires_at ?? null,
      provider,
    }),
  };
};

/**
 * Valida y combina user + session en un OAuthCallbackResult.
 */
export const validateOAuthCallbackResult = (
  user: User | null,
  session: Session | null
): OAuthResult<OAuthCallbackResult> => {
  if (!user || !session) {
    return { success: false, error: 'Sesión OAuth inválida o expirada' };
  }

  const rawProvider = user.app_metadata?.['provider'];
  const provider: OAuthProvider = isOAuthProvider(rawProvider) ? rawProvider : 'google';

  const userResult = mapSupabaseUserToOAuthUser(user, provider);
  if (!userResult.success) return userResult;

  const sessionResult = mapSupabaseSessionToOAuthSession(session, provider);
  if (!sessionResult.success) return sessionResult;

  return {
    success: true,
    data: Object.freeze({ user: userResult.data, session: sessionResult.data }),
  };
};
