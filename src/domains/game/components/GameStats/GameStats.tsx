import React from 'react';
import { GAME_UI } from '../../constants/game.constants';
import './GameStats.css';

interface GameStatsProps {
  readonly turns: number;
  readonly matches: number;
  readonly totalPairs: number;
}

export const GameStats: React.FC<GameStatsProps> = ({ turns, matches, totalPairs }) => (
  <div className="game-stats" aria-live="polite" aria-label="Estadísticas del juego">
    <div className="game-stats__item">
      <span className="game-stats__value" id="turns-value">{turns}</span>
      <span className="game-stats__label">{GAME_UI.STATS.TURNS_LABEL}</span>
    </div>
    <div className="game-stats__divider" aria-hidden="true" />
    <div className="game-stats__item">
      <span className="game-stats__value" id="matches-value">{matches}</span>
      <span className="game-stats__label">{`${GAME_UI.STATS.MATCHES_LABEL}/${totalPairs}`}</span>
    </div>
  </div>
);
