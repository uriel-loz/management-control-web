import { Component, computed, effect, inject, Signal } from '@angular/core';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { ApiService } from '../../services/api.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { RolesStateService } from '../../services/roles-state.service';
import { Permission } from '../../interfaces/roles.interfaces';

@Component({
  selector: 'roles-permissions',
  imports: [MatCheckbox, MatDividerModule],
  templateUrl: './permissions.component.html',
  styleUrl: './permissions.component.scss',
})
export class Permissions {
  private readonly apiService = inject(ApiService);
  private readonly rolesStateService = inject(RolesStateService);

  readonly permissions: Signal<Permission[]> = this.rolesStateService.permissions;

  private readonly permissionIds = computed(
    () => new Set(this.permissions().map(p => p.id))
  );

  readonly sectionsModules = toSignal(
    this.apiService.getModules().pipe(map(response => response.data)),
    { initialValue: null }
  );

  constructor() {
    effect(() => {
      const sections = this.sectionsModules();

      if (!sections) return;
      
      const allPerms = sections
        .flatMap(section => section.modules ?? [])
        .flatMap(module => module.permissions ?? []);

      this.rolesStateService.setAllPermissions(allPerms);
    });
  }

  isChecked(permissionId: string): boolean {
    return this.permissionIds().has(permissionId);
  }
}
