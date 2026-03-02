import { useState, useCallback, ChangeEvent, FormEvent } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { RegisterCredentials } from '../../types/auth.types';

export const useRegisterForm = () => {
  const { register, isLoading, error, clearError } = useAuthStore();
  const [form, setForm] = useState<RegisterCredentials>({ username: '', email: '' });

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    clearError();
  }, [clearError]);

  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    await register(form);
  }, [form, register]);

  return { form, isLoading, error, handleChange, handleSubmit };
};