import React from 'react';
import { useAuthStore } from '../../../domains/auth/store/useAuthStore';
import { useHeaderMenu } from './useHeaderMenu';
import { ARIA_LABELS, HEADER_UI } from '../../constants/ui.constants';
import avatarImg from '../../../assets/images/avatar.png';
import styles from './Header.module.css';

// ─── Guest icon (SVG, bordes blancos) ────────────────────────────────────────

const GuestIcon: React.FC = () => (
  <svg
    className={styles.headerAvatarGuest}
    viewBox="0 0 38 38"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-label={HEADER_UI.GUEST_ICON_LABEL}
  >
    <circle cx="19" cy="14" r="6" stroke="white" strokeWidth="2" />
    <path
      d="M6 33c0-7.18 5.82-13 13-13s13 5.82 13 13"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

// ─── Header ───────────────────────────────────────────────────────────────────

export const Header: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const {
    isOpen,
    handleMouseEnterTrigger,
    handleMouseLeaveTrigger,
    handleMouseEnterMenu,
    handleMouseLeaveMenu,
  } = useHeaderMenu();

  const handleLogout = (): void => {
    logout();
  };

  return (
    <header className={styles.header} role="banner">
      <div
        className={styles.headerAvatarWrapper}
        aria-label={ARIA_LABELS.HEADER_AVATAR}
        aria-haspopup="true"
        aria-expanded={isOpen}
        onMouseEnter={handleMouseEnterTrigger}
        onMouseLeave={handleMouseLeaveTrigger}
      >
        {/* Avatar / Guest icon */}
        {isAuthenticated ? (
          <>
            <img
              src={avatarImg}
              alt={HEADER_UI.AVATAR_ALT}
              className={styles.headerAvatar}
            />
            {user?.username && (
              <span className={styles.headerUsername}>{user.username}</span>
            )}
          </>
        ) : (
          <GuestIcon />
        )}

        {/* Dropdown menu */}
        {isOpen && (
          <nav
            className={styles.headerMenu}
            role="menu"
            aria-label={ARIA_LABELS.HEADER_MENU}
            onMouseEnter={handleMouseEnterMenu}
            onMouseLeave={handleMouseLeaveMenu}
          >
            {isAuthenticated ? (
              <button
                className={`${styles.headerMenuItem} ${styles.headerMenuItemDanger}`}
                role="menuitem"
                onClick={handleLogout}
              >
                <span aria-hidden="true">{HEADER_UI.MENU.LOGOUT_ICON}</span>
                {HEADER_UI.MENU.LOGOUT}
              </button>
            ) : (
              <button
                className={styles.headerMenuItem}
                role="menuitem"
                onClick={() => { /* login redirect handled by App state */ }}
              >
                <span aria-hidden="true">{HEADER_UI.MENU.LOGIN_ICON}</span>
                {HEADER_UI.MENU.LOGIN}
              </button>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};
