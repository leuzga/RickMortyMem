/**
 * Constantes del dominio de autenticación.
 * Centraliza mensajes, textos de UI y valores de configuración.
 */

// ─── Mensajes de negocio (feedback al usuario) ───────────────────────────────

export const AUTH_MESSAGES = {
  LOGIN: {
    SUCCESS: '¡Inicio de sesión exitoso!',
    ERROR: 'Credenciales inválidas',
  },
  REGISTER: {
    SUCCESS: '¡Cuenta creada exitosamente!',
    ERROR: 'Error al crear cuenta',
  },
  LOGOUT: {
    SUCCESS: 'Sesión cerrada exitosamente',
  },
  FORGOT_PASSWORD: {
    EMAIL_NOT_FOUND: 'No se encontró ninguna cuenta con ese email',
    SUCCESS: '¡Contraseña actualizada exitosamente!',
    ERROR: 'No se pudo actualizar la contraseña',
  },
} as const;

// ─── Textos de UI de los componentes ─────────────────────────────────────────

export const AUTH_UI = {
  LAYOUT: {
    GAME_TITLE: 'Memory Game',
    GAME_SUBTITLE: 'Rick and Morty Edition',
    LOGO_PATH: '/src/assets/images/RMlogo.png',
    LOGO_ALT: 'Memory Game Logo',
    DEFAULT_TITLE: 'Hello, welcome!',
    REGISTER_TITLE: 'Create Account',
    FORGOT_PASSWORD_TITLE: '¿Olvidó su contraseña?',
  },
  LOGIN: {
    EMAIL_LABEL: 'Email address',
    EMAIL_PLACEHOLDER: 'name@mail.com',
    PASSWORD_LABEL: 'Password',
    PASSWORD_PLACEHOLDER: '••••••••',
    REMEMBER_ME_LABEL: 'Remember me',
    FORGOT_PASSWORD_LINK: 'Forget password?',
    SUBMIT_BUTTON: 'Login',
    SUBMIT_LOADING: 'Signing in...',
    REGISTER_BUTTON: 'Sign up',
  },
  REGISTER: {
    USERNAME_LABEL: 'Username',
    USERNAME_PLACEHOLDER: 'username123',
    EMAIL_LABEL: 'Email address',
    EMAIL_PLACEHOLDER: 'name@mail.com',
    PASSWORD_LABEL: 'Password',
    PASSWORD_PLACEHOLDER: '••••••••',
    SUBMIT_BUTTON: 'Sign up',
    SUBMIT_LOADING: 'Creating account...',
    LOGIN_BUTTON: 'Login',
  },
  FORGOT_PASSWORD: {
    SUBTITLE: 'Ingresá tu email y establecé una nueva contraseña.',
    EMAIL_LABEL: 'Tu email registrado',
    EMAIL_PLACEHOLDER: 'name@mail.com',
    NEW_PASSWORD_LABEL: 'Nueva contraseña',
    NEW_PASSWORD_PLACEHOLDER: '••••••••',
    SUBMIT_BUTTON: 'Cambiar contraseña',
    SUBMIT_LOADING: 'Actualizando...',
    BACK_TO_LOGIN: 'Volver al login',
  },
} as const;
