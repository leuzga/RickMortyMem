import React from 'react';
import { useRegisterForm } from './useRegisterForm';
import { AUTH_UI } from '../../constants/auth.constants';
import './RegisterForm.css';

interface RegisterFormProps {
  onLoginClick: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onLoginClick }) => {
  const { form, isLoading, error, validationErrors, handleChange, handleSubmit } = useRegisterForm({
    onSuccess: onLoginClick
  });

  return (
    <form className="register-form" onSubmit={handleSubmit} noValidate>
      <div className="register-form__field">
        <label className="register-form__label">{AUTH_UI.REGISTER.USERNAME_LABEL}</label>
        <input
          name="username"
          type="text"
          className="register-form__input"
          value={form.username}
          onChange={handleChange}
          placeholder={AUTH_UI.REGISTER.USERNAME_PLACEHOLDER}
          required
        />
      </div>

      <div className="register-form__field">
        <label className="register-form__label">{AUTH_UI.REGISTER.EMAIL_LABEL}</label>
        <input
          name="email"
          type="email"
          className="register-form__input"
          value={form.email}
          onChange={handleChange}
          placeholder={AUTH_UI.REGISTER.EMAIL_PLACEHOLDER}
          required
        />
      </div>

      <div className="register-form__field">
        <label className="register-form__label">{AUTH_UI.REGISTER.PASSWORD_LABEL}</label>
        <input
          name="password"
          type="password"
          className="register-form__input"
          value={form.password}
          onChange={handleChange}
          placeholder={AUTH_UI.REGISTER.PASSWORD_PLACEHOLDER}
          required
        />
      </div>

      {validationErrors.length > 0 && (
        <div className="register-form__validation-errors">
          {validationErrors.map((err, index) => (
            <p key={index} className="register-form__error">{err}</p>
          ))}
        </div>
      )}

      {error && <p className="register-form__error">{error}</p>}

      <div className="register-form__actions">
        <button
          type="submit"
          className="register-form__button register-form__button--primary"
          disabled={isLoading}
        >
          {isLoading ? AUTH_UI.REGISTER.SUBMIT_LOADING : AUTH_UI.REGISTER.SUBMIT_BUTTON}
        </button>
        <button
          type="button"
          className="register-form__button register-form__button--secondary"
          onClick={onLoginClick}
        >
          {AUTH_UI.REGISTER.LOGIN_BUTTON}
        </button>
      </div>
    </form>
  );
};