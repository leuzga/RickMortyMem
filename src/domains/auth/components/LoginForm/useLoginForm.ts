import { useState, useCallback, useRef, ChangeEvent, FormEvent } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { LoginCredentials } from '../../types/auth.types';
import { validateLoginCredentials } from '../../../../shared/utils/validators';

interface UseLoginFormReturn {
  form: LoginCredentials;
  isLoading: boolean;
  error: string | null;
  validationErrors: string[];
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: FormEvent) => Promise<void>;
}

export const useLoginForm = (): UseLoginFormReturn => {
  const { login, isLoading, error, clearError } = useAuthStore();
  const [form, setForm] = useState<LoginCredentials>({
    email: '',
    password: '',
    rememberMe: false
  });
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Always-current ref so callbacks never go stale
  const formRef = useRef(form);
  formRef.current = form;

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    clearError();
    setValidationErrors((prev) => (prev.length > 0 ? [] : prev));
  }, [clearError]);

  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();

    const current = formRef.current;
    const validation = validateLoginCredentials(current.email, current.password);
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      return;
    }
    setValidationErrors([]);
    await login(current);
  }, [login]);

  return {
    form,
    isLoading,
    error,
    validationErrors,
    handleChange,
    handleSubmit
  };
};
