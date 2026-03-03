import { useState, useCallback } from 'react';
import { signInWithOAuth } from '../../services/oauth.api';
import type { OAuthProvider } from '../../types/oauth.types';
import { useToastStore } from '../../../../shared/components/Toast/useToastStore';
import { OAUTH_UI } from './oauth.buttons.constants';

interface UseOAuthButtonsReturn {
  readonly loadingProvider: OAuthProvider | null;
  readonly handleOAuthLogin: (provider: OAuthProvider) => Promise<void>;
}

/**
 * Hook que encapsula la lógica de los botones OAuth.
 * Estado: proveedor en curso (para loading individual por botón).
 */
export const useOAuthButtons = (): UseOAuthButtonsReturn => {
  const { showToast } = useToastStore.getState();
  const [loadingProvider, setLoadingProvider] = useState<OAuthProvider | null>(null);

  const handleOAuthLogin = useCallback(async (provider: OAuthProvider): Promise<void> => {
    setLoadingProvider(provider);

    const result = await signInWithOAuth(provider);

    // Si hay error (redirect no ocurrió), limpiamos el estado
    if (!result.success) {
      setLoadingProvider(null);
      showToast(`${OAUTH_UI.ERROR_PREFIX}: ${result.error}`, 'error');
    }
    // Si success=true, el browser está redirigiendo — no necesitamos hacer nada más
  }, [showToast]);

  return { loadingProvider, handleOAuthLogin };
};
