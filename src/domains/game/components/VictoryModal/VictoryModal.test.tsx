import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { VictoryModal } from './VictoryModal';

// Mock the auth store
vi.mock('../../../../domains/auth/store/useAuthStore', () => ({
  useAuthStore: () => ({ logout: vi.fn() }),
}));

describe('VictoryModal', () => {
  it('renders the victory title', () => {
    render(<VictoryModal turns={12} onPlayAgain={vi.fn()} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('¡Ganaste! 🎉')).toBeInTheDocument();
  });

  it('displays the turn count', () => {
    render(<VictoryModal turns={12} onPlayAgain={vi.fn()} />);
    expect(screen.getByText('12')).toBeInTheDocument();
  });

  it('calls onPlayAgain when "Jugar de nuevo" is clicked', () => {
    const onPlayAgain = vi.fn();
    render(<VictoryModal turns={5} onPlayAgain={onPlayAgain} />);
    fireEvent.click(screen.getByText('Jugar de nuevo'));
    expect(onPlayAgain).toHaveBeenCalledTimes(1);
  });

  it('renders the "Inicio" button', () => {
    render(<VictoryModal turns={5} onPlayAgain={vi.fn()} />);
    expect(screen.getByText('Inicio')).toBeInTheDocument();
  });

  it('has role=dialog and aria-modal attribute', () => {
    render(<VictoryModal turns={5} onPlayAgain={vi.fn()} />);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
  });

  it('has accessible labelledby pointing to title id', () => {
    render(<VictoryModal turns={5} onPlayAgain={vi.fn()} />);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-labelledby', 'victory-title');
  });
});
