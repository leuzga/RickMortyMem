import { ApiResponse, AuthResponse, User, LoginCredentials, RegisterCredentials } from '../types/auth.types';

const MOCK_DELAY = 800;
const DB_KEY = 'memory_app_users';

const getStorageUsers = (): User[] => {
  const data = localStorage.getItem(DB_KEY);
  return data ? JSON.parse(data) : [];
};

export const loginRequest = async (credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> => {
  await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY));

  const users = getStorageUsers();
  const user = users.find((u) => u.username === credentials.username);

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

  const newUser: User = {
    id: crypto.randomUUID(),
    username: credentials.username,
    email: credentials.email
  };

  localStorage.setItem(DB_KEY, JSON.stringify([...users, newUser]));
  return { success: true, data: newUser };
};