import React, { useMemo } from 'react';
import type { Card as CardType } from '../../types/game.types';
import { GAME_UI } from '../../constants/game.constants';
import './Card.css';

interface CardProps {
  readonly card: CardType;
  readonly onClick: (card: CardType) => void;
  readonly isShuffling?: boolean;
  readonly shuffleIndex?: number;
}

export const Card: React.FC<CardProps> = ({ card, onClick, isShuffling = false, shuffleIndex = 0 }) => {
  const { cardId, image, name, isFlipped, isMatched } = card;

  const shuffleVars = useMemo(() => {
    if (!isShuffling) return {};

    const angle = (shuffleIndex / 18) * Math.PI * 2;
    const distance = 200 + Math.random() * 150;

    return {
      '--delay': `${shuffleIndex * 0.08}s`,
      '--scatter-x': `${Math.cos(angle) * distance}px`,
      '--scatter-y': `${Math.sin(angle) * distance}px`,
      '--scatter-rotate': `${Math.random() * 720 - 360}deg`,
      '--rotate-x': `${Math.random() * 720}deg`,
      '--rotate-y': `${Math.random() * 1080}deg`,
      '--particle-x': `${Math.random() * 2 - 1}`,
      '--particle-y': `${Math.random()}`,
    } as React.CSSProperties;
  }, [isShuffling, shuffleIndex]);

  const handleClick = (): void => {
    if (!isFlipped && !isMatched) onClick(card);
  };

  const ariaLabel = isMatched
    ? GAME_UI.CARD.ARIA_LABEL_MATCHED(name)
    : isFlipped
      ? GAME_UI.CARD.ARIA_LABEL_FLIPPED(name)
      : GAME_UI.CARD.ARIA_LABEL_HIDDEN;

  return (
    <div
      id={`card-${cardId}`}
      className={`card ${isFlipped ? 'card--flipped' : ''} ${isMatched ? 'card--matched' : ''} ${isShuffling ? 'card--shuffling' : ''}`}
      onClick={handleClick}
      role="button"
      tabIndex={isFlipped || isMatched ? -1 : 0}
      aria-label={ariaLabel}
      aria-pressed={isFlipped}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClick(); }}
      style={shuffleVars}
    >
      <div className="card__inner">
        {/* Back face */}
        <div className="card__face card__face--back" aria-hidden="true">
          <div className="card__back-pattern">
            <span className="card__back-icon">🧪</span>
          </div>
        </div>
        {/* Front face */}
        <div className="card__face card__face--front">
          <img
            src={image}
            alt={name}
            className="card__image"
            loading="lazy"
          />
          <span className="card__name">{name}</span>
        </div>
      </div>
    </div>
  );
};
