import { ApiResponse } from "../../../core/interfaces/api-response.interface";
import { Permission } from "../../../features/dashboard/components/roles/interfaces/roles.interfaces";

export interface Section {
    id:          string;
    name:        string;
    slug:        string;
    order:       number;
    created_at:  null;
    updated_at:  null;
    modules?:    Module[];
    section_id?: string;
}

export interface Module {
    id:          string;
    name:        string;
    slug:        string;
    icon:        string;
    order:       number;
    section_id:  string;
    created_at:  null;
    updated_at:  null;
    permissions?: Permission[];
}

export type ModulesResponse = ApiResponse<Section[]>;