import { useState, useCallback, ChangeEvent, FormEvent } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { RegisterCredentials } from '../../types/auth.types';
import { validateRegisterCredentials } from '../../../../shared/utils/validators';

interface UseRegisterFormProps {
  onSuccess?: () => void;
}

interface UseRegisterFormReturn {
  form: RegisterCredentials;
  isLoading: boolean;
  error: string | null;
  validationErrors: string[];
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: FormEvent) => Promise<void>;
  registrationSuccess: boolean;
}

export const useRegisterForm = ({ onSuccess }: UseRegisterFormProps = {}): UseRegisterFormReturn => {
  const { register, isLoading, error, clearError } = useAuthStore();
  const [form, setForm] = useState<RegisterCredentials>({
    username: '',
    email: '',
    password: ''
  });
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    clearError();
    // Limpiar errores de validación al cambiar el valor
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
  }, [clearError, validationErrors.length]);

  const validateForm = useCallback((): boolean => {
    console.log('🔍 Validando formulario:', { username: form.username, email: form.email, password: form.password });

    const validation = validateRegisterCredentials(form.username, form.email, form.password);
    console.log('🔍 Resultado validación:', validation);

    if (!validation.isValid) {
      console.log('❌ Errores encontrados:', validation.errors);
      setValidationErrors(validation.errors);
      return false;
    }

    console.log('✅ Formulario válido');
    setValidationErrors([]);
    return true;
  }, [form]);

  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    console.log('🚀 Submit iniciado');

    // Validar formulario antes de enviar
    const isValid = validateForm();
    console.log('🔍 Resultado validación en submit:', isValid);

    if (!isValid) {
      console.log('❌ Submit bloqueado por validación');
      return;
    }

    console.log('✅ Submit continuando a register');
    await register(form, onSuccess);
  }, [form, register, validateForm, onSuccess]);

  return {
    form,
    isLoading,
    error,
    validationErrors,
    handleChange,
    handleSubmit,
    registrationSuccess: false
  };
};