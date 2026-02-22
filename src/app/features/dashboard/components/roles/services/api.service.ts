import { Injectable } from '@angular/core';
import { environment } from '../../../../../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RolesResponse } from '../interfaces/roles.interfaces';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getRoles(): Observable<RolesResponse> {
    return this.http.get<RolesResponse>(`${this.baseUrl}/api/v1/admin/roles`);
  }
}
