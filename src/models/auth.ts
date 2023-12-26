export interface AuthResponse {
  message: string;
  status: number;
}

export interface RegisterParams {
  email: string;
  password: string;
}

export interface User {
  userName?: string;
  phone?: string;
  address?: string;
  id: number;
}

export interface LoginParams {
  email: string;
  password: string;
}
