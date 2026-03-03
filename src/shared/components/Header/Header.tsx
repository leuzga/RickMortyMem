import React from 'react';
import { useAuthStore } from '../../../domains/auth/store/useAuthStore';
import { useHeaderMenu } from './useHeaderMenu';
import { ARIA_LABELS, HEADER_UI } from '../../constants/ui.constants';
import './Header.css';

// ─── Guest icon (SVG, bordes blancos) ────────────────────────────────────────

const GuestIcon: React.FC = () => (
  <svg
    className="header__avatar--guest"
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
    <header className="header" role="banner">
      <div
        className="header__avatar-wrapper"
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
              src={HEADER_UI.AVATAR_PATH}
              alt={HEADER_UI.AVATAR_ALT}
              className="header__avatar"
            />
            {user?.username && (
              <span className="header__username">{user.username}</span>
            )}
          </>
        ) : (
          <GuestIcon />
        )}

        {/* Dropdown menu */}
        {isOpen && (
          <nav
            className="header__menu"
            role="menu"
            aria-label={ARIA_LABELS.HEADER_MENU}
            onMouseEnter={handleMouseEnterMenu}
            onMouseLeave={handleMouseLeaveMenu}
          >
            {isAuthenticated ? (
              <button
                className="header__menu-item header__menu-item--danger"
                role="menuitem"
                onClick={handleLogout}
              >
                <span aria-hidden="true">{HEADER_UI.MENU.LOGOUT_ICON}</span>
                {HEADER_UI.MENU.LOGOUT}
              </button>
            ) : (
              <button
                className="header__menu-item"
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
