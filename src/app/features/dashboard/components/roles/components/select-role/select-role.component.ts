import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatSelectModule, MatSelectChange } from '@angular/material/select';
import { map } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { RolesStateService } from '../../services/roles-state.service';
import { Roles } from '../../interfaces/roles.interfaces';

@Component({
  selector: 'roles-select-role',
  imports: [MatSelectModule],
  templateUrl: './select-role.component.html',
  styleUrl: './select-role.component.scss',
})
export class SelectRole {
  private readonly apiService = inject(ApiService);
  readonly stateService = inject(RolesStateService);

  roles = toSignal(
    this.apiService.getRoles().pipe(map(response => response.data)),
    { initialValue: null }
  );

  onRoleChange(event: MatSelectChange): void {
    const selected = (this.roles() ?? []).find((r: Roles) => r.id === event.value) ?? null;
    this.stateService.selectRole(selected);
  }
}
