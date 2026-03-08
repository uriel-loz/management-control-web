import { ResponseTable } from '../../../../../core/interfaces/table-response.interface';

export interface User extends Record<string, string> {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  role_id: string;
  type: string;
  created_at: string;
  updated_at: string;
}

export type UserTable = ResponseTable<User>;

export interface CreateUserRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
  role_id: string;
  is_customer: number;
}

export interface UpdateUserRequest {
  name: string;
  email: string;
  phone: string;
  password?: string;
  role_id: string;
  is_customer: number;
}
