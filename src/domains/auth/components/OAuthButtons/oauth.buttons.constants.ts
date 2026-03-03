/**
 * Constantes de UI para los botones OAuth.
 * Evitamos SVG inline en el componente.
 */

import type { OAuthProvider } from '../../types/oauth.types';

export interface OAuthProviderMeta {
  readonly label: string;
  readonly ariaLabel: string;
  readonly icon: string;
}

/**
 * Lookup map de metadatos por proveedor.
 * Pattern matching: sin switch/if-else anidados.
 */
export const OAUTH_PROVIDER_META: Readonly<Record<OAuthProvider, OAuthProviderMeta>> =
  Object.freeze({
    google: Object.freeze({
      label: 'Continuar con Google',
      ariaLabel: 'Iniciar sesión con Google',
      icon: 'G',
    }),
    github: Object.freeze({
      label: 'Continuar con GitHub',
      ariaLabel: 'Iniciar sesión con GitHub',
      icon: '⌥',
    }),
  });

export const OAUTH_UI = Object.freeze({
  SEPARATOR_TEXT: 'o continúa con',
  LOADING_SUFFIX: '...',
  ERROR_PREFIX: 'Error OAuth',
} as const);
