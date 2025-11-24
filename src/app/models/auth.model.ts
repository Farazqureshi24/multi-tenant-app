export interface User {
  id: string;
  email: string;
  username: string;
  fullName: string;
  role: 'admin' | 'user';
  tenantId: string;
  avatar?: string;
  isActive: boolean;
  createdAt: Date;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  user: User;
  token: string;
  message?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  loading: boolean;
  error: string | null;
}
