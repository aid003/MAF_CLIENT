export interface User {
  id: string | null;
  name: string | null;
  email: string | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface AuthResponse {
  id: string;
  name: string;
  email: string;
  token: string;
}