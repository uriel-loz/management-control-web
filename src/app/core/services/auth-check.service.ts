import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponseNoData } from '../interfaces/api-response.interface';
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class AuthCheckService {
  private readonly baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) { }

  isAuthenticated(): Observable<ApiResponseNoData> {
    return this.http.get<ApiResponseNoData>(`${this.baseUrl}/api/v1/auth/check`);
  }

  isAuthorized(moduleSlug: string | undefined): Observable<ApiResponseNoData> {
    if (!moduleSlug) {
      return new Observable(observer => {
        observer.complete();
      });
    }

    return this.http.get<ApiResponseNoData>(`${this.baseUrl}/api/v1/admin/modules/${moduleSlug}/check-access`);
  }
}
