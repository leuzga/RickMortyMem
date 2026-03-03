import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Card } from './Card';
import type { Card as CardType } from '../../types/game.types';

const baseCard: CardType = {
  cardId: 'card-1-1',
  characterId: 1,
  pairId: 'pair-1',
  image: 'https://example.com/rick.jpg',
  name: 'Rick Sanchez',
  isFlipped: false,
  isMatched: false,
};

describe('Card', () => {
  it('renders with hidden aria-label when not flipped', () => {
    const onClick = vi.fn();
    render(<Card card={baseCard} onClick={onClick} />);
    const card = screen.getByRole('button');
    expect(card).toHaveAttribute('aria-label', 'Carta oculta, haz clic para revelar');
  });

  it('calls onClick when clicked and card is not flipped or matched', () => {
    const onClick = vi.fn();
    render(<Card card={baseCard} onClick={onClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledWith(baseCard);
  });

  it('does NOT call onClick when card is already flipped', () => {
    const onClick = vi.fn();
    render(<Card card={{ ...baseCard, isFlipped: true }} onClick={onClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('does NOT call onClick when card is matched', () => {
    const onClick = vi.fn();
    render(<Card card={{ ...baseCard, isMatched: true }} onClick={onClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('renders correctly when isFlipped is true', () => {
    const onClick = vi.fn();
    const { container } = render(<Card card={{ ...baseCard, isFlipped: true }} onClick={onClick} />);
    expect(container.firstChild).toBeTruthy();
  });

  it('renders correctly when isMatched is true', () => {
    const onClick = vi.fn();
    const { container } = render(<Card card={{ ...baseCard, isMatched: true }} onClick={onClick} />);
    expect(container.firstChild).toBeTruthy();
  });

  it('shows character image on the front face', () => {
    const onClick = vi.fn();
    render(<Card card={baseCard} onClick={onClick} />);
    const img = screen.getByAltText('Rick Sanchez');
    expect(img).toHaveAttribute('src', baseCard.image);
  });

  it('responds to Enter key press', () => {
    const onClick = vi.fn();
    render(<Card card={baseCard} onClick={onClick} />);
    fireEvent.keyDown(screen.getByRole('button'), { key: 'Enter' });
    expect(onClick).toHaveBeenCalledWith(baseCard);
  });

  it('responds to Space key press', () => {
    const onClick = vi.fn();
    render(<Card card={baseCard} onClick={onClick} />);
    fireEvent.keyDown(screen.getByRole('button'), { key: ' ' });
    expect(onClick).toHaveBeenCalledWith(baseCard);
  });
});
