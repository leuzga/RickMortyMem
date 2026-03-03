import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CardsGrid } from './CardsGrid';
import type { Card } from '../../types/game.types';

const makeCard = (id: number): Card => ({
  cardId: `card-${id}`,
  characterId: id,
  pairId: `pair-${id}`,
  image: `https://example.com/char${id}.jpg`,
  name: `Character ${id}`,
  isFlipped: false,
  isMatched: false,
});

describe('CardsGrid', () => {
  it('renders all provided cards', () => {
    const cards = Array.from({ length: 18 }, (_, i) => makeCard(i + 1));
    render(<CardsGrid cards={cards} onCardClick={vi.fn()} />);
    // Each card has a unique aria-label 'Carta oculta...'
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(18);
  });

  it('renders 0 cards gracefully', () => {
    render(<CardsGrid cards={[]} onCardClick={vi.fn()} />);
    const buttons = screen.queryAllByRole('button');
    expect(buttons).toHaveLength(0);
  });

  it('has accessible section label', () => {
    render(<CardsGrid cards={[]} onCardClick={vi.fn()} />);
    expect(screen.getByRole('grid')).toHaveAttribute('aria-label', 'Tablero de juego');
  });
});
