import { ApiResponse } from "../../../core/interfaces/api-response.interface";

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
}

export type ModulesResponse = ApiResponse<Section[]>;