import { ResponseTable } from '../../../../../core/interfaces/table-response.interface';
import { ApiResponse } from '../../../../../core/interfaces/api-response.interface';

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
}

export interface Product extends Record<string, unknown> {
  id: string;
  name: string;
  slug: string;
  price: string;
  quantity: number;
  description: string;
  created_at: string;
  updated_at: string;
  main_image: string;
  categories: ProductCategory[];
}

export type ProductTable = ResponseTable<Product>;

/** Tipo de retorno de POST /api/v1/admin/products — incluye el producto creado con su id */
export type CreateProductResponse = ApiResponse<Product>;

export interface CreateProductRequest {
  name: string;
  slug: string;
  price: string;
  quantity: number;
  description: string;
}

export interface UpdateProductRequest {
  name: string;
  slug: string;
  price: string;
  quantity: number;
  description: string;
}
