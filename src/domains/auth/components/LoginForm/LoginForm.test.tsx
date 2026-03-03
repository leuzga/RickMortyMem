import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LoginForm } from './LoginForm';
import { useAuthStore } from '../../store/useAuthStore';

vi.mock('../../store/useAuthStore');

const mockUseAuthStore = vi.mocked(useAuthStore);

describe('LoginForm Component', () => {
  const mockLogin = vi.fn();
  const mockClearError = vi.fn();
  const mockOnRegisterClick = vi.fn();
  const mockOnForgotPasswordClick = vi.fn();

  const renderForm = () =>
    render(
      <LoginForm
        onRegisterClick={mockOnRegisterClick}
        onForgotPasswordClick={mockOnForgotPasswordClick}
      />
    );

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuthStore.mockReturnValue({
      login: mockLogin,
      isLoading: false,
      error: null,
      clearError: mockClearError,
    } as any);
  });

  it('debe mostrar el campo de email', () => {
    renderForm();
    expect(screen.getByText('Email address')).toBeDefined();
  });

  it('debe tener un input para email', () => {
    renderForm();
    const input = screen.getByPlaceholderText('name@mail.com');
    expect(input).toBeDefined();
  });

  it('debe tener un input para password', () => {
    renderForm();
    const input = screen.getByPlaceholderText('••••••••');
    expect(input).toBeDefined();
  });

  it('debe tener un checkbox para "Remember me"', () => {
    renderForm();
    const checkbox = screen.getByLabelText('Remember me');
    expect(checkbox).toBeDefined();
  });

  it('debe llamar a login con los datos del formulario al hacer submit', async () => {
    renderForm();
    const emailInput = screen.getByPlaceholderText('name@mail.com');
    const passwordInput = screen.getByPlaceholderText('••••••••');
    const submitButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        rememberMe: false
      });
    });
  });

  it('debe llamar a onRegisterClick al hacer click en "Sign up"', () => {
    renderForm();
    const registerButton = screen.getByRole('button', { name: /sign up/i });
    fireEvent.click(registerButton);
    expect(mockOnRegisterClick).toHaveBeenCalled();
  });

  it('debe llamar a onForgotPasswordClick al hacer click en "Forget password?"', () => {
    renderForm();
    fireEvent.click(screen.getByText('Forget password?'));
    expect(mockOnForgotPasswordClick).toHaveBeenCalledOnce();
  });

  it('debe mostrar mensaje de carga durante login', () => {
    mockUseAuthStore.mockReturnValue({
      login: mockLogin,
      isLoading: true,
      error: null,
      clearError: mockClearError,
    } as any);

    renderForm();
    const button = screen.getByRole('button', { name: /signing in/i });
    expect(button).toHaveTextContent('Signing in...');
    expect(button).toBeDisabled();
  });

  it('debe mostrar mensaje de error del servidor', () => {
    mockUseAuthStore.mockReturnValue({
      login: mockLogin,
      isLoading: false,
      error: 'Credenciales inválidas',
      clearError: mockClearError,
    } as any);

    renderForm();
    const error = screen.getByText('Credenciales inválidas');
    expect(error).toBeDefined();
  });

  it('debe mostrar errores de validación para email inválido', async () => {
    renderForm();
    const emailInput = screen.getByPlaceholderText('name@mail.com');
    const passwordInput = screen.getByPlaceholderText('••••••••');
    const form = emailInput.closest('form')!;

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText('El email no es válido')).toBeDefined();
    });
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('debe mostrar errores de validación para password corta', async () => {
    renderForm();
    const emailInput = screen.getByPlaceholderText('name@mail.com');
    const passwordInput = screen.getByPlaceholderText('••••••••');
    const submitButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: '123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('La contraseña debe tener al menos 6 caracteres')).toBeDefined();
    });
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('debe manejar el checkbox "Remember me"', async () => {
    renderForm();
    const emailInput = screen.getByPlaceholderText('name@mail.com');
    const passwordInput = screen.getByPlaceholderText('••••••••');
    const checkbox = screen.getByLabelText('Remember me');
    const submitButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(checkbox);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        rememberMe: true
      });
    });
  });

  it('debe limpiar errores de validación al cambiar valores', async () => {
    renderForm();
    const emailInput = screen.getByPlaceholderText('name@mail.com');
    const form = emailInput.closest('form')!;

    fireEvent.change(emailInput, { target: { value: 'invalid' } });
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText('El email no es válido')).toBeDefined();
    });

    fireEvent.change(emailInput, { target: { value: 'valid@example.com' } });

    await waitFor(() => {
      expect(screen.queryByText('El email no es válido')).toBeNull();
    });
  });

  it('debe mostrar múltiples errores de validación', async () => {
    renderForm();
    const emailInput = screen.getByPlaceholderText('name@mail.com');
    const passwordInput = screen.getByPlaceholderText('••••••••');
    const form = emailInput.closest('form')!;

    fireEvent.change(emailInput, { target: { value: 'invalid' } });
    fireEvent.change(passwordInput, { target: { value: '123' } });
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText('El email no es válido')).toBeDefined();
      expect(screen.getByText('La contraseña debe tener al menos 6 caracteres')).toBeDefined();
    });
    expect(mockLogin).not.toHaveBeenCalled();
  });
});
