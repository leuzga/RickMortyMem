import { useEffect, useRef, useCallback } from 'react';
import { useGameStore } from '../store/useGameStore';
import type { Card } from '../types/game.types';

/**
 * Custom hook encapsulating all game board logic.
 * Auto-initializes on mount. Exposes card handler for UI.
 */
export const useGameBoard = () => {
  const initGame = useGameStore((s) => s.initGame);
  const flipCard = useGameStore((s) => s.flipCard);
  const resetGame = useGameStore((s) => s.resetGame);
  const clearError = useGameStore((s) => s.clearError);
  const cards = useGameStore((s) => s.cards);
  const turns = useGameStore((s) => s.turns);
  const matches = useGameStore((s) => s.matches);
  const gameStatus = useGameStore((s) => s.gameStatus);
  const isLoading = useGameStore((s) => s.isLoading);
  const error = useGameStore((s) => s.error);
  const isEvaluating = useGameStore((s) => s.isEvaluating);

  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      void initGame();
    }
    // cleanup: nothing to cancel here since timeouts live in the store
  }, [initGame]);

  const handleCardClick = useCallback(
    (card: Card): void => {
      if (isEvaluating) return;
      flipCard(card);
    },
    [flipCard, isEvaluating]
  );

  const handlePlayAgain = useCallback((): void => {
    resetGame();
  }, [resetGame]);

  const handleRetry = useCallback((): void => {
    clearError();
    void initGame();
  }, [clearError, initGame]);

  return {
    cards,
    turns,
    matches,
    gameStatus,
    isLoading,
    error,
    isEvaluating,
    handleCardClick,
    handlePlayAgain,
    handleRetry,
  };
};
