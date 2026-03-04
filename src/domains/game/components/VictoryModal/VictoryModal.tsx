import React, { useCallback, memo } from 'react';
import { useAuthStore } from '../../../../domains/auth/store/useAuthStore';
import { GAME_UI, GAME_MESSAGES } from '../../constants/game.constants';
import { GAME_CONFIG } from '../../constants/game.constants';
import styles from './VictoryModal.module.css';

interface VictoryModalProps {
  readonly turns: number;
  readonly onPlayAgain: () => void;
}

const VictoryModalBase: React.FC<VictoryModalProps> = ({ turns, onPlayAgain }) => {
  const { logout } = useAuthStore();

  const handleHome = useCallback((): void => {
    void logout();
  }, [logout]);

  return (
    <div className={styles.victoryModal} role="dialog" aria-modal="true" aria-labelledby="victory-title">
      <div className={styles.victoryModalBackdrop} aria-hidden="true" />
      <div className={styles.victoryModalCard}>
        <div className={styles.victoryModalConfetti} aria-hidden="true">
          {['🎉', '🧪', '🛸', '⚡', '🌀'].map((emoji, i) => (
            <span key={i} className={styles.victoryModalConfettiItem} style={{ '--i': i } as React.CSSProperties}>
              {emoji}
            </span>
          ))}
        </div>

        <h2 id="victory-title" className={styles.victoryModalTitle}>{GAME_UI.VICTORY.TITLE}</h2>
        <p className={styles.victoryModalHeading}>{GAME_UI.VICTORY.HEADING}</p>

        <div className={styles.victoryModalScore}>
          <span className={styles.victoryModalScoreLabel}>{GAME_MESSAGES.GAME.WIN_SUBTITLE}</span>
          <span className={styles.victoryModalScoreValue}>{turns}</span>
          <span className={styles.victoryModalScoreLabel}>{GAME_MESSAGES.GAME.WIN_TURNS_LABEL}</span>
        </div>

        <div className={styles.victoryModalScore}>
          <span className={styles.victoryModalScoreLabel}>Pares encontrados:</span>
          <span className={styles.victoryModalScoreValue}>{GAME_CONFIG.PAIR_COUNT} / {GAME_CONFIG.PAIR_COUNT}</span>
        </div>

        <div className={styles.victoryModalActions}>
          <button
            id="play-again-btn"
            className={`${styles.victoryModalBtn} ${styles.victoryModalBtnPrimary}`}
            onClick={onPlayAgain}
          >
            {GAME_UI.BUTTONS.PLAY_AGAIN}
          </button>
          <button
            id="home-btn"
            className={`${styles.victoryModalBtn} ${styles.victoryModalBtnSecondary}`}
            onClick={handleHome}
          >
            {GAME_UI.BUTTONS.HOME}
          </button>
        </div>
      </div>
    </div>
  );
};

export const VictoryModal = memo(VictoryModalBase);
