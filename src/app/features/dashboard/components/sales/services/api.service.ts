import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../environments/environments';
import { PaymentTable } from '../interfaces/sales.interface';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) {}

  getPayments(
    page = 1,
    perPage = 10,
    filters: Record<string, string> = {},
    sortBy = 'payments.updated_at',
    sortDir = 'desc',
  ): Observable<PaymentTable> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const params: any = { page, per_page: perPage, orderBy: sortBy, order: sortDir };
    Object.entries(filters).forEach(([key, value]) => {
      params[`filters[${key}]`] = value;
    });
    return this.http.get<PaymentTable>(`${this.baseUrl}/api/v1/admin/payments`, { params });
  }
}
