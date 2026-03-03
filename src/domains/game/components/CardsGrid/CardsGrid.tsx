import React from 'react';
import type { Card } from '../../types/game.types';
import { Card as CardComponent } from '../Card/Card';
import './CardsGrid.css';

interface CardsGridProps {
  readonly cards: Card[];
  readonly onCardClick: (card: Card) => void;
}

export const CardsGrid: React.FC<CardsGridProps> = ({ cards, onCardClick }) => (
  <section className="cards-grid" aria-label="Tablero de juego" role="grid">
    {cards.map((card) => (
      <CardComponent key={card.cardId} card={card} onClick={onCardClick} />
    ))}
  </section>
);
