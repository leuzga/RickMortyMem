import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LoginForm } from './LoginForm';
import { useAuthStore } from '../../store/useAuthStore';

// Mock del store
vi.mock('../../store/useAuthStore');

const mockUseAuthStore = vi.mocked(useAuthStore);

describe('LoginForm Component', () => {
  const mockLogin = vi.fn();
  const mockClearError = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuthStore.mockReturnValue({
      login: mockLogin,
      isLoading: false,
      error: null,
      clearError: mockClearError,
    } as any);
  });

  it('debe mostrar el título "INGRESAR AL PORTAL"', () => {
    render(<LoginForm />);
    const title = screen.getByText(/INGRESAR AL PORTAL/i);
    expect(title).toBeDefined();
  });

  it('debe tener un input para username', () => {
    render(<LoginForm />);
    const input = screen.getByPlaceholderText('Rick_C137');
    expect(input).toBeDefined();
  });

  it('debe llamar a login con el username al hacer submit', async () => {
    render(<LoginForm />);
    const input = screen.getByPlaceholderText('Rick_C137');
    const button = screen.getByRole('button', { name: /ingresar/i });

    fireEvent.change(input, { target: { value: 'test_user' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({ username: 'test_user' });
    });
  });

  it('debe mostrar mensaje de carga durante login', () => {
    mockUseAuthStore.mockReturnValue({
      login: mockLogin,
      isLoading: true,
      error: null,
      clearError: mockClearError,
    } as any);

    render(<LoginForm />);
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('Abriendo portal...');
    expect(button).toBeDisabled();
  });

  it('debe mostrar mensaje de error', () => {
    mockUseAuthStore.mockReturnValue({
      login: mockLogin,
      isLoading: false,
      error: 'Credenciales inválidas',
      clearError: mockClearError,
    } as any);

    render(<LoginForm />);
    const error = screen.getByText('Credenciales inválidas');
    expect(error).toBeDefined();
  });
});
