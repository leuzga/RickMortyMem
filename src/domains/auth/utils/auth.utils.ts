/**
 * Auth Utils — funciones puras del dominio de autenticación.
 *
 * Responsabilidad única: lógica de utilidad pura para el flujo auth.
 * Sin efectos secundarios. Sin dependencias del DOM salvo `isOAuthCallback`.
 */

import type { User } from '../types/auth.types';
import type { OAuthCallbackResult } from '../types/oauth.types';
import { AUTH_UI } from '../constants/auth.constants';

// ─── Tipos de dominio ─────────────────────────────────────────────────────────

export type ActiveForm = 'login' | 'register' | 'forgot-password';

// ─── Lookup map: ActiveForm → título de layout ────────────────────────────────

const FORM_TITLES: Readonly<Record<ActiveForm, string>> = Object.freeze({
  login: AUTH_UI.LAYOUT.DEFAULT_TITLE,
  register: AUTH_UI.LAYOUT.REGISTER_TITLE,
  'forgot-password': AUTH_UI.LAYOUT.FORGOT_PASSWORD_TITLE,
});

/**
 * Retorna el título del AuthLayout según el formulario activo.
 * Pure: sin efectos secundarios.
 */
export const getLayoutTitle = (activeForm: ActiveForm): string => FORM_TITLES[activeForm];

// ─── URL detection ────────────────────────────────────────────────────────────

/**
 * Detecta si la URL actual es un callback OAuth de Supabase.
 * Pure respecto al estado de la app; lee window.location.
 */
export const isOAuthCallback = (): boolean =>
  window.location.hash.includes('access_token') ||
  window.location.search.includes('code=');

// ─── OAuth → User mapper ──────────────────────────────────────────────────────

/**
 * Mapea un OAuthCallbackResult al tipo User del dominio de autenticación.
 * Pure: sin efectos secundarios, devuelve objeto congelado.
 */
export const oauthUserToUser = (oauthResult: OAuthCallbackResult): User =>
  Object.freeze({
    id: oauthResult.user.id,
    username: oauthResult.user.name ?? oauthResult.user.email.split('@')[0]!,
    email: oauthResult.user.email,
  });
