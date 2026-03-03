import React from 'react';
import { useLoginForm } from './useLoginForm';
import { OAuthButtons } from '../OAuthButtons/OAuthButtons';
import { AUTH_UI } from '../../constants/auth.constants';
import './LoginForm.css';

interface LoginFormProps {
  onRegisterClick: () => void;
  onForgotPasswordClick: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onRegisterClick, onForgotPasswordClick }) => {
  const { form, isLoading, error, validationErrors, handleChange, handleSubmit } = useLoginForm();

  return (
    <form className="login-form" onSubmit={handleSubmit} noValidate>
      <div className="login-form__field">
        <label className="login-form__label">{AUTH_UI.LOGIN.EMAIL_LABEL}</label>
        <input
          name="email"
          type="email"
          className="login-form__input"
          value={form.email}
          onChange={handleChange}
          placeholder={AUTH_UI.LOGIN.EMAIL_PLACEHOLDER}
          required
        />
      </div>

      <div className="login-form__field">
        <label className="login-form__label">{AUTH_UI.LOGIN.PASSWORD_LABEL}</label>
        <input
          name="password"
          type="password"
          className="login-form__input"
          value={form.password}
          onChange={handleChange}
          placeholder={AUTH_UI.LOGIN.PASSWORD_PLACEHOLDER}
          required
        />
      </div>

      <div className="login-form__options">
        <label className="login-form__checkbox">
          <input
            name="rememberMe"
            type="checkbox"
            className="login-form__checkbox-input"
            checked={form.rememberMe || false}
            onChange={handleChange}
          />
          <span className="login-form__checkbox-label">{AUTH_UI.LOGIN.REMEMBER_ME_LABEL}</span>
        </label>
        <button
          type="button"
          className="login-form__forgot"
          onClick={onForgotPasswordClick}
        >
          {AUTH_UI.LOGIN.FORGOT_PASSWORD_LINK}
        </button>
      </div>

      {validationErrors.length > 0 && (
        <div className="login-form__validation-errors">
          {validationErrors.map((err, index) => (
            <p key={index} className="login-form__error">{err}</p>
          ))}
        </div>
      )}

      {error && <p className="login-form__error">{error}</p>}

      <div className="login-form__actions">
        <button
          type="submit"
          className="login-form__button login-form__button--primary"
          disabled={isLoading}
        >
          {isLoading ? AUTH_UI.LOGIN.SUBMIT_LOADING : AUTH_UI.LOGIN.SUBMIT_BUTTON}
        </button>
        <button
          type="button"
          className="login-form__button login-form__button--secondary"
          onClick={onRegisterClick}
        >
          {AUTH_UI.LOGIN.REGISTER_BUTTON}
        </button>
      </div>

      <OAuthButtons />
    </form>
  );
};
