import { describe, it, expect } from 'vitest';
import {
  validateEmail,
  validatePassword,
  validateUsername,
  validateLoginCredentials,
  validateRegisterCredentials,
  validateRequiredFields,
} from './validators';

// ─── validateEmail ────────────────────────────────────────────────────────────

describe('validateEmail', () => {
  it('debe retornar error si el email está vacío', () => {
    const result = validateEmail('');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('El email es requerido');
  });

  it('debe retornar error si el email no tiene dominio válido', () => {
    const result = validateEmail('user@nodomain');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('El email no es válido');
  });

  it('debe retornar error si el email no tiene @', () => {
    const result = validateEmail('usernodomain.com');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('El email no es válido');
  });

  it('debe retornar válido para un email correcto', () => {
    const result = validateEmail('user@example.com');
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('debe aceptar emails con subdominios', () => {
    const result = validateEmail('user@mail.example.co');
    expect(result.isValid).toBe(true);
  });
});

// ─── validatePassword ─────────────────────────────────────────────────────────

describe('validatePassword', () => {
  it('debe retornar error si la contraseña está vacía', () => {
    const result = validatePassword('');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('La contraseña es requerida');
  });

  it('debe retornar error si la contraseña tiene menos de 6 caracteres', () => {
    const result = validatePassword('abc');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('La contraseña debe tener al menos 6 caracteres');
  });

  it('debe retornar error si la contraseña supera los 50 caracteres', () => {
    const result = validatePassword('a'.repeat(51));
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('La contraseña es demasiado larga');
  });

  it('debe retornar válido para una contraseña con exactamente 6 caracteres', () => {
    const result = validatePassword('abcdef');
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('debe retornar válido para una contraseña de longitud normal', () => {
    const result = validatePassword('mySecurePass123');
    expect(result.isValid).toBe(true);
  });
});

// ─── validateUsername ─────────────────────────────────────────────────────────

describe('validateUsername', () => {
  it('debe retornar error si el username está vacío', () => {
    const result = validateUsername('');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('El nombre de usuario es requerido');
  });

  it('debe retornar error si el username tiene menos de 3 caracteres', () => {
    const result = validateUsername('ab');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('El nombre de usuario debe tener al menos 3 caracteres');
  });

  it('debe retornar error si el username supera los 20 caracteres', () => {
    const result = validateUsername('a'.repeat(21));
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('El nombre de usuario es demasiado largo');
  });

  it('debe retornar error si el username contiene caracteres especiales', () => {
    const result = validateUsername('user-name!');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain(
      'El nombre de usuario solo puede contener letras, números y guiones bajos'
    );
  });

  it('debe aceptar username con letras, números y guiones bajos', () => {
    const result = validateUsername('rick_morty_99');
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('debe aceptar username con exactamente 3 caracteres', () => {
    const result = validateUsername('abc');
    expect(result.isValid).toBe(true);
  });
});

// ─── validateLoginCredentials ─────────────────────────────────────────────────

describe('validateLoginCredentials', () => {
  it('debe retornar todos los errores cuando email y password están vacíos', () => {
    const result = validateLoginCredentials('', '');
    expect(result.isValid).toBe(false);
    expect(result.errors.length).toBeGreaterThanOrEqual(2);
  });

  it('debe retornar sólo errores de email cuando password es válida', () => {
    const result = validateLoginCredentials('invalid', 'password123');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('El email no es válido');
    expect(result.errors).not.toContain('La contraseña es requerida');
  });

  it('debe retornar sólo errores de password cuando email es válido', () => {
    const result = validateLoginCredentials('user@example.com', '123');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('La contraseña debe tener al menos 6 caracteres');
  });

  it('debe retornar válido con email y password correctos', () => {
    const result = validateLoginCredentials('user@example.com', 'securePass');
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });
});

// ─── validateRegisterCredentials ─────────────────────────────────────────────

describe('validateRegisterCredentials', () => {
  it('debe acumular errores de todos los campos cuando están vacíos', () => {
    const result = validateRegisterCredentials('', '', '');
    expect(result.isValid).toBe(false);
    expect(result.errors.length).toBeGreaterThanOrEqual(3);
  });

  it('debe retornar válido con todos los campos correctos', () => {
    const result = validateRegisterCredentials('rick_sanchez', 'rick@citadel.com', 'wubbaLubba');
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('debe retornar error sólo de username cuando email y password son válidos', () => {
    const result = validateRegisterCredentials('ab', 'rick@citadel.com', 'wubbaLubba');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('El nombre de usuario debe tener al menos 3 caracteres');
  });
});

// ─── validateRequiredFields ───────────────────────────────────────────────────

describe('validateRequiredFields', () => {
  it('debe retornar error por cada campo faltante', () => {
    const result = validateRequiredFields({ name: '', email: 'test@x.com' }, ['name', 'email']);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('El campo name es requerido');
    expect(result.errors).not.toContain('El campo email es requerido');
  });

  it('debe retornar válido cuando todos los campos tienen valor', () => {
    const result = validateRequiredFields(
      { name: 'Rick', email: 'rick@c137.com' },
      ['name', 'email']
    );
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('debe retornar error para campo con valor undefined', () => {
    const result = validateRequiredFields({ name: undefined }, ['name']);
    expect(result.isValid).toBe(false);
  });
});
