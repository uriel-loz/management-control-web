import { Injectable, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { ApiService } from './api.service';
import { Permission, Roles } from '../interfaces/roles.interfaces';

@Injectable({
  providedIn: 'root',
})
export class RolesStateService {
  private readonly apiService = inject(ApiService);

  readonly rolesResource = rxResource({
    stream: () => this.apiService.getRoles().pipe(map((response) => response.data)),
  });

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
