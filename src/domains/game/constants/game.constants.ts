/**
 * Constantes del dominio game.
 * Centraliza mensajes, textos de UI, timings y configuración de API.
 */

// ─── API ──────────────────────────────────────────────────────────────────────

export const RICK_MORTY_API = {
  BASE_URL: 'https://rickandmortyapi.com/api/character',
  TOTAL_CHARACTERS: 826,
} as const;

// ─── Game config ──────────────────────────────────────────────────────────────

export const GAME_CONFIG = {
  PAIR_COUNT: 9,
  TOTAL_CARDS: 18,
  PREVIEW_DELAY_MS: 3000,
  FLIP_BACK_DELAY_MS: 1000,
  MAX_RETRIES: 3,
} as const;

// ─── Mensajes de negocio ──────────────────────────────────────────────────────

export const GAME_MESSAGES = {
  API: {
    ERROR: 'No se pudo conectar con el API de Rick and Morty',
    RETRY: 'Reintentando conexión...',
    UNAVAILABLE: 'El API de Rick and Morty no está disponible. Intenta más tarde.',
    TOO_MANY_REQUESTS: 'Demasiadas peticiones. Espera un momento e intenta de nuevo.',
    INVALID_RESPONSE: 'La respuesta del API no tiene el formato esperado',
    INSUFFICIENT_CHARACTERS: 'No se obtuvieron suficientes personajes del API',
  },
  GAME: {
    LOADING: 'Cargando personajes...',
    MATCH: '¡Par encontrado!',
    NO_MATCH: 'No coincide, intenta de nuevo',
    WIN: '¡Felicidades! Encontraste todos los pares',
    WIN_SUBTITLE: 'Has completado el juego en',
    WIN_TURNS_LABEL: 'turnos',
  },
} as const;

// ─── Textos de UI ─────────────────────────────────────────────────────────────

export const GAME_UI = {
  BOARD: {
    TITLE: 'Rick & Morty Memory',
    SUBTITLE: 'Encuentra todos los pares',
  },
  STATS: {
    TURNS_LABEL: 'Turnos',
    MATCHES_LABEL: 'Pares',
  },
  CARD: {
    BACK_ALT: 'Carta boca abajo',
    ARIA_LABEL_FLIPPED: (name: string) => `Carta de ${name}, emparejada`,
    ARIA_LABEL_HIDDEN: 'Carta oculta, haz clic para revelar',
    ARIA_LABEL_MATCHED: (name: string) => `Par encontrado: ${name}`,
  },
  BUTTONS: {
    PLAY_AGAIN: 'Jugar de nuevo',
    HOME: 'Inicio',
    RETRY: 'Reintentar',
  },
  VICTORY: {
    TITLE: '¡Ganaste! 🎉',
    HEADING: 'Misión cumplida, Rick',
  },
} as const;
