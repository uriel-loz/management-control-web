import { Component, computed, effect, inject, Signal } from '@angular/core';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { ApiService } from '../../services/api.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { RolesStateService } from '../../services/roles-state.service';
import { Permission, PermissionsIds } from '../../interfaces/roles.interfaces';

@Component({
  selector: 'roles-permissions',
  imports: [MatCheckbox, MatDividerModule],
  templateUrl: './permissions.component.html',
  styleUrl: './permissions.component.scss',
})
export class Permissions {
  private readonly apiService = inject(ApiService);
  private readonly rolesStateService = inject(RolesStateService);
  private readonly permissions: Signal<PermissionsIds[]> = this.rolesStateService.permissions;

  readonly sectionsModules = toSignal(
    this.apiService.getModules().pipe(map(response => response.data)),
    { initialValue: null }
  );

  constructor() {
    effect(() => {
      const sections = this.sectionsModules();

      if (!sections) return;
      
      const allPermissions = sections
        .flatMap(section => section.modules ?? [])
        .flatMap(module => module.permissions ?? []);

      if (!allPermissions.length) return;

      this.rolesStateService.setAllPermissions(allPermissions.map(p => p.id));
    });
  }

  isChecked(permissionId: string): boolean {
    return this.permissions().includes(permissionId);
  }

  onPermissionToggle(permissionId: string, checked: boolean, modulePermissions: Permission[]): void {
    const currentPermissions = this.permissions();
    const service = this.rolesStateService.permissions;

    if (checked) {
      const toAdd: PermissionsIds[] = [permissionId];

      const isReadPermission = modulePermissions
        .find(p => p.id === permissionId)
        ?.slug.endsWith('.read') ?? true;

      if (!isReadPermission) {
        const readPermission = modulePermissions.find(p => p.slug.endsWith('.read'));

        if (readPermission && !currentPermissions.includes(readPermission.id)) {
          toAdd.push(readPermission.id);
        }
      }

      service.set([...currentPermissions, ...toAdd]);
    } else {
      service.set(currentPermissions.filter(id => id !== permissionId));
    }
  }
}
