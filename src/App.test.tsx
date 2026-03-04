import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from './App';
import { useAuthStore } from './domains/auth/store/useAuthStore';

// Mock del store
vi.mock('./domains/auth/store/useAuthStore');

const mockUseAuthStore = vi.mocked(useAuthStore);

describe('App Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuthStore.mockReturnValue({
      isAuthenticated: false,
      user: null,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      isLoading: false,
      error: null,
      clearError: vi.fn(),
    } as any);
  });

  it('debe mostrar el login por defecto cuando no está autenticado', () => {
    render(<App />);
    // Ahora el título está en AuthLayout
    const welcomeTitle = screen.getByText('Hello, welcome!');
    expect(welcomeTitle).toBeDefined();
  });

  it('debe mostrar el formulario de login', () => {
    render(<App />);
    const emailInput = screen.getByPlaceholderText('name@mail.com');
    const passwordInput = screen.getByPlaceholderText('••••••••');
    const loginButton = screen.getByRole('button', { name: /login/i });

    expect(emailInput).toBeDefined();
    expect(passwordInput).toBeDefined();
    expect(loginButton).toBeDefined();
  });

  it('debe mostrar el GameBoard cuando está autenticado', async () => {
    mockUseAuthStore.mockReturnValue({
      isAuthenticated: true,
      user: { id: '1', username: 'Rick', email: 'rick@citadel.com' },
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      loginWithOAuthCallback: vi.fn().mockResolvedValue(undefined),
      isLoading: false,
      error: null,
      clearError: vi.fn(),
    } as any);

    render(<App />);
    // GameBoard es lazy — esperamos a que se resuelva el Suspense
    const statusRegion = await screen.findByRole('status');
    expect(statusRegion).toBeDefined();
  });
});