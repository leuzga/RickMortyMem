/**
 * Constantes de UI compartidas entre dominios.
 * Íconos, aria-labels y textos de interfaz genéricos.
 */

export const TOAST_ICONS = {
  success: '✓',
  error: '✕',
  warning: '⚠',
  info: 'ℹ',
} as const;

export const ARIA_LABELS = {
  TOAST_CLOSE: 'Cerrar notificación',
  HEADER_AVATAR: 'Menú de usuario',
  HEADER_MENU: 'Menú de opciones',
} as const;

export const TOAST_CLOSE_SYMBOL = '×';

export const HEADER_UI = {
  AVATAR_PATH: '/src/assets/images/avatar.png',
  AVATAR_ALT: 'Usuario',
  GUEST_ICON_LABEL: 'Invitado',
  MENU: {
    LOGIN: 'Iniciar sesión',
    LOGOUT: 'Cerrar sesión',
    LOGIN_ICON: '→',
    LOGOUT_ICON: '⎋',
  },
} as const;
