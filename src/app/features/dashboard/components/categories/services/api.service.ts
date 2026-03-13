import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../environments/environments';
import { CategoryTable, CreateCategoryRequest, UpdateCategoryRequest } from '../interfaces/categories.interface';
import { ApiResponseNoData } from '../../../../../core/interfaces/api-response.interface';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) {}

  getCategories(
    page: number = 1,
    perPage: number = 10,
    filters: Record<string, string> = {},
    sortBy: string = 'updated_at',
    sortDir: string = 'desc'
  ): Observable<CategoryTable> {
    const params: Record<string, string | number> = {
      page,
      per_page: perPage,
      orderBy: sortBy,
      order: sortDir,
    };

    Object.entries(filters).forEach(([key, value]) => {
      params[`filters[${key}]`] = value;
    });

    return this.http
      .get<CategoryTable>(`${this.baseUrl}/api/v1/admin/categories`, { params });
  }

  createCategory(payload: CreateCategoryRequest): Observable<ApiResponseNoData> {
    return this.http.post<ApiResponseNoData>(`${this.baseUrl}/api/v1/admin/categories`, payload);
  }

  updateCategory(id: string, payload: UpdateCategoryRequest): Observable<ApiResponseNoData> {
    return this.http.put<ApiResponseNoData>(`${this.baseUrl}/api/v1/admin/categories/${id}`, payload);
  }

  deleteCategory(id: string): Observable<ApiResponseNoData> {
    return this.http.delete<ApiResponseNoData>(`${this.baseUrl}/api/v1/admin/categories/${id}`);
  }
}
