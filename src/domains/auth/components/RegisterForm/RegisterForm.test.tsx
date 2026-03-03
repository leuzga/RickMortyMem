import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RegisterForm } from './RegisterForm';
import { useAuthStore } from '../../store/useAuthStore';

// Mock del store con toast
vi.mock('../../store/useAuthStore');
vi.mock('../../../shared/components/Toast/useToastStore', () => ({
  useToastStore: () => ({
    showToast: vi.fn(),
    removeToast: vi.fn(),
    clearAllToasts: vi.fn(),
    toasts: [],
  }),
}));

const mockUseAuthStore = vi.mocked(useAuthStore);

describe('RegisterForm Component', () => {
  const mockRegister = vi.fn();
  const mockClearError = vi.fn();
  const mockOnLoginClick = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuthStore.mockReturnValue({
      register: mockRegister,
      isLoading: false,
      error: null,
      clearError: mockClearError,
      user: null,
      isAuthenticated: false,
      logout: vi.fn(),
    } as any);
  });

  it('debe tener un input para username', () => {
    render(<RegisterForm onLoginClick={mockOnLoginClick} />);
    const input = screen.getByPlaceholderText('username123');
    expect(input).toBeDefined();
  });

  it('debe tener un input para email', () => {
    render(<RegisterForm onLoginClick={mockOnLoginClick} />);
    const input = screen.getByPlaceholderText('name@mail.com');
    expect(input).toBeDefined();
  });

  it('debe tener un input para password', () => {
    render(<RegisterForm onLoginClick={mockOnLoginClick} />);
    const input = screen.getByPlaceholderText('••••••••');
    expect(input).toBeDefined();
  });

  it('debe llamar a register con los datos del formulario al hacer submit', async () => {
    render(<RegisterForm onLoginClick={mockOnLoginClick} />);
    const usernameInput = screen.getByPlaceholderText('username123');
    const emailInput = screen.getByPlaceholderText('name@mail.com');
    const passwordInput = screen.getByPlaceholderText('••••••••');
    const submitButton = screen.getByRole('button', { name: /sign up/i });

    fireEvent.change(usernameInput, { target: { value: 'test_user' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith(
        {
          username: 'test_user',
          email: 'test@example.com',
          password: 'password123'
        },
        mockOnLoginClick
      );
    });
  });

  it('debe llamar a onLoginClick al hacer click en "Login"', () => {
    render(<RegisterForm onLoginClick={mockOnLoginClick} />);
    const loginButton = screen.getByRole('button', { name: /login/i });

    fireEvent.click(loginButton);
    expect(mockOnLoginClick).toHaveBeenCalled();
  });

  it('debe redirigir a login tras registro exitoso', async () => {
    // Simulate register calling onSuccess immediately
    mockRegister.mockImplementation((_creds: unknown, onSuccess?: () => void) => {
      onSuccess?.();
      return Promise.resolve();
    });

    render(<RegisterForm onLoginClick={mockOnLoginClick} />);
    const usernameInput = screen.getByPlaceholderText('username123');
    const emailInput = screen.getByPlaceholderText('name@mail.com');
    const passwordInput = screen.getByPlaceholderText('••••••••');
    const submitButton = screen.getByRole('button', { name: /sign up/i });

    fireEvent.change(usernameInput, { target: { value: 'test_user' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnLoginClick).toHaveBeenCalled();
    });
  });

  it('debe mostrar mensaje de carga durante registro', () => {
    mockUseAuthStore.mockReturnValue({
      register: mockRegister,
      isLoading: true,
      error: null,
      clearError: mockClearError,
    } as any);

    render(<RegisterForm onLoginClick={mockOnLoginClick} />);
    const button = screen.getByRole('button', { name: /creating account/i });
    expect(button).toHaveTextContent('Creating account...');
    expect(button).toBeDisabled();
  });

  it('debe mostrar mensaje de error del servidor', () => {
    mockUseAuthStore.mockReturnValue({
      register: mockRegister,
      isLoading: false,
      error: 'El usuario ya existe',
      clearError: mockClearError,
    } as any);

    render(<RegisterForm onLoginClick={mockOnLoginClick} />);
    const error = screen.getByText('El usuario ya existe');
    expect(error).toBeDefined();
  });

  it('debe mostrar errores de validación para email inválido', async () => {
    render(<RegisterForm onLoginClick={mockOnLoginClick} />);
    const emailInput = screen.getByPlaceholderText('name@mail.com');
    const passwordInput = screen.getByPlaceholderText('••••••••');
    const form = emailInput.closest('form')!;

    fireEvent.change(emailInput, { target: { value: 'rick@rick' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText('El email no es válido')).toBeDefined();
    }, { timeout: 1000 });
    expect(mockRegister).not.toHaveBeenCalled();
  });

  it('debe mostrar errores de validación para username vacío', async () => {
    render(<RegisterForm onLoginClick={mockOnLoginClick} />);
    const emailInput = screen.getByPlaceholderText('name@mail.com');
    const passwordInput = screen.getByPlaceholderText('••••••••');
    const form = emailInput.closest('form')!;

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText('El nombre de usuario es requerido')).toBeDefined();
    });
    expect(mockRegister).not.toHaveBeenCalled();
  });

  it('debe mostrar errores de validación para password corta', async () => {
    render(<RegisterForm onLoginClick={mockOnLoginClick} />);
    const usernameInput = screen.getByPlaceholderText('username123');
    const emailInput = screen.getByPlaceholderText('name@mail.com');
    const passwordInput = screen.getByPlaceholderText('••••••••');
    const submitButton = screen.getByRole('button', { name: /sign up/i });

    fireEvent.change(usernameInput, { target: { value: 'test_user' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: '123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('La contraseña debe tener al menos 6 caracteres')).toBeDefined();
    });
    expect(mockRegister).not.toHaveBeenCalled();
  });

  it('debe limpiar errores de validación al cambiar valores', async () => {
    render(<RegisterForm onLoginClick={mockOnLoginClick} />);
    const emailInput = screen.getByPlaceholderText('name@mail.com');
    const form = emailInput.closest('form')!;

    fireEvent.change(emailInput, { target: { value: 'rick@rick' } });
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText('El email no es válido')).toBeDefined();
    });

    fireEvent.change(emailInput, { target: { value: 'rick@rick.com' } });

    await waitFor(() => {
      expect(screen.queryByText('El email no es válido')).toBeNull();
    });
  });

  it('debe mostrar múltiples errores de validación', async () => {
    render(<RegisterForm onLoginClick={mockOnLoginClick} />);
    const emailInput = screen.getByPlaceholderText('name@mail.com');
    const passwordInput = screen.getByPlaceholderText('••••••••');
    const form = emailInput.closest('form')!;

    fireEvent.change(emailInput, { target: { value: 'invalid' } });
    fireEvent.change(passwordInput, { target: { value: '123' } });
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText('El email no es válido')).toBeDefined();
      expect(screen.getByText('El nombre de usuario es requerido')).toBeDefined();
      expect(screen.getByText('La contraseña debe tener al menos 6 caracteres')).toBeDefined();
    });
    expect(mockRegister).not.toHaveBeenCalled();
  });
});