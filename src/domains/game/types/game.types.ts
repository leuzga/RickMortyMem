// ─── API ──────────────────────────────────────────────────────────────────────

export interface RickMortyCharacter {
  readonly id: number;
  readonly name: string;
  readonly image: string;
  readonly status: string;
  readonly species: string;
}

// ─── Game entities ────────────────────────────────────────────────────────────

export interface Card {
  readonly cardId: string;
  readonly characterId: number;
  readonly pairId: string;
  readonly image: string;
  readonly name: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export type GameStatus = 'idle' | 'initializing' | 'showing' | 'playing' | 'finished';

// ─── Store ────────────────────────────────────────────────────────────────────

export interface GameState {
  readonly cards: Card[];
  readonly firstCard: Card | null;
  readonly secondCard: Card | null;
  readonly turns: number;
  readonly matches: number;
  readonly isEvaluating: boolean;
  readonly gameStatus: GameStatus;
  readonly isLoading: boolean;
  readonly error: string | null;
  readonly previewTimeoutId: ReturnType<typeof setTimeout> | null;
  readonly evaluateTimeoutId: ReturnType<typeof setTimeout> | null;
}

export interface GameActions {
  initGame: () => Promise<void>;
  flipCard: (card: Card) => void;
  resetGame: () => void;
  clearError: () => void;
  setGameStatus: (status: GameStatus) => void;
  setCards: (cards: Card[]) => void;
  evaluateMatch: () => void;
}

export type GameStore = GameState & GameActions;

// ─── API response ─────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  readonly success: boolean;
  readonly data?: T;
  readonly error?: string;
}
