import React from 'react';
import type { Card } from '../../types/game.types';
import { Card as CardComponent } from '../Card/Card';
import styles from './CardsGrid.module.css';

interface CardsGridProps {
  readonly cards: Card[];
  readonly onCardClick: (card: Card) => void;
  readonly isShuffling?: boolean;
}

export const CardsGrid: React.FC<CardsGridProps> = ({ cards, onCardClick, isShuffling = false }) => (
  <section
    className={`${styles.cardsGrid} ${isShuffling ? styles.cardsGridShuffling : ''}`}
    aria-label="Tablero de juego"
    role="grid"
  >
    {cards.map((card, index) => (
      <CardComponent
        key={card.cardId}
        card={card}
        onClick={onCardClick}
        isShuffling={isShuffling}
        shuffleIndex={index}
      />
    ))}
  </section>
);
