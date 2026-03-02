import { ResponseTable } from "../../../../../core/interfaces/table-response.interface";

export interface User extends Record<string, string> {
    id:         string;
    name:       string;
    email:      string;
    phone:      string;
    role:       string;
    type:       string;
    created_at: string;
    updated_at: string;
}

export type UserTable = ResponseTable<User>;
