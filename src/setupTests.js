import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock global del cliente Supabase — evita que createClient() se ejecute
// durante los tests con variables de entorno placeholder.
vi.mock('./shared/services/supabase.client', () => ({
  supabase: {
    auth: {
      signInWithOAuth: vi.fn().mockResolvedValue({ error: null }),
      signOut: vi.fn().mockResolvedValue({ error: null }),
      getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
    },
  },
}));
