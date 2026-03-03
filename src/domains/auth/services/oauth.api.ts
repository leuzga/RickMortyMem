/**
 * OAuth Service — efectos secundarios con Supabase.
 *
 * Responsabilidad única: comunicación con el proveedor OAuth (Supabase).
 * Todas las transformaciones de tipos se delegan a oauth.mappers.ts.
 */

import { supabase } from '../../../shared/services/supabase.client';
import type { OAuthProvider, OAuthCallbackResult, OAuthResult } from '../types/oauth.types';
import { validateOAuthCallbackResult } from './oauth.mappers';

// ─── Lookup map de configuración por proveedor ────────────────────────────────

const PROVIDER_REDIRECT: Readonly<Record<OAuthProvider, string>> = Object.freeze({
  google: `${window.location.origin}/`,
  github: `${window.location.origin}/`,
});

// ─── Impure: Supabase calls ───────────────────────────────────────────────────

/**
 * Redirige al proveedor OAuth.
 * Efecto secundario: cambia la URL del browser.
 */
export const signInWithOAuth = async (provider: OAuthProvider): Promise<OAuthResult<void>> => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo: PROVIDER_REDIRECT[provider] },
  });

  return error
    ? { success: false, error: error.message }
    : { success: true, data: undefined };
};

/**
 * Procesa el callback OAuth tras el redirect.
 * Lee la sesión activa y la mapea a tipos del dominio vía oauth.mappers.
 */
export const handleOAuthCallback = async (): Promise<OAuthResult<OAuthCallbackResult>> => {
  const { data, error } = await supabase.auth.getSession();

  if (error) return { success: false, error: error.message };

  return validateOAuthCallbackResult(data.session?.user ?? null, data.session);
};

/**
 * Cierra la sesión OAuth en Supabase.
 */
export const signOutOAuth = async (): Promise<OAuthResult<void>> => {
  const { error } = await supabase.auth.signOut();

  return error
    ? { success: false, error: error.message }
    : { success: true, data: undefined };
};
