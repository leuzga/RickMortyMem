import React from 'react';
import { useAuthStore } from '../../../../domains/auth/store/useAuthStore';
import { GAME_UI, GAME_MESSAGES } from '../../constants/game.constants';
import { GAME_CONFIG } from '../../constants/game.constants';
import './VictoryModal.css';

interface VictoryModalProps {
  readonly turns: number;
  readonly onPlayAgain: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({ turns, onPlayAgain }) => {
  const { logout } = useAuthStore();

  const handleHome = (): void => {
    void logout();
  };

  return (
    <div className="victory-modal" role="dialog" aria-modal="true" aria-labelledby="victory-title">
      <div className="victory-modal__backdrop" aria-hidden="true" />
      <div className="victory-modal__card">
        <div className="victory-modal__confetti" aria-hidden="true">
          {['🎉', '🧪', '🛸', '⚡', '🌀'].map((emoji, i) => (
            <span key={i} className="victory-modal__confetti-item" style={{ '--i': i } as React.CSSProperties}>
              {emoji}
            </span>
          ))}
        </div>

        <h2 id="victory-title" className="victory-modal__title">{GAME_UI.VICTORY.TITLE}</h2>
        <p className="victory-modal__heading">{GAME_UI.VICTORY.HEADING}</p>

        <div className="victory-modal__score">
          <span className="victory-modal__score-label">{GAME_MESSAGES.GAME.WIN_SUBTITLE}</span>
          <span className="victory-modal__score-value">{turns}</span>
          <span className="victory-modal__score-label">{GAME_MESSAGES.GAME.WIN_TURNS_LABEL}</span>
        </div>

        <div className="victory-modal__score">
          <span className="victory-modal__score-label">Pares encontrados:</span>
          <span className="victory-modal__score-value">{GAME_CONFIG.PAIR_COUNT} / {GAME_CONFIG.PAIR_COUNT}</span>
        </div>

        <div className="victory-modal__actions">
          <button
            id="play-again-btn"
            className="victory-modal__btn victory-modal__btn--primary"
            onClick={onPlayAgain}
          >
            {GAME_UI.BUTTONS.PLAY_AGAIN}
          </button>
          <button
            id="home-btn"
            className="victory-modal__btn victory-modal__btn--secondary"
            onClick={handleHome}
          >
            {GAME_UI.BUTTONS.HOME}
          </button>
        </div>
      </div>
    </div>
  );
};
