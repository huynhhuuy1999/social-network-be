import { Request } from "express";

export interface RegisterParams {
  email: string;
  password: string;
  firstName: string;
  surname: string;
  birthDate: string;
  gender: number;
}

export interface RegisterResponse {
  accessToken?: string;
  refreshToken?: string;
  infoUser?: RegisterParams;
}

export interface User {
  avatar?: string | null;
  birthDate?: string;
  email?: string;
  firstName?: string;
  gender?: number;
  id?: string;
  password?: string;
  refreshToken?: string;
  surname?: string;
}

export interface LoginParams {
  email: string;
  password: string;
  browserId?: string;
}

export interface RequestUser extends Request {
  user: User;
  email?: string;
}
