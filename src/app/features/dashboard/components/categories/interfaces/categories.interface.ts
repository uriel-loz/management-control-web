import { ResponseTable } from '../../../../../core/interfaces/table-response.interface';

export interface Category extends Record<string, string | number> {
  id: string;
  name: string;
  slug: string;
  description: string;
  products_count: number;
  created_at: string;
  updated_at: string;
}

export type CategoryTable = ResponseTable<Category>;

export interface CreateCategoryRequest {
  name: string;
  description: string;
}

export interface UpdateCategoryRequest {
  name: string;
  description: string;
}
