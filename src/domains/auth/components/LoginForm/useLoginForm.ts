import { useState, useCallback, ChangeEvent, FormEvent } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { LoginCredentials } from '../../types/auth.types';

export const useLoginForm = () => {
  const { login, isLoading, error, clearError } = useAuthStore();
  const [form, setForm] = useState<LoginCredentials>({ username: '' });

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    clearError();
  }, [clearError]);

  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    await login(form);
  }, [form, login]);

  return { form, isLoading, error, handleChange, handleSubmit };
};
