import React from 'react';
import { AUTH_UI } from '../../constants/auth.constants';
import './AuthLayout.css';

interface AuthLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title = AUTH_UI.LAYOUT.DEFAULT_TITLE,
}) => {
  return (
    <div className="auth-layout">
      {/* Lado izquierdo - Imagen de fondo */}
      <div className="auth-layout__left">
        <div className="auth-layout__overlay">
          <div className="auth-layout__content">
            <h1 className="auth-layout__title">{AUTH_UI.LAYOUT.GAME_TITLE}</h1>
            <p className="auth-layout__subtitle">{AUTH_UI.LAYOUT.GAME_SUBTITLE}</p>
          </div>
        </div>
      </div>

      {/* Lado derecho - Panel con formulario */}
      <div className="auth-layout__right">
        <div className="auth-layout__form-container">
          {/* Logo en la parte superior */}
          <header className="auth-layout__logo">
            <img
              src={AUTH_UI.LAYOUT.LOGO_PATH}
              alt={AUTH_UI.LAYOUT.LOGO_ALT}
              className="auth-layout__logo-img"
            />
          </header>

          {/* Título de bienvenida */}
          <div className="auth-layout__header">
            <h2 className="auth-layout__welcome">{title}</h2>
          </div>

          {/* Formulario */}
          <div className="auth-layout__form">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
