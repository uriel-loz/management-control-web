import { Injectable, computed, signal } from '@angular/core';
import { Permission, Roles } from '../interfaces/roles.interfaces';

@Injectable({
  providedIn: 'root',
})
export class RolesStateService {
  readonly selectedRole = signal<Roles | null>(null);
  readonly permissions = signal<Permission[]>([]);
  readonly allPermissions = signal<Permission[]>([]);
  readonly permissionsCount = computed(() => this.permissions().length);

  selectRole(role: Roles | null): void {
    this.selectedRole.set(role);
    this.permissions.set(role?.permissions ?? []);
  }

  setAllPermissions(permissions: Permission[]): void {
    this.allPermissions.set(permissions);
  }
  
  uncheckAll(): void {
    this.permissions.set([]);
  }

  checkAll(): void {
    this.permissions.set(this.allPermissions());
  }
}
