import React, { memo } from 'react';
import type { Card } from '../../types/game.types';
import { CardMemo } from '../Card/Card';
import styles from './CardsGrid.module.css';

interface CardsGridProps {
  readonly cards: Card[];
  readonly onCardClick: (card: Card) => void;
  readonly isShuffling?: boolean;
}

const CardsGridBase: React.FC<CardsGridProps> = ({ cards, onCardClick, isShuffling = false }) => (
  <section
    className={`${styles.cardsGrid} ${isShuffling ? styles.cardsGridShuffling : ''}`}
    aria-label="Tablero de juego"
    role="grid"
  >
    {cards.map((card, index) => (
      <CardMemo
        key={card.cardId}
        card={card}
        onClick={onCardClick}
        isShuffling={isShuffling}
        shuffleIndex={index}
      />
    ))}
  </section>
);

export const CardsGrid = memo(CardsGridBase);
