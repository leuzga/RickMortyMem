import { useState, useCallback, useRef, ChangeEvent, FormEvent } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { RegisterCredentials } from '../../types/auth.types';
import { validateRegisterCredentials } from '../../../../shared/utils/validators';

interface UseRegisterFormProps {
  onSuccess: () => void;
}

interface UseRegisterFormReturn {
  form: RegisterCredentials;
  isLoading: boolean;
  error: string | null;
  validationErrors: string[];
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: FormEvent) => Promise<void>;
}

export const useRegisterForm = ({ onSuccess }: UseRegisterFormProps): UseRegisterFormReturn => {
  const { register, isLoading, error, clearError } = useAuthStore();
  const [form, setForm] = useState<RegisterCredentials>({
    username: '',
    email: '',
    password: ''
  });
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Always-current ref so callbacks never go stale
  const formRef = useRef(form);
  formRef.current = form;

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    clearError();
    setValidationErrors((prev) => (prev.length > 0 ? [] : prev));
  }, [clearError]);

  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();

    const current = formRef.current;
    const validation = validateRegisterCredentials(current.username, current.email, current.password);
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      return;
    }
    setValidationErrors([]);
    await register(current, onSuccess);
  }, [register, onSuccess]);

  return {
    form,
    isLoading,
    error,
    validationErrors,
    handleChange,
    handleSubmit
  };
};