import React from 'react';
import { useAuthStore } from './domains/auth/store/useAuthStore';
import { AuthLayout } from './domains/auth/components/AuthLayout/AuthLayout';
import { LoginForm } from './domains/auth/components/LoginForm/LoginForm';
import { RegisterForm } from './domains/auth/components/RegisterForm/RegisterForm';
import { ForgotPasswordForm } from './domains/auth/components/ForgotPasswordForm/ForgotPasswordForm';
import { ToastContainer } from './shared/components/Toast/ToastContainer';
import { Header } from './shared/components/Header/Header';
import { getLayoutTitle, isOAuthCallback } from './domains/auth/utils/auth.utils';
import type { ActiveForm } from './domains/auth/utils/auth.utils';
import { MESSAGES } from './shared/constants/messages';
import './App.css';

const App: React.FC = () => {
  const { isAuthenticated, user, loginWithOAuthCallback } = useAuthStore();
  const [activeForm, setActiveForm] = React.useState<ActiveForm>('login');

  React.useEffect(() => {
    if (isOAuthCallback()) void loginWithOAuthCallback();
  }, [loginWithOAuthCallback]);

  return (
    <main className="app-container">
      <Header />
      {isAuthenticated ? (
        <div className="welcome-screen">
          <h1 className="text-4xl font-black">{MESSAGES.APP.WELCOME_HEADING} {user?.username}!</h1>
          <p className="text-cyan-500">{MESSAGES.APP.WELCOME_SUBTITLE}</p>
        </div>
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