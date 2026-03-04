import React from 'react';
import { useRegisterForm } from './useRegisterForm';
import { AUTH_UI } from '../../constants/auth.constants';
import styles from './RegisterForm.module.css';

interface RegisterFormProps {
  onLoginClick: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onLoginClick }) => {
  const { form, isLoading, error, validationErrors, handleChange, handleSubmit } = useRegisterForm({
    onSuccess: onLoginClick
  });

  return (
    <form className={styles.registerForm} onSubmit={handleSubmit} noValidate>
      <div className={styles.registerFormField}>
        <label className={styles.registerFormLabel}>{AUTH_UI.REGISTER.USERNAME_LABEL}</label>
        <input
          name="username"
          type="text"
          className={styles.registerFormInput}
          value={form.username}
          onChange={handleChange}
          placeholder={AUTH_UI.REGISTER.USERNAME_PLACEHOLDER}
          required
        />
      </div>

      <div className={styles.registerFormField}>
        <label className={styles.registerFormLabel}>{AUTH_UI.REGISTER.EMAIL_LABEL}</label>
        <input
          name="email"
          type="email"
          className={styles.registerFormInput}
          value={form.email}
          onChange={handleChange}
          placeholder={AUTH_UI.REGISTER.EMAIL_PLACEHOLDER}
          required
        />
      </div>

      <div className={styles.registerFormField}>
        <label className={styles.registerFormLabel}>{AUTH_UI.REGISTER.PASSWORD_LABEL}</label>
        <input
          name="password"
          type="password"
          className={styles.registerFormInput}
          value={form.password}
          onChange={handleChange}
          placeholder={AUTH_UI.REGISTER.PASSWORD_PLACEHOLDER}
          required
        />
      </div>

      {validationErrors.length > 0 && (
        <div className={styles.registerFormValidationErrors}>
          {validationErrors.map((err, index) => (
            <p key={index} className={styles.registerFormError}>{err}</p>
          ))}
        </div>
      )}

      {error && <p className={styles.registerFormError}>{error}</p>}

      <div className={styles.registerFormActions}>
        <button
          type="submit"
          className={`${styles.registerFormButton} ${styles.registerFormButtonPrimary}`}
          disabled={isLoading}
        >
          {isLoading ? AUTH_UI.REGISTER.SUBMIT_LOADING : AUTH_UI.REGISTER.SUBMIT_BUTTON}
        </button>
        <button
          type="button"
          className={`${styles.registerFormButton} ${styles.registerFormButtonSecondary}`}
          onClick={onLoginClick}
        >
          {AUTH_UI.REGISTER.LOGIN_BUTTON}
        </button>
      </div>
    </form>
  );
};