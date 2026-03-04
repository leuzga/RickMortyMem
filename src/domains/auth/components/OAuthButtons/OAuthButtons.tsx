import React from 'react';
import { useOAuthButtons } from './useOAuthButtons';
import { OAUTH_PROVIDERS } from '../../types/oauth.types';
import { OAUTH_PROVIDER_META, OAUTH_UI } from './oauth.buttons.constants';
import type { OAuthProvider } from '../../types/oauth.types';
import styles from './OAuthButtons.module.css';

export const OAuthButtons: React.FC = () => {
  const { loadingProvider, handleOAuthLogin } = useOAuthButtons();

  return (
    <div className={styles.oauthButtons}>
      <div className={styles.oauthButtonsSeparator}>
        <span className={styles.oauthButtonsSeparatorLine} />
        <span className={styles.oauthButtonsSeparatorText}>{OAUTH_UI.SEPARATOR_TEXT}</span>
        <span className={styles.oauthButtonsSeparatorLine} />
      </div>

      <div className={styles.oauthButtonsList}>
        {OAUTH_PROVIDERS.map((provider: OAuthProvider) => {
          const meta = OAUTH_PROVIDER_META[provider];
          const isLoading = loadingProvider === provider;
          const isDisabled = loadingProvider !== null;

          return (
            <button
              key={provider}
              type="button"
              className={`${styles.oauthButtonsBtn} ${styles[`oauthButtonsBtn${provider.charAt(0).toUpperCase() + provider.slice(1)}`]}`}
              aria-label={meta.ariaLabel}
              disabled={isDisabled}
              onClick={() => handleOAuthLogin(provider)}
            >
              <span className={styles.oauthButtonsIcon} aria-hidden="true">
                {isLoading ? '⏳' : meta.icon}
              </span>
              <span className={styles.oauthButtonsLabel}>
                {isLoading ? `${meta.label}${OAUTH_UI.LOADING_SUFFIX}` : meta.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
