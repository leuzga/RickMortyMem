import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App Root Component', () => {
  it('debe mostrar el login por defecto cuando no está autenticado', () => {
    render(<App />);
    const loginTitle = screen.getByText(/INGRESAR AL PORTAL/i);
    expect(loginTitle).toBeDefined();
  });
});