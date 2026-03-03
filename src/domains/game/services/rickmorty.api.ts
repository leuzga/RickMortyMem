import type { RickMortyCharacter, ApiResponse } from '../types/game.types';
import { RICK_MORTY_API, GAME_CONFIG, GAME_MESSAGES } from '../constants/game.constants';

// ─── Validators ───────────────────────────────────────────────────────────────

const isValidCharacter = (data: unknown): data is RickMortyCharacter => {
  if (!data || typeof data !== 'object') return false;
  const char = data as Record<string, unknown>;
  return (
    typeof char.id === 'number' &&
    typeof char.name === 'string' &&
    typeof char.image === 'string' &&
    char.name.length > 0 &&
    char.image.length > 0
  );
};

const validateCharacters = (data: unknown): RickMortyCharacter[] => {
  if (!Array.isArray(data)) {
    const single = data as unknown;
    if (isValidCharacter(single)) return [single];
    throw new Error(GAME_MESSAGES.API.INVALID_RESPONSE);
  }
  const valid = data.filter(isValidCharacter);
  if (valid.length < GAME_CONFIG.PAIR_COUNT) {
    throw new Error(GAME_MESSAGES.API.INSUFFICIENT_CHARACTERS);
  }
  return valid;
};

// ─── Fetch with retry ─────────────────────────────────────────────────────────

const fetchWithRetry = async (url: string, attempts: number): Promise<Response> => {
  let lastError: Error = new Error(GAME_MESSAGES.API.ERROR);
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(url);
      if (res.status === 429) throw new Error(GAME_MESSAGES.API.TOO_MANY_REQUESTS);
      if (!res.ok) throw new Error(`${GAME_MESSAGES.API.ERROR}: HTTP ${res.status}`);
      return res;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(GAME_MESSAGES.API.ERROR);
      if (i < attempts - 1) await new Promise<void>((r) => setTimeout(r, 500 * (i + 1)));
    }
  }
  throw lastError;
};

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Fetches multiple Rick & Morty characters by ID array.
 * Pure data layer with validation.
 */
export const fetchCharacters = async (
  ids: number[]
): Promise<ApiResponse<RickMortyCharacter[]>> => {
  try {
    const url = `${RICK_MORTY_API.BASE_URL}/${ids.join(',')}`;
    const res = await fetchWithRetry(url, GAME_CONFIG.MAX_RETRIES);
    const json: unknown = await res.json();
    const characters = validateCharacters(json);
    return { success: true, data: characters };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : GAME_MESSAGES.API.UNAVAILABLE,
    };
  }
};
