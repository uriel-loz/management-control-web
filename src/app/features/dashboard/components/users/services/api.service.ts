import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../../environments/environments';
import { UserTable } from '../interfaces/users-table.interface';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl: string = environment  .baseUrl;

  constructor(private http: HttpClient) { }

  getUsers(
    page: number = 1,
    perPage: number = 10,
    filters: Record<string, string> = {},
    sortBy: string = 'updated_at',
    sortDir: string = 'desc'
  ) {
    const params: any = { page, per_page: perPage, orderBy: sortBy, order: sortDir };

    Object.entries(filters).forEach(([key, value]) => {
      params[`filters[${key}]`] = value;
    });

    return this.http.get<UserTable>(`${this.baseUrl}/api/v1/admin/users`, { params });
  }

}
