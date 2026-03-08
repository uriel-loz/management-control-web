import { Component, effect, inject, Signal } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { RolesStateService } from '../../services/roles-state.service';
import { Permission, PermissionsIds } from '../../interfaces/roles.interfaces';
import { Module, Section } from '../../../../../../layouts/main-layout/interfaces/modules.interfaces';

const PERM_ORDER: Record<string, number> = { read: 0, create: 1, update: 2, delete: 3 };
const PERM_LABELS: Record<string, string> = {
  read: 'Leer',
  create: 'Crear',
  update: 'Editar',
  delete: 'Eliminar',
};

@Component({
  selector: 'roles-permissions',
  imports: [],
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

  permissionLabel(slug: string): string {
    const action = slug.split('.').pop() ?? slug;
    return PERM_LABELS[action] ?? action;
  }

  sortedPermissions(permissions: Permission[]): Permission[] {
    return [...permissions].sort((a, b) => {
      const aAction = a.slug.split('.').pop() ?? '';
      const bAction = b.slug.split('.').pop() ?? '';
      return (PERM_ORDER[aAction] ?? 99) - (PERM_ORDER[bAction] ?? 99);
    });
  }

  sectionActiveCount(section: Section): number {
    const current = this.permissions();
    return (section.modules ?? [])
      .flatMap((m: Module) => m.permissions ?? [])
      .filter((p: Permission) => current.includes(p.id)).length;
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
