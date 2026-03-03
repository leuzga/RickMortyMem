import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Header } from './Header';
import { useAuthStore } from '../../../domains/auth/store/useAuthStore';

vi.mock('../../../domains/auth/store/useAuthStore');

const mockUseAuthStore = vi.mocked(useAuthStore);

// ─── Helpers ──────────────────────────────────────────────────────────────────

const mockLogout = vi.fn();

const setupUnauthenticated = () => {
  mockUseAuthStore.mockReturnValue({
    isAuthenticated: false,
    user: null,
    logout: mockLogout,
    login: vi.fn(),
    register: vi.fn(),
    isLoading: false,
    error: null,
    clearError: vi.fn(),
  } as any);
};

const setupAuthenticated = (username = 'rick_sanchez') => {
  mockUseAuthStore.mockReturnValue({
    isAuthenticated: true,
    user: { id: '1', username, email: 'rick@c137.com' },
    logout: mockLogout,
    login: vi.fn(),
    register: vi.fn(),
    isLoading: false,
    error: null,
    clearError: vi.fn(),
  } as any);
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('Header — usuario no autenticado', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupUnauthenticated();
  });

  it('debe renderizar el header', () => {
    render(<Header />);
    expect(screen.getByRole('banner')).toBeDefined();
  });

  it('debe mostrar el ícono de invitado (SVG)', () => {
    render(<Header />);
    expect(screen.getByLabelText('Invitado')).toBeDefined();
  });

  it('no debe mostrar el menú por defecto', () => {
    render(<Header />);
    expect(screen.queryByRole('menu')).toBeNull();
  });

  it('debe mostrar el menú al pasar el mouse por el avatar', () => {
    render(<Header />);
    const trigger = screen.getByLabelText('Menú de usuario');
    fireEvent.mouseEnter(trigger);
    expect(screen.getByRole('menu')).toBeDefined();
  });

  it('debe mostrar la opción "Iniciar sesión" en el menú', () => {
    render(<Header />);
    fireEvent.mouseEnter(screen.getByLabelText('Menú de usuario'));
    expect(screen.getByText('Iniciar sesión')).toBeDefined();
  });

  it('debe ocultar el menú al sacar el mouse del trigger después del delay', async () => {
    vi.useFakeTimers();
    render(<Header />);
    const trigger = screen.getByLabelText('Menú de usuario');
    fireEvent.mouseEnter(trigger);
    fireEvent.mouseLeave(trigger);
    await act(async () => { vi.advanceTimersByTime(200); });
    expect(screen.queryByRole('menu')).toBeNull();
    vi.useRealTimers();
  });

  it('debe mantener el menú abierto al mover el mouse del trigger al menú', () => {
    render(<Header />);
    const trigger = screen.getByLabelText('Menú de usuario');
    fireEvent.mouseEnter(trigger);
    fireEvent.mouseLeave(trigger);
    // Immediately entering the menu cancels the close timer
    fireEvent.mouseEnter(screen.getByRole('menu'));
    expect(screen.getByRole('menu')).toBeDefined();
  });
});

describe('Header — usuario autenticado', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupAuthenticated();
  });

  it('debe mostrar el avatar del usuario', () => {
    render(<Header />);
    expect(screen.getByAltText('Usuario')).toBeDefined();
  });

  it('debe mostrar el username junto al avatar', () => {
    render(<Header />);
    expect(screen.getByText('rick_sanchez')).toBeDefined();
  });

  it('debe mostrar la opción "Cerrar sesión" en el menú', () => {
    render(<Header />);
    fireEvent.mouseEnter(screen.getByLabelText('Menú de usuario'));
    expect(screen.getByText('Cerrar sesión')).toBeDefined();
  });

  it('debe llamar a logout al hacer click en "Cerrar sesión"', () => {
    render(<Header />);
    fireEvent.mouseEnter(screen.getByLabelText('Menú de usuario'));
    fireEvent.click(screen.getByText('Cerrar sesión'));
    expect(mockLogout).toHaveBeenCalledOnce();
  });
});
