import React, { Suspense, lazy } from 'react';
import { useAuthStore } from './domains/auth/store/useAuthStore';
import { AuthLayout } from './domains/auth/components/AuthLayout/AuthLayout';
import { LoginForm } from './domains/auth/components/LoginForm/LoginForm';
import { RegisterForm } from './domains/auth/components/RegisterForm/RegisterForm';
import { ForgotPasswordForm } from './domains/auth/components/ForgotPasswordForm/ForgotPasswordForm';
import { ToastContainer } from './shared/components/Toast/ToastContainer';
import { Header } from './shared/components/Header/Header';
import { getLayoutTitle, isOAuthCallback } from './domains/auth/utils/auth.utils';
import type { ActiveForm } from './domains/auth/utils/auth.utils';
import './App.css';

const GameBoard = lazy(() =>
  import('./domains/game/components/GameBoard/GameBoard').then((m) => ({ default: m.GameBoard }))
);

const App: React.FC = () => {
  const { isAuthenticated, loginWithOAuthCallback } = useAuthStore();
  const [activeForm, setActiveForm] = React.useState<ActiveForm>('login');

  React.useEffect(() => {
    if (isOAuthCallback()) void loginWithOAuthCallback();
  }, [loginWithOAuthCallback]);

  return (
    <main className={`app-container ${isAuthenticated ? 'app-container--game' : ''}`}>
      <Header />
      {isAuthenticated ? (
        <Suspense fallback={<div className="app-loading" aria-live="polite" aria-label="Cargando juego…" />}>
          <GameBoard />
        </Suspense>
      ) : (
        <AuthLayout title={getLayoutTitle(activeForm)}>
          {activeForm === 'register' && (
            <RegisterForm onLoginClick={() => setActiveForm('login')} />
          )}
          {activeForm === 'forgot-password' && (
            <ForgotPasswordForm onLoginClick={() => setActiveForm('login')} />
          )}
          {activeForm === 'login' && (
            <LoginForm
              onRegisterClick={() => setActiveForm('register')}
              onForgotPasswordClick={() => setActiveForm('forgot-password')}
            />
          )}
        </AuthLayout>
      )}
      <ToastContainer />
    </main>
  );
};

export default App;