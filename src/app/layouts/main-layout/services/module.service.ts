import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environments';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ModuleService {
  private readonly baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) {}
}
