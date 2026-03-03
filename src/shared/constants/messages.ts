/**
 * Constantes de mensajes para toda la aplicación.
 * Centraliza todos los mensajes de usuario para mantener consistencia.
 */

export const MESSAGES = {
  // Juego
  GAME: {
    START: '¡Juego iniciado!',
    PAUSE: 'Juego pausado',
    RESUME: 'Juego reanudado',
    WIN: '¡Felicidades! Has ganado',
    LOSE: '¡Tiempo agotado! Inténtalo de nuevo',
    MATCH: '¡Par encontrado!',
    NO_MATCH: 'No coincide, intenta de nuevo',
    SCORE_UPDATE: 'Puntuación actualizada',
    TIME_WARNING: '¡Te quedan 10 segundos!',
    // API errors (domain game)
    API_ERROR: 'No se pudo conectar con el API de Rick and Morty',
    API_RETRY: 'Reintentando conexión con el API...',
    API_UNAVAILABLE: 'El API de Rick and Morty no está disponible. Intenta más tarde.',
    API_RATE_LIMIT: 'Demasiadas peticiones. Espera un momento e intenta de nuevo.',
    LOADING_CHARACTERS: 'Cargando personajes...',
  },

  // Errores generales
  GENERAL: {
    ERROR: 'Ha ocurrido un error',
    NETWORK_ERROR: 'Error de conexión',
    SERVER_ERROR: 'Error del servidor',
    NOT_FOUND: 'Recurso no encontrado',
    UNAUTHORIZED: 'No autorizado',
    FORBIDDEN: 'Acceso denegado',
    VALIDATION_ERROR: 'Error de validación',
    UNKNOWN_ERROR: 'Error desconocido',
    LOADING: 'Cargando...',
    SUCCESS: 'Operación exitosa',
  },

  // UI/UX
  UI: {
    SAVING: 'Guardando...',
    SAVED: 'Guardado exitosamente',
    DELETING: 'Eliminando...',
    DELETED: 'Eliminado exitosamente',
    UPDATING: 'Actualizando...',
    UPDATED: 'Actualizado exitosamente',
    COPYING: 'Copiando...',
    COPIED: 'Copiado al portapapeles',
    DOWNLOADING: 'Descargando...',
    DOWNLOADED: 'Descargado exitosamente',
  },

  // Formularios genéricos
  FORMS: {
    REQUIRED: 'Este campo es obligatorio',
    INVALID_FORMAT: 'Formato inválido',
    TOO_SHORT: 'Demasiado corto',
    TOO_LONG: 'Demasiado largo',
    INVALID_EMAIL: 'Email inválido',
    INVALID_PHONE: 'Teléfono inválido',
    INVALID_URL: 'URL inválida',
    PASSWORD_WEAK: 'Contraseña muy débil',
    PASSWORD_STRONG: 'Contraseña fuerte',
  },

  // App principal
  APP: {
    WELCOME_HEADING: '¡BIENVENIDO,',
    WELCOME_SUBTITLE: 'Pronto comenzaremos con el juego de Rick and Morty...',
  },
} as const;
