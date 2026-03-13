import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../environments/environments';
import {
  ProductTable,
  CreateProductRequest,
  CreateProductResponse,
  UpdateProductRequest,
} from '../interfaces/products.interface';
import { ApiResponseNoData } from '../../../../../core/interfaces/api-response.interface';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) {}

  getProducts(
    page = 1,
    perPage = 10,
    filters: Record<string, string> = {},
    sortBy = 'products.updated_at',
    sortDir = 'desc',
  ): Observable<ProductTable> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const params: any = { page, per_page: perPage, orderBy: sortBy, order: sortDir };
    Object.entries(filters).forEach(([key, value]) => {
      params[`filters[${key}]`] = value;
    });
    return this.http
      .get<ProductTable>(`${this.baseUrl}/api/v1/admin/products`, { params });
  }

  createProduct(payload: CreateProductRequest): Observable<CreateProductResponse> {
    return this.http.post<CreateProductResponse>(`${this.baseUrl}/api/v1/admin/products`, payload);
  }

  updateProduct(id: string, payload: UpdateProductRequest): Observable<ApiResponseNoData> {
    return this.http.put<ApiResponseNoData>(`${this.baseUrl}/api/v1/admin/products/${id}`, payload);
  }

  deleteProduct(id: string): Observable<ApiResponseNoData> {
    return this.http.delete<ApiResponseNoData>(`${this.baseUrl}/api/v1/admin/products/${id}`);
  }

  /**
   * POST /api/v1/admin/images
   * FormData: product_id + images[] (n archivos)
   * La primera imagen del array será la imagen principal (main_image) en el backend.
   */
  uploadImages(productId: string, images: File[]): Observable<ApiResponseNoData> {
    const formData = new FormData();
    formData.append('product_id', productId);
    images.forEach(file => formData.append('images[]', file, file.name));
    return this.http.post<ApiResponseNoData>(`${this.baseUrl}/api/v1/admin/images`, formData);
  }
}
