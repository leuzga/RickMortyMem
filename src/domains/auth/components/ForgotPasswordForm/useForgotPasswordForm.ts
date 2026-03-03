import { useState, useCallback, useRef, ChangeEvent, FormEvent } from 'react';
import { resetPasswordRequest } from '../../services/auth.api';
import { validateEmail, validatePassword } from '../../../../shared/utils/validators';
import { AUTH_MESSAGES } from '../../constants/auth.constants';
import { useToastStore } from '../../../../shared/components/Toast/useToastStore';

interface UseForgotPasswordFormProps {
  onSuccess: () => void;
}

interface ForgotPasswordForm {
  email: string;
  newPassword: string;
}

interface UseForgotPasswordFormReturn {
  form: ForgotPasswordForm;
  isLoading: boolean;
  validationErrors: string[];
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: FormEvent) => Promise<void>;
}

export const useForgotPasswordForm = ({
  onSuccess,
}: UseForgotPasswordFormProps): UseForgotPasswordFormReturn => {
  const { showToast } = useToastStore.getState();
  const [form, setForm] = useState<ForgotPasswordForm>({ email: '', newPassword: '' });
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const formRef = useRef(form);
  formRef.current = form;

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setValidationErrors((prev) => (prev.length > 0 ? [] : prev));
  }, []);

  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    const { email, newPassword } = formRef.current;

    const errors: string[] = [
      ...validateEmail(email).errors,
      ...validatePassword(newPassword).errors,
    ];

    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    setIsLoading(true);
    const response = await resetPasswordRequest(email, newPassword);
    setIsLoading(false);

    if (response.success) {
      showToast(AUTH_MESSAGES.FORGOT_PASSWORD.SUCCESS, 'success');
      onSuccess();
    } else {
      const error = response.error ?? AUTH_MESSAGES.FORGOT_PASSWORD.ERROR;
      setValidationErrors([error]);
      showToast(error, 'error');
    }
  }, [onSuccess, showToast]);

  return { form, isLoading, validationErrors, handleChange, handleSubmit };
};
