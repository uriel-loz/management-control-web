import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environments';
import { Observable, switchMap } from 'rxjs';
import { Login } from '../interfaces/login.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) {}

  getCsrfCookie(): Observable<void> {
    return this.http.get<void>(`${this.baseUrl}/sanctum/csrf-cookie`);
  }

  onLogin(email: string, password: string): Observable<Login> {
    return this.getCsrfCookie().pipe(
      switchMap(() => {
        return this.http.post<Login>(
          `${this.baseUrl}/api/v1/auth/login`, 
          { email, password, device: 'web' }
        );
      })
    );
  }

  onLogout(): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/v1/auth/logout`, {});
  }
}
