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

  getUsers(page: number = 1, perPage: number = 10) {
    return this.http.get<UserTable>(`${this.baseUrl}/api/v1/admin/users`, {
      params: { page, per_page: perPage },
    });
  }

}
