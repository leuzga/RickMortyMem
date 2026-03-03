import React from 'react';
import { useOAuthButtons } from './useOAuthButtons';
import { OAUTH_PROVIDERS } from '../../types/oauth.types';
import { OAUTH_PROVIDER_META, OAUTH_UI } from './oauth.buttons.constants';
import type { OAuthProvider } from '../../types/oauth.types';
import './OAuthButtons.css';

export const OAuthButtons: React.FC = () => {
  const { loadingProvider, handleOAuthLogin } = useOAuthButtons();

  return (
    <div className="oauth-buttons">
      <div className="oauth-buttons__separator">
        <span className="oauth-buttons__separator-line" />
        <span className="oauth-buttons__separator-text">{OAUTH_UI.SEPARATOR_TEXT}</span>
        <span className="oauth-buttons__separator-line" />
      </div>

      <div className="oauth-buttons__list">
        {OAUTH_PROVIDERS.map((provider: OAuthProvider) => {
          const meta = OAUTH_PROVIDER_META[provider];
          const isLoading = loadingProvider === provider;
          const isDisabled = loadingProvider !== null;

          return (
            <button
              key={provider}
              type="button"
              className={`oauth-buttons__btn oauth-buttons__btn--${provider}`}
              aria-label={meta.ariaLabel}
              disabled={isDisabled}
              onClick={() => handleOAuthLogin(provider)}
            >
              <span className="oauth-buttons__icon" aria-hidden="true">
                {isLoading ? '⏳' : meta.icon}
              </span>
              <span className="oauth-buttons__label">
                {isLoading ? `${meta.label}${OAUTH_UI.LOADING_SUFFIX}` : meta.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
