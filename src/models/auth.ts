import { Request } from "express";

export interface ResponseDefault {
  message?: string;
  status?: number;
}

export interface ResponseLogin extends ResponseDefault {
  refreshToken?: string;
  accessToken?: string;
}

export interface RegisterParams {
  email: string;
  password: string;
  firstName: string;
  surname: string;
  birthDate: string;
  gender: number;
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

export interface RequestUser extends Request {
  email: string;
}
