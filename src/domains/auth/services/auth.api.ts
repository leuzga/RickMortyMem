import { ApiResponse } from '../../../shared/types/api.types';
import { AuthResponse, User, LoginCredentials, RegisterCredentials } from '../types/auth.types';

const MOCK_DELAY = 800;
const DB_KEY = 'memory_app_users';

// ─── Type guard ───────────────────────────────────────────────────────────────

const isUser = (value: unknown): value is User => {
  if (typeof value !== 'object' || value === null) return false;
  const obj = value as Record<string, unknown>;
  return (
    typeof obj['id'] === 'string' &&
    typeof obj['username'] === 'string' &&
    typeof obj['email'] === 'string'
  );
};

const getStorageUsers = (): User[] => {
  try {
    const data = localStorage.getItem(DB_KEY);
    if (!data) return [];
    const parsed: unknown = JSON.parse(data);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isUser);
  } catch (error) {
    console.error('Error reading stored users:', error);
    return [];
  }
};

// ─── Auth API (mocked) ────────────────────────────────────────────────────────

export const loginRequest = async (credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> => {
  await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY));

  const users = getStorageUsers();
  const user = users.find((u) => u.email === credentials.email);

  if (!user) {
    return { success: false, error: 'Usuario no encontrado' };
  }

  return {
    success: true,
    data: {
      user,
      tokens: { accessToken: `mock-jwt-${crypto.randomUUID()}` }
    }
  };
};

export const registerRequest = async (credentials: RegisterCredentials): Promise<ApiResponse<User>> => {
  await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY));

  const users = getStorageUsers();

  if (users.some((u) => u.username === credentials.username)) {
    return { success: false, error: 'El nombre de usuario ya existe' };
  }

  if (users.some((u) => u.email === credentials.email)) {
    return { success: false, error: 'El email ya está registrado' };
  }

  const newUser: User = {
    id: crypto.randomUUID(),
    username: credentials.username,
    email: credentials.email
  };

  localStorage.setItem(DB_KEY, JSON.stringify([...users, newUser]));
  return { success: true, data: newUser };
};

export const resetPasswordRequest = async (
  email: string,
  _newPassword: string
): Promise<ApiResponse<void>> => {
  await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY));

  const users = getStorageUsers();
  const userExists = users.some((u) => u.email === email);

  if (!userExists) {
    return { success: false, error: 'No se encontró ninguna cuenta con ese email' };
  }

  // In this mock, passwords are not stored — the reset is simulated.
  // A real implementation would hash and persist the new password here.
  return { success: true };
};