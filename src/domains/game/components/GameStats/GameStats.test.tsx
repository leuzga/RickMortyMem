import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GameStats } from './GameStats';

describe('GameStats', () => {
  it('renders turns and matches values', () => {
    render(<GameStats turns={5} matches={3} totalPairs={8} />);
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('renders correct labels', () => {
    render(<GameStats turns={0} matches={0} totalPairs={8} />);
    expect(screen.getByText('Turnos')).toBeInTheDocument();
    expect(screen.getByText('Pares')).toBeInTheDocument();
  });

  it('shows totalPairs denominator', () => {
    render(<GameStats turns={0} matches={4} totalPairs={8} />);
    expect(screen.getByText('/ 8')).toBeInTheDocument();
  });

  it('updates when props change', () => {
    const { rerender } = render(<GameStats turns={1} matches={0} totalPairs={8} />);
    expect(screen.getByText('1')).toBeInTheDocument();
    rerender(<GameStats turns={3} matches={2} totalPairs={8} />);
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('has aria-live polite for dynamic updates', () => {
    const { container } = render(<GameStats turns={0} matches={0} totalPairs={8} />);
    expect(container.firstChild).toHaveAttribute('aria-live', 'polite');
  });
});
