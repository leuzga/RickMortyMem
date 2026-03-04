/**
 * Constantes de UI para los botones OAuth.
 * Evitamos SVG inline en el componente.
 */

import React from 'react';
import type { OAuthProvider } from '../../types/oauth.types';

export interface OAuthProviderMeta {
  readonly label: string;
  readonly ariaLabel: string;
  readonly icon: React.ReactNode;
}

const GoogleIcon: React.FC = () =>
  React.createElement(
    'svg',
    { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', width: '20', height: '20', 'aria-hidden': 'true' },
    React.createElement('path', { fill: '#4285F4', d: 'M23.111 11.235H12V14.71h6.41c-.267 1.41-1.077 2.614-2.28 3.42l-.128.083 3.328 2.583.153-.105a11.956 11.956 0 0 0 3.627-7.904 11.94 11.94 0 0 0-.2-2.31z' }),
    React.createElement('path', { fill: '#EA4335', d: 'M12 4.148a7.863 7.863 0 0 1 5.56 2.227l.08.077 2.6-2.6-.088-.088A11.956 11.956 0 0 0 12 0C6.611 0 2.053 3.565.485 8.441l.1.054 3.754 1.487.114-.076a7.857 7.857 0 0 1 7.546-5.758z' }),
    React.createElement('path', { fill: '#34A853', d: 'M12 19.852a7.857 7.857 0 0 1-7.558-5.746l-.116-.076-3.8 1.47-.1.056C2.006 20.444 6.579 24 12 24c3.273 0 6.014-1.096 8.163-3l.123-.08-3.323-2.58-.124.083a7.87 7.87 0 0 1-4.839 1.429z' }),
    React.createElement('path', { fill: '#FBBC05', d: 'M.485 8.44C.17 9.56 0 10.75 0 12c0 1.25.17 2.43.486 3.551l3.766-1.464c-.1-.36-.152-.736-.152-1.087 0-.36.052-.728.152-1.087L.485 8.44z' }),
  );

const GitHubIcon: React.FC = () =>
  React.createElement(
    'svg',
    { xmlns: 'http://www.w3.org/2000/svg', width: '20', height: '20', viewBox: '0 0 24 24', 'aria-hidden': 'true' },
    React.createElement('path', { fill: 'currentColor', d: 'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.042-1.416-4.042-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z' }),
  );

/**
 * Lookup map de metadatos por proveedor.
 * Pattern matching: sin switch/if-else anidados.
 */
export const OAUTH_PROVIDER_META: Readonly<Record<OAuthProvider, OAuthProviderMeta>> =
  Object.freeze({
    google: Object.freeze({
      label: 'Continuar con Google',
      ariaLabel: 'Iniciar sesión con Google',
      icon: React.createElement(GoogleIcon),
    }),
    github: Object.freeze({
      label: 'Continuar con GitHub',
      ariaLabel: 'Iniciar sesión con GitHub',
      icon: React.createElement(GitHubIcon),
    }),
  });

export const OAUTH_UI = Object.freeze({
  SEPARATOR_TEXT: 'o continúa con',
  LOADING_SUFFIX: '...',
  ERROR_PREFIX: 'Error OAuth',
} as const);
