import React from 'react';
import { useAuthStore } from './domains/auth/store/useAuthStore';
import { LoginForm } from './domains/auth/components/LoginForm/LoginForm';
import { RegisterForm } from './domains/auth/components/RegisterForm/RegisterForm';
import './App.css';

const App: React.FC = () => {
  const { isAuthenticated, user } = useAuthStore();
  const [showRegister, setShowRegister] = React.useState<boolean>(false);

  return (
    <main className="app-container">
      {isAuthenticated ? (
        <div className="welcome-screen">
          <h1 className="text-4xl font-black">¡BIENVENIDO, {user?.username}!</h1>
          <p className="text-cyan-500">Pronto comenzaremos con el juego de Rick and Morty...</p>
          {/* Aquí irá el tablero del juego en el siguiente paso */}
        </div>
      ) : (
        <div className="auth-wrapper">
          {showRegister ? <RegisterForm /> : <LoginForm />}

          <button
            onClick={() => setShowRegister((prev) => !prev)}
            className="toggle-auth-btn"
          >
            {showRegister ? '¿Ya tienes cuenta? Ingresa' : '¿No tienes cuenta? Regístrate'}
          </button>
        </div>
      )}
    </main>
  );
};

export default App;