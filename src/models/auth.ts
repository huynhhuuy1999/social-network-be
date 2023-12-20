export interface AuthResponse {
  message: string;
}

export interface RegisterParams {
  userName?: string;
  address?: string;
}

export interface User {
  userName?: string;
  phone?: string;
  address?: string;
}
