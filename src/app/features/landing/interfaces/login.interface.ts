import { ApiResponse } from '../../../core/interfaces/api-response.interface';

export interface User {
    id:                string;
    name:              string;
    email:             string;
    phone:             string;
    created_at:        Date;
    updated_at:        Date;
}
export interface LoginData {
    user: User;
}

export type LoginResponse = ApiResponse<LoginData>;
