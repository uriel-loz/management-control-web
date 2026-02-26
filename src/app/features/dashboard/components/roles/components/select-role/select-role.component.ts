import { Component, computed, inject } from '@angular/core';
import { MatSelectModule, MatSelectChange } from '@angular/material/select';
import { RolesStateService } from '../../services/roles-state.service';
import { Roles } from '../../interfaces/roles.interfaces';

@Component({
  selector: 'roles-select-role',
  imports: [MatSelectModule],
  templateUrl: './select-role.component.html',
  styleUrl: './select-role.component.scss',
})
export class SelectRole {
  readonly stateService = inject(RolesStateService);

  readonly roles = computed(() => this.stateService.rolesResource.value() ?? []);

  onRoleChange(event: MatSelectChange): void {
    const select = this.roles().find((role: Roles) => role.id === event.value) ?? null;
    this.stateService.selectRole(select);
  }
}
