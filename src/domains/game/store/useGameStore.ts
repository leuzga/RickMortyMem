import { create } from 'zustand';
import type { GameStore, Card, GameStatus } from '../types/game.types';
import { fetchCharacters } from '../services/rickmorty.api';
import { generateCharacterIds, createCards, shuffleCards, isMatch } from '../utils/game.utils';
import { GAME_CONFIG } from '../constants/game.constants';

// ─── Initial state ────────────────────────────────────────────────────────────

const initialState = {
  cards: [] as Card[],
  firstCard: null as Card | null,
  secondCard: null as Card | null,
  turns: 0,
  matches: 0,
  isEvaluating: false,
  gameStatus: 'idle' as GameStatus,
  isLoading: false,
  error: null as string | null,
  previewTimeoutId: null as ReturnType<typeof setTimeout> | null,
  evaluateTimeoutId: null as ReturnType<typeof setTimeout> | null,
};

// ─── Store ────────────────────────────────────────────────────────────────────

export const useGameStore = create<GameStore>((set, get) => ({
  ...initialState,

  clearError: () => set((prev) => ({ ...prev, error: null })),

  /**
   * Inicia el juego: API call → crea cartas → preview 3s → playing.
   */
  initGame: async () => {
    const { previewTimeoutId, evaluateTimeoutId } = get();
    if (previewTimeoutId) clearTimeout(previewTimeoutId);
    if (evaluateTimeoutId) clearTimeout(evaluateTimeoutId);

    set((prev) => ({ ...prev, ...initialState, isLoading: true, gameStatus: 'initializing' }));

    const ids = generateCharacterIds();
    const response = await fetchCharacters(ids);

    if (!response.success || !response.data) {
      set((prev) => ({
        ...prev,
        isLoading: false,
        error: response.error ?? 'Error desconocido',
        gameStatus: 'idle',
      }));
      return;
    }

    const rawCards = createCards(response.data);
    const shuffled = shuffleCards(rawCards);
    // Start with shuffling animation (cards face down)
    const faceDown: Card[] = shuffled.map((c) => ({ ...c, isFlipped: false }));

    set((prev) => ({
      ...prev,
      cards: faceDown,
      isLoading: false,
      gameStatus: 'shuffling',
    }));

    // After shuffle animation, show cards face-up
    const shuffleTimeoutId = setTimeout(() => {
      const faceUp: Card[] = get().cards.map((c) => ({ ...c, isFlipped: true }));
      set((prev) => ({ ...prev, cards: faceUp, gameStatus: 'showing' }));

      // After preview, flip all down and enable play
      const previewTimeoutId = setTimeout(() => {
        const faceDown: Card[] = get().cards.map((c) => ({
          ...c,
          isFlipped: false,
        }));
        set((prev) => ({ ...prev, cards: faceDown, gameStatus: 'playing', previewTimeoutId: null }));
      }, GAME_CONFIG.PREVIEW_DELAY_MS);

      set((prev) => ({ ...prev, previewTimeoutId }));
    }, GAME_CONFIG.SHUFFLE_ANIMATION_MS);

    set((prev) => ({ ...prev, previewTimeoutId: shuffleTimeoutId }));
  },

  /**
   * Handles card selection logic.
   * First card: flip and store. Second card: flip, check match, update counters.
   */
  flipCard: (card: Card) => {
    const { firstCard, isEvaluating, gameStatus, cards } = get();

    if (gameStatus !== 'playing' || isEvaluating || card.isMatched || card.isFlipped) return;
    if (firstCard && firstCard.cardId === card.cardId) return;

    const flipInCards = (c: Card): Card =>
      c.cardId === card.cardId ? { ...c, isFlipped: true } : c;

    if (!firstCard) {
      set((prev) => ({
        ...prev,
        cards: prev.cards.map(flipInCards),
        firstCard: { ...card, isFlipped: true },
      }));
      return;
    }

    // Second card selected
    const flippedCards = cards.map(flipInCards);
    const secondCard: Card = { ...card, isFlipped: true };

    set((prev) => ({
      ...prev,
      cards: flippedCards,
      secondCard,
      isEvaluating: true,
      turns: prev.turns + 1,
    }));

    const timeoutId = setTimeout(() => {
      get().evaluateMatch();
    }, GAME_CONFIG.FLIP_BACK_DELAY_MS);

    set((prev) => ({ ...prev, evaluateTimeoutId: timeoutId }));
  },

  /**
   * Evaluates a match between firstCard and secondCard. Called by timer.
   */
  evaluateMatch: () => {
    const { firstCard, secondCard, cards } = get();

    if (!firstCard || !secondCard) return;

    const matched = isMatch(firstCard, secondCard);

    const updatedCards: Card[] = cards.map((c) => {
      if (c.cardId === firstCard.cardId || c.cardId === secondCard.cardId) {
        return matched
          ? { ...c, isMatched: true, isFlipped: true }
          : { ...c, isFlipped: false };
      }
      return c;
    });

    const newMatches = matched ? get().matches + 1 : get().matches;
    const isFinished = newMatches === GAME_CONFIG.PAIR_COUNT;

    set((prev) => ({
      ...prev,
      cards: updatedCards,
      firstCard: null,
      secondCard: null,
      isEvaluating: false,
      matches: newMatches,
      gameStatus: isFinished ? 'finished' : 'playing',
      evaluateTimeoutId: null,
    }));
  },

  /**
   * Resets the game and fetches new characters.
   */
  resetGame: () => {
    void get().initGame();
  },
}));
