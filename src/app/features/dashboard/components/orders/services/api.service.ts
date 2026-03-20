import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../environments/environments';
import { OrderTable } from '../interfaces/orders.interface';
import { ApiResponseNoData } from '../../../../../core/interfaces/api-response.interface';
import { OrderDetailResponse } from '../../sales/interfaces/sales.interface';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) {}

  getOrders(
    page = 1,
    perPage = 10,
    filters: Record<string, string> = {},
    sortBy = 'orders.updated_at',
    sortDir = 'desc',
  ): Observable<OrderTable> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const params: any = { page, per_page: perPage, orderBy: sortBy, order: sortDir };
    Object.entries(filters).forEach(([key, value]) => {
      params[`filters[${key}]`] = value;
    });
    return this.http.get<OrderTable>(`${this.baseUrl}/api/v1/admin/orders`, { params });
  }

  getOrderById(id: string): Observable<OrderDetailResponse> {
    return this.http.get<OrderDetailResponse>(`${this.baseUrl}/api/v1/admin/orders/${id}`);
  }

  cancelOrder(id: string): Observable<ApiResponseNoData> {
    return this.http.patch<ApiResponseNoData>(
      `${this.baseUrl}/api/v1/admin/orders/${id}/cancel`,
      {},
    );
  }

  deleteOrder(id: string): Observable<ApiResponseNoData> {
    return this.http.delete<ApiResponseNoData>(`${this.baseUrl}/api/v1/admin/orders/${id}`);
  }
}
