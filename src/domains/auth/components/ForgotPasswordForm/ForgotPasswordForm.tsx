import React from 'react';
import { useForgotPasswordForm } from './useForgotPasswordForm';
import { AUTH_UI } from '../../constants/auth.constants';
import styles from './ForgotPasswordForm.module.css';

interface ForgotPasswordFormProps {
  onLoginClick: () => void;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onLoginClick }) => {
  const { form, isLoading, validationErrors, handleChange, handleSubmit } =
    useForgotPasswordForm({ onSuccess: onLoginClick });

  return (
    <form className={styles.forgotForm} onSubmit={handleSubmit} noValidate>
      <p className={styles.forgotFormSubtitle}>{AUTH_UI.FORGOT_PASSWORD.SUBTITLE}</p>

      <div className={styles.forgotFormField}>
        <label className={styles.forgotFormLabel}>{AUTH_UI.FORGOT_PASSWORD.EMAIL_LABEL}</label>
        <input
          name="email"
          type="email"
          className={styles.forgotFormInput}
          value={form.email}
          onChange={handleChange}
          placeholder={AUTH_UI.FORGOT_PASSWORD.EMAIL_PLACEHOLDER}
          required
        />
      </div>

      <div className={styles.forgotFormField}>
        <label className={styles.forgotFormLabel}>{AUTH_UI.FORGOT_PASSWORD.NEW_PASSWORD_LABEL}</label>
        <input
          name="newPassword"
          type="password"
          className={styles.forgotFormInput}
          value={form.newPassword}
          onChange={handleChange}
          placeholder={AUTH_UI.FORGOT_PASSWORD.NEW_PASSWORD_PLACEHOLDER}
          required
        />
      </div>

      {validationErrors.length > 0 && (
        <div className={styles.forgotFormValidationErrors}>
          {validationErrors.map((err, index) => (
            <p key={index} className={styles.forgotFormError}>{err}</p>
          ))}
        </div>
      )}

      <div className={styles.forgotFormActions}>
        <button
          type="submit"
          className={styles.forgotFormButtonPrimary}
          disabled={isLoading}
        >
          {isLoading
            ? AUTH_UI.FORGOT_PASSWORD.SUBMIT_LOADING
            : AUTH_UI.FORGOT_PASSWORD.SUBMIT_BUTTON}
        </button>
        <button
          type="button"
          className={styles.forgotFormButtonSecondary}
          onClick={onLoginClick}
        >
          {AUTH_UI.FORGOT_PASSWORD.BACK_TO_LOGIN}
        </button>
      </div>
    </form>
  );
};
