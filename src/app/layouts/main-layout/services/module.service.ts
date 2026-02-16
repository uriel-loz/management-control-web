import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ModulesResponse } from '../interfaces/modules.interfaces';

@Injectable({
  providedIn: 'root'
})
export class ModuleService {
  private readonly baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) {}

  getModulesByUser(): Observable<ModulesResponse> {
    return this.http.get<ModulesResponse>(`${this.baseUrl}/api/v1/admin/modules/user`);
  }
}
