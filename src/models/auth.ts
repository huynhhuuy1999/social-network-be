export interface AuthResponse {
  message: string;
}

export interface RegisterParams {
  firstName: string;
  surname: string;
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
