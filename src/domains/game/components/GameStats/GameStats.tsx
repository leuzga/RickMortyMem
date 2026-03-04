import React, { memo } from 'react';
import { GAME_UI } from '../../constants/game.constants';
import styles from './GameStats.module.css';

interface GameStatsProps {
  readonly turns: number;
  readonly matches: number;
  readonly totalPairs: number;
}

const GameStatsBase: React.FC<GameStatsProps> = ({ turns, matches, totalPairs }) => (
  <div className={styles.gameStats} aria-live="polite" aria-label="Estadísticas del juego">
    <div className={styles.gameStatsItem}>
      <span className={styles.gameStatsValue} id="turns-value">{turns}</span>
      <span className={styles.gameStatsLabel}>{GAME_UI.STATS.TURNS_LABEL}</span>
    </div>
    <div className={styles.gameStatsDivider} aria-hidden="true" />
    <div className={styles.gameStatsItem}>
      <span className={styles.gameStatsValue} id="matches-value">{matches}</span>
      <span className={styles.gameStatsLabel}>{`${GAME_UI.STATS.MATCHES_LABEL}/${totalPairs}`}</span>
    </div>
  </div>
);

export const GameStats = memo(GameStatsBase);
