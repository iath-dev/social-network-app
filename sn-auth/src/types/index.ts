import { Request } from 'express';

export interface User {
  id: number;
  username: string;
  password: string;
  name: string;
  email: string;
  created_at: Date;
}

export interface UserInput {
  username: string;
  password: string;
  name: string;
  email: string;
}

export interface AuthTokenPayload {
  id: number;
  username: string;
}

export interface AuthResponse {
  user: Omit<User, 'password'>;
  token: string;
}

export interface DatabaseConnection {
  execute: (sql: string, params?: any, options?: any) => Promise<any>;
  close: () => Promise<void>;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthTokenPayload;
}