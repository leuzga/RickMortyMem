import React from 'react';
import { useLoginForm } from './useLoginForm';
import { OAuthButtons } from '../OAuthButtons/OAuthButtons';
import { AUTH_UI } from '../../constants/auth.constants';
import styles from './LoginForm.module.css';

interface LoginFormProps {
  onRegisterClick: () => void;
  onForgotPasswordClick: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onRegisterClick, onForgotPasswordClick }) => {
  const { form, isLoading, error, validationErrors, handleChange, handleSubmit } = useLoginForm();

  return (
    <form className={styles.loginForm} onSubmit={handleSubmit} noValidate>
      <div className={styles.loginFormField}>
        <label className={styles.loginFormLabel}>{AUTH_UI.LOGIN.EMAIL_LABEL}</label>
        <input
          name="email"
          type="email"
          className={styles.loginFormInput}
          value={form.email}
          onChange={handleChange}
          placeholder={AUTH_UI.LOGIN.EMAIL_PLACEHOLDER}
          required
        />
      </div>

      <div className={styles.loginFormField}>
        <label className={styles.loginFormLabel}>{AUTH_UI.LOGIN.PASSWORD_LABEL}</label>
        <input
          name="password"
          type="password"
          className={styles.loginFormInput}
          value={form.password}
          onChange={handleChange}
          placeholder={AUTH_UI.LOGIN.PASSWORD_PLACEHOLDER}
          required
        />
      </div>

      <div className={styles.loginFormOptions}>
        <label className={styles.loginFormCheckbox}>
          <input
            name="rememberMe"
            type="checkbox"
            className={styles.loginFormCheckboxInput}
            checked={form.rememberMe || false}
            onChange={handleChange}
          />
          <span className={styles.loginFormCheckboxLabel}>{AUTH_UI.LOGIN.REMEMBER_ME_LABEL}</span>
        </label>
        <button
          type="button"
          className={styles.loginFormForgot}
          onClick={onForgotPasswordClick}
        >
          {AUTH_UI.LOGIN.FORGOT_PASSWORD_LINK}
        </button>
      </div>

      {validationErrors.length > 0 && (
        <div className={styles.loginFormValidationErrors}>
          {validationErrors.map((err, index) => (
            <p key={index} className={styles.loginFormError}>{err}</p>
          ))}
        </div>
      )}

      {error && <p className={styles.loginFormError}>{error}</p>}

      <div className={styles.loginFormActions}>
        <button
          type="submit"
          className={`${styles.loginFormButton} ${styles.loginFormButtonPrimary}`}
          disabled={isLoading}
        >
          {isLoading ? AUTH_UI.LOGIN.SUBMIT_LOADING : AUTH_UI.LOGIN.SUBMIT_BUTTON}
        </button>
        <button
          type="button"
          className={`${styles.loginFormButton} ${styles.loginFormButtonSecondary}`}
          onClick={onRegisterClick}
        >
          {AUTH_UI.LOGIN.REGISTER_BUTTON}
        </button>
      </div>

      <OAuthButtons />
    </form>
  );
};
