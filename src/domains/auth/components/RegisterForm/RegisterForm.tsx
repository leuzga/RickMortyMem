import React from 'react';
import { useRegisterForm } from './useRegisterForm';
import './RegisterForm.css';

export const RegisterForm: React.FC = () => {
  const { form, isLoading, error, handleChange, handleSubmit } = useRegisterForm();

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <header className="text-center mb-4">
        <h1 className="text-3xl font-black text-white italic">ÚNETE AL JUEGO</h1>
        <p className="text-gray-500 text-sm">Crea tu identidad interdimensional</p>
      </header>

      <div className="flex flex-col gap-1">
        <label className="auth-label">Username</label>
        <input
          name="username"
          className="auth-input"
          value={form.username}
          onChange={handleChange}
          placeholder="Rick_C137"
          required
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="auth-label">Email</label>
        <input
          name="email"
          type="email"
          className="auth-input"
          value={form.email}
          onChange={handleChange}
          placeholder="rick@citadel.com"
          required
        />
      </div>

      {error && <p className="text-red-500 text-xs font-bold text-center">{error}</p>}

      <button className="auth-button" type="submit" disabled={isLoading}>
        {isLoading ? 'Teletransportando...' : 'Registrarme'}
      </button>
    </form>
  );
};