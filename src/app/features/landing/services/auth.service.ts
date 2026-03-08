import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environments';
import { Observable, switchMap } from 'rxjs';
import { LoginResponse } from '../interfaces/login.interface';
import { ApiResponseNoData } from '../../../core/interfaces/api-response.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) {}

  getCsrfCookie(): Observable<void> {
    return this.http.get<void>(`${this.baseUrl}/sanctum/csrf-cookie`);
  }

  onLogin(email: string, password: string): Observable<LoginResponse> {
    return this.getCsrfCookie().pipe(
      switchMap(() => {
        return this.http.post<LoginResponse>(
          `${this.baseUrl}/api/v1/auth/login`, 
          { email, password, device: 'web' }
        );
      })
    );
  }

  onLogout(): Observable<ApiResponseNoData> {
    return this.getCsrfCookie().pipe(
      switchMap(() => {
        return this.http.post<ApiResponseNoData>(`${this.baseUrl}/api/v1/auth/logout`, {});
      })
    );
  }
}
