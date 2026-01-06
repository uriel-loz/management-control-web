import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environments';
import { Observable } from 'rxjs';
import { Login } from '../interfaces/login.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) {}

  onLogin(email: string, password: string): Observable<Login> {
    return this.http.post<Login>(`${this.baseUrl}/auth/session-login`, { email, password });
  }

}
