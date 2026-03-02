export interface User {
  id: string;
  username: string;
  email: string;
}

export interface AuthTokens {
  accessToken: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

export interface LoginCredentials {
  username: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
}