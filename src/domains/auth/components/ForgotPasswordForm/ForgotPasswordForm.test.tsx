import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ForgotPasswordForm } from './ForgotPasswordForm';
import * as authApi from '../../services/auth.api';

vi.mock('../../services/auth.api');
vi.mock('../../../../shared/components/Toast/useToastStore', () => ({
  useToastStore: {
    getState: () => ({ showToast: vi.fn() }),
  },
}));

const mockResetPasswordRequest = vi.mocked(authApi.resetPasswordRequest);
const mockOnLoginClick = vi.fn();

describe('ForgotPasswordForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe renderizar el formulario completo', () => {
    render(<ForgotPasswordForm onLoginClick={mockOnLoginClick} />);
    expect(screen.getByPlaceholderText('name@mail.com')).toBeDefined();
    expect(screen.getByText('Cambiar contraseña')).toBeDefined();
    expect(screen.getByText('Volver al login')).toBeDefined();
  });

  it('debe mostrar error de validación para email inválido', async () => {
    render(<ForgotPasswordForm onLoginClick={mockOnLoginClick} />);
    const form = screen.getByPlaceholderText('name@mail.com').closest('form')!;
    fireEvent.change(screen.getByPlaceholderText('name@mail.com'), {
      target: { value: 'invalid' },
    });
    fireEvent.submit(form);
    await waitFor(() => {
      expect(screen.getByText('El email no es válido')).toBeDefined();
    });
    expect(mockResetPasswordRequest).not.toHaveBeenCalled();
  });

  it('debe mostrar error de validación para contraseña corta', async () => {
    render(<ForgotPasswordForm onLoginClick={mockOnLoginClick} />);
    const emailInput = screen.getByPlaceholderText('name@mail.com');
    const form = emailInput.closest('form')!;
    fireEvent.change(emailInput, { target: { value: 'rick@c137.com' } });
    fireEvent.change(screen.getAllByPlaceholderText('••••••••')[0]!, {
      target: { value: '123' },
    });
    fireEvent.submit(form);
    await waitFor(() => {
      expect(screen.getByText('La contraseña debe tener al menos 6 caracteres')).toBeDefined();
    });
    expect(mockResetPasswordRequest).not.toHaveBeenCalled();
  });

  it('debe llamar a resetPasswordRequest con email y nueva contraseña', async () => {
    mockResetPasswordRequest.mockResolvedValue({ success: true });
    render(<ForgotPasswordForm onLoginClick={mockOnLoginClick} />);
    fireEvent.change(screen.getByPlaceholderText('name@mail.com'), {
      target: { value: 'rick@c137.com' },
    });
    fireEvent.change(screen.getAllByPlaceholderText('••••••••')[0]!, {
      target: { value: 'newPass123' },
    });
    fireEvent.submit(screen.getByPlaceholderText('name@mail.com').closest('form')!);
    await waitFor(() => {
      expect(mockResetPasswordRequest).toHaveBeenCalledWith('rick@c137.com', 'newPass123');
    });
  });

  it('debe llamar a onLoginClick tras reset exitoso', async () => {
    mockResetPasswordRequest.mockResolvedValue({ success: true });
    render(<ForgotPasswordForm onLoginClick={mockOnLoginClick} />);
    fireEvent.change(screen.getByPlaceholderText('name@mail.com'), {
      target: { value: 'rick@c137.com' },
    });
    fireEvent.change(screen.getAllByPlaceholderText('••••••••')[0]!, {
      target: { value: 'newPass123' },
    });
    fireEvent.submit(screen.getByPlaceholderText('name@mail.com').closest('form')!);
    await waitFor(() => {
      expect(mockOnLoginClick).toHaveBeenCalledOnce();
    });
  });

  it('debe mostrar error del servidor si el email no existe', async () => {
    mockResetPasswordRequest.mockResolvedValue({
      success: false,
      error: 'No se encontró ninguna cuenta con ese email',
    });
    render(<ForgotPasswordForm onLoginClick={mockOnLoginClick} />);
    fireEvent.change(screen.getByPlaceholderText('name@mail.com'), {
      target: { value: 'ghost@c137.com' },
    });
    fireEvent.change(screen.getAllByPlaceholderText('••••••••')[0]!, {
      target: { value: 'newPass123' },
    });
    fireEvent.submit(screen.getByPlaceholderText('name@mail.com').closest('form')!);
    await waitFor(() => {
      expect(screen.getByText('No se encontró ninguna cuenta con ese email')).toBeDefined();
    });
    expect(mockOnLoginClick).not.toHaveBeenCalled();
  });

  it('debe llamar a onLoginClick al hacer click en "Volver al login"', () => {
    render(<ForgotPasswordForm onLoginClick={mockOnLoginClick} />);
    fireEvent.click(screen.getByText('Volver al login'));
    expect(mockOnLoginClick).toHaveBeenCalledOnce();
  });
});
