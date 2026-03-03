import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OAuthButtons } from './OAuthButtons';
import * as oauthApi from '../../services/oauth.api';

vi.mock('../../services/oauth.api');
vi.mock('../../../../shared/components/Toast/useToastStore', () => ({
  useToastStore: {
    getState: () => ({ showToast: vi.fn() }),
  },
}));

const mockSignInWithOAuth = vi.mocked(oauthApi.signInWithOAuth);

describe('OAuthButtons', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe renderizar los botones de Google y GitHub', () => {
    render(<OAuthButtons />);
    expect(screen.getByLabelText('Iniciar sesión con Google')).toBeDefined();
    expect(screen.getByLabelText('Iniciar sesión con GitHub')).toBeDefined();
  });

  it('debe mostrar el texto separador', () => {
    render(<OAuthButtons />);
    expect(screen.getByText('o continúa con')).toBeDefined();
  });

  it('debe llamar a signInWithOAuth con "google" al click', async () => {
    mockSignInWithOAuth.mockResolvedValue({ success: true, data: undefined });
    render(<OAuthButtons />);
    fireEvent.click(screen.getByLabelText('Iniciar sesión con Google'));
    await waitFor(() => {
      expect(mockSignInWithOAuth).toHaveBeenCalledWith('google');
    });
  });

  it('debe llamar a signInWithOAuth con "github" al click', async () => {
    mockSignInWithOAuth.mockResolvedValue({ success: true, data: undefined });
    render(<OAuthButtons />);
    fireEvent.click(screen.getByLabelText('Iniciar sesión con GitHub'));
    await waitFor(() => {
      expect(mockSignInWithOAuth).toHaveBeenCalledWith('github');
    });
  });

  it('debe deshabilitar ambos botones mientras uno está cargando', async () => {
    // signInWithOAuth nunca resuelve → simula redirect en curso
    mockSignInWithOAuth.mockImplementation(() => new Promise(() => { }));
    render(<OAuthButtons />);
    fireEvent.click(screen.getByLabelText('Iniciar sesión con Google'));
    await waitFor(() => {
      const githubBtn = screen.getByLabelText('Iniciar sesión con GitHub') as HTMLButtonElement;
      expect(githubBtn.disabled).toBe(true);
    });
  });

  it('no debe mostrar estado de carga si signInWithOAuth retorna error', async () => {
    mockSignInWithOAuth.mockResolvedValue({ success: false, error: 'OAuth failed' });
    render(<OAuthButtons />);
    fireEvent.click(screen.getByLabelText('Iniciar sesión con Google'));
    await waitFor(() => {
      // Después del error, los botones vuelven a estar habilitados
      const googleBtn = screen.getByLabelText('Iniciar sesión con Google') as HTMLButtonElement;
      expect(googleBtn.disabled).toBe(false);
    });
  });
});
