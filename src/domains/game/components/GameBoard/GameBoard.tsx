import React from 'react';
import { useGameBoard } from '../../hooks/useGameBoard';
import { CardsGrid } from '../CardsGrid/CardsGrid';
import { GameStats } from '../GameStats/GameStats';
import { VictoryModal } from '../VictoryModal/VictoryModal';
import { GAME_UI, GAME_CONFIG } from '../../constants/game.constants';
import styles from './GameBoard.module.css';

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
      <div className={`${styles.gameBoard} ${styles.gameBoardCenter}`} aria-live="polite" role="status">
        <div className={styles.gameBoardSpinner} aria-hidden="true" />
        <p className={styles.gameBoardStatusText}>{GAME_UI.BOARD.SUBTITLE}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${styles.gameBoard} ${styles.gameBoardCenter}`} aria-live="assertive" role="alert">
        <span className={styles.gameBoardErrorIcon} aria-hidden="true">🛸</span>
        <p className={styles.gameBoardStatusText}>{error}</p>
        <button
          id="retry-btn"
          className={styles.gameBoardRetryBtn}
          onClick={handleRetry}
        >
          {GAME_UI.BUTTONS.RETRY}
        </button>
      </div>
    );
  }

  return (
    <div className={styles.gameBoard}>
      <header className={styles.gameBoardHeader}>
        <h1 className={styles.gameBoardTitle}>{GAME_UI.BOARD.TITLE}</h1>
        <GameStats turns={turns} matches={matches} totalPairs={GAME_CONFIG.PAIR_COUNT} />
      </header>

      <main className={styles.gameBoardMain}>
        <CardsGrid
          cards={cards}
          onCardClick={handleCardClick}
          isShuffling={gameStatus === 'shuffling'}
        />
      </main>

      {gameStatus === 'finished' && (
        <VictoryModal turns={turns} onPlayAgain={handlePlayAgain} />
      )}
    </div>
  );
};
