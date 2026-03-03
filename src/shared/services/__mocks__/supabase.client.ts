/**
 * Mock automático del cliente Supabase para tests.
 * Vitest/Jest resuelve este archivo en lugar del real cuando se usa
 * vi.mock('shared/services/supabase.client') o via __mocks__.
 *
 * El mock expone el mismo contrato de interfaz que el cliente real
 * para que los tests puedan configurar respuestas con mockResolvedValue.
 */
export const supabase = {
  auth: {
    signInWithOAuth: vi.fn(),
    signOut: vi.fn(),
    getSession: vi.fn(),
  },
};
