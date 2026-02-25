import { Injectable, computed, signal } from '@angular/core';
import { Permission, Roles } from '../interfaces/roles.interfaces';

@Injectable({
  providedIn: 'root',
})
export class RolesStateService {
  readonly selectedRole = signal<Roles | null>(null);
  permissions = signal<Permission[]>([]);
  readonly permissionsCount = computed(() => this.permissions().length);

  // readonly selectedRoleId = computed(() => this.selectedRole()?.id ?? null);

  selectRole(role: Roles | null): void {
    this.selectedRole.set(role);
    this.permissions.set(role?.permissions ?? []);
  }
}
