import { Injectable, inject } from '@angular/core';
import { environment } from '../../../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { rxResource } from '@angular/core/rxjs-interop';
import { ModulesResponse } from '../interfaces/modules.interfaces';

@Injectable({
  providedIn: 'root',
})
export class ModuleService {
  private readonly baseUrl: string = environment.baseUrl;
  private readonly http = inject(HttpClient);

  readonly modulesResource = rxResource({
    stream: () => this.http.get<ModulesResponse>(`${this.baseUrl}/api/v1/admin/modules/user`)
  });
}
