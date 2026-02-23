import { Injectable, computed, signal } from '@angular/core';
import { Roles } from '../interfaces/roles.interfaces';

@Injectable({
  providedIn: 'root',
})
export class RolesStateService {
  readonly selectedRole = signal<Roles | null>(null);

  readonly selectedRoleId = computed(() => this.selectedRole()?.id ?? null);

  readonly permissionsCount = computed(() => this.selectedRole()?.permissions.length ?? 0);

  selectRole(role: Roles | null): void {
    this.selectedRole.set(role);
  }
}
