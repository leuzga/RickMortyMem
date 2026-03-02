import React from 'react';
import { useLoginForm } from './useLoginForm';
import './LoginForm.css';

export const LoginForm: React.FC = () => {
  const { form, isLoading, error, handleChange, handleSubmit } = useLoginForm();

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <header className="text-center mb-4">
        <h1 className="text-3xl font-black text-white italic">INGRESAR AL PORTAL</h1>
        <p className="text-gray-500 text-sm">Conecta con tu identidad interdimensional</p>
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

      {error && <p className="text-red-500 text-xs font-bold text-center">{error}</p>}

      <button className="auth-button" type="submit" disabled={isLoading}>
        {isLoading ? 'Abriendo portal...' : 'Ingresar'}
      </button>
    </form>
  );
};
