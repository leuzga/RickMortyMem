import React from 'react';
import { useForgotPasswordForm } from './useForgotPasswordForm';
import { AUTH_UI } from '../../constants/auth.constants';
import './ForgotPasswordForm.css';

interface ForgotPasswordFormProps {
  onLoginClick: () => void;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onLoginClick }) => {
  const { form, isLoading, validationErrors, handleChange, handleSubmit } =
    useForgotPasswordForm({ onSuccess: onLoginClick });

  return (
    <form className="forgot-form" onSubmit={handleSubmit} noValidate>
      <p className="forgot-form__subtitle">{AUTH_UI.FORGOT_PASSWORD.SUBTITLE}</p>

      <div className="forgot-form__field">
        <label className="forgot-form__label">{AUTH_UI.FORGOT_PASSWORD.EMAIL_LABEL}</label>
        <input
          name="email"
          type="email"
          className="forgot-form__input"
          value={form.email}
          onChange={handleChange}
          placeholder={AUTH_UI.FORGOT_PASSWORD.EMAIL_PLACEHOLDER}
          required
        />
      </div>

      <div className="forgot-form__field">
        <label className="forgot-form__label">{AUTH_UI.FORGOT_PASSWORD.NEW_PASSWORD_LABEL}</label>
        <input
          name="newPassword"
          type="password"
          className="forgot-form__input"
          value={form.newPassword}
          onChange={handleChange}
          placeholder={AUTH_UI.FORGOT_PASSWORD.NEW_PASSWORD_PLACEHOLDER}
          required
        />
      </div>

      {validationErrors.length > 0 && (
        <div className="forgot-form__validation-errors">
          {validationErrors.map((err, index) => (
            <p key={index} className="forgot-form__error">{err}</p>
          ))}
        </div>
      )}

      <div className="forgot-form__actions">
        <button
          type="submit"
          className="forgot-form__button--primary"
          disabled={isLoading}
        >
          {isLoading
            ? AUTH_UI.FORGOT_PASSWORD.SUBMIT_LOADING
            : AUTH_UI.FORGOT_PASSWORD.SUBMIT_BUTTON}
        </button>
        <button
          type="button"
          className="forgot-form__button--secondary"
          onClick={onLoginClick}
        >
          {AUTH_UI.FORGOT_PASSWORD.BACK_TO_LOGIN}
        </button>
      </div>
    </form>
  );
};
