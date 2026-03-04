import React from 'react';
import { AUTH_UI } from '../../constants/auth.constants';
import logoImg from '../../../../assets/images/RMlogo.png';
import styles from './AuthLayout.module.css';

interface AuthLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title = AUTH_UI.LAYOUT.DEFAULT_TITLE,
}) => {
  return (
    <div className={styles.authLayout}>
      {/* Lado izquierdo - Imagen de fondo */}
      <div className={styles.authLayoutLeft}>
        <div className={styles.authLayoutOverlay}>
          <div className={styles.authLayoutContent}>
            <h1 className={styles.authLayoutTitle}>{AUTH_UI.LAYOUT.GAME_TITLE}</h1>
            <p className={styles.authLayoutSubtitle}>{AUTH_UI.LAYOUT.GAME_SUBTITLE}</p>
          </div>
        </div>
      </div>

      {/* Lado derecho - Panel con formulario */}
      <div className={styles.authLayoutRight}>
        <div className={styles.authLayoutFormContainer}>
          {/* Logo en la parte superior */}
          <header className={styles.authLayoutLogo}>
            <img
              src={logoImg}
              alt={AUTH_UI.LAYOUT.LOGO_ALT}
              className={styles.authLayoutLogoImg}
            />
          </header>

          {/* Título de bienvenida */}
          <div className={styles.authLayoutHeader}>
            <h2 className={styles.authLayoutWelcome}>{title}</h2>
          </div>

          {/* Formulario */}
          <div className={styles.authLayoutForm}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
