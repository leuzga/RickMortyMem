import React from 'react';
import { useGameBoard } from '../../hooks/useGameBoard';
import { CardsGrid } from '../CardsGrid/CardsGrid';
import { GameStats } from '../GameStats/GameStats';
import { VictoryModal } from '../VictoryModal/VictoryModal';
import { GAME_UI, GAME_CONFIG } from '../../constants/game.constants';
import './GameBoard.css';

export const GameBoard: React.FC = () => {
  const {
    cards,
    turns,
    matches,
    gameStatus,
    isLoading,
    error,
    handleCardClick,
    handlePlayAgain,
    handleRetry,
  } = useGameBoard();

  if (isLoading) {
    return (
      <div className="game-board game-board--center" aria-live="polite" role="status">
        <div className="game-board__spinner" aria-hidden="true" />
        <p className="game-board__status-text">{GAME_UI.BOARD.SUBTITLE}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="game-board game-board--center" aria-live="assertive" role="alert">
        <span className="game-board__error-icon" aria-hidden="true">🛸</span>
        <p className="game-board__status-text">{error}</p>
        <button
          id="retry-btn"
          className="game-board__retry-btn"
          onClick={handleRetry}
        >
          {GAME_UI.BUTTONS.RETRY}
        </button>
      </div>
    );
  }

  return (
    <div className="game-board">
      <header className="game-board__header">
        <h1 className="game-board__title">{GAME_UI.BOARD.TITLE}</h1>
        <GameStats turns={turns} matches={matches} totalPairs={GAME_CONFIG.PAIR_COUNT} />
      </header>

      <main className="game-board__main">
        <CardsGrid cards={cards} onCardClick={handleCardClick} />
      </main>

      {gameStatus === 'finished' && (
        <VictoryModal turns={turns} onPlayAgain={handlePlayAgain} />
      )}
    </div>
  );
};
