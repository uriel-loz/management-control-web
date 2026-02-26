import { ApiResponse } from "../../../../../core/interfaces/api-response.interface";

export interface Roles {
    id:           string;
    name:         string;
    created_at:   Date;
    updated_at:   Date;
    deleted_at:   null;
    permissions?:  Permission[];
    quantity_users?: number;
}

export interface Permission {
    id:        string;
    name:      string;
    module_id: string;
    pivot:     Pivot;
    module:    Module;
}

export interface Module {
    id:   string;
    name: string;
}

export interface Pivot {
    role_id:       string;
    permission_id: string;
    created_at:    Date;
    updated_at:    Date;
}

export type RolesResponse = ApiResponse<Roles[]>;
export type SingleRoleResponse = ApiResponse<Roles>;

export interface SaveRoleRequest {
    role: string;
    modules?: string[];
}