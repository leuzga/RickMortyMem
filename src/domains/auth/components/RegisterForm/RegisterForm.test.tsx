import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { RegisterForm } from './RegisterForm';

describe('RegisterForm Component', () => {
  it('debe mostrar los campos de username y email', () => {
    render(<RegisterForm />);
    expect(screen.getByPlaceholderText('Rick_C137')).toBeDefined();
    expect(screen.getByPlaceholderText('rick@citadel.com')).toBeDefined();
  });

  it('el botón de submit debe existir', () => {
    render(<RegisterForm />);
    const btn = screen.getByRole('button');
    expect(btn).toBeDefined();
    expect(btn.textContent).toContain('Registrarme');
  });
});