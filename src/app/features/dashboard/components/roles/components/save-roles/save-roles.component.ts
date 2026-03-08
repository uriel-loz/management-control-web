import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RolesStateService } from '../../services/roles-state.service';
import { ApiService } from '../../services/api.service';
import { NotificationService } from '../../../../../../core/services/notification.service';
import { ModuleService } from '../../../../../../layouts/main-layout/services/module.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'roles-save-roles',
  imports: [MatButtonModule],
  templateUrl: './save-roles.component.html',
  styleUrl: './save-roles.component.scss',
})
export class SaveRoles {
  private rolesStateService = inject(RolesStateService);
  private readonly snackbarService = inject(NotificationService);
  private apiService = inject(ApiService);
  private moduleService = inject(ModuleService);

  readonly isLoading = signal(false);

  onSubmit(): void {
    if(!this.rolesStateService.selectedRole() || !this.rolesStateService.permissions().length) {
      this.snackbarService.error('Debes seleccionar al menos un permiso.');
      return;
    };

    const requestData = {
      role: this.rolesStateService.selectedRole()!.id,
      modules: this.rolesStateService.permissions(),
    };

    this.isLoading.set(true);
    this.apiService.setRolePermissions(requestData.role, requestData.modules)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: () => {
          this.snackbarService.success('Operación realizada exitosamente.');
          this.rolesStateService.rolesResource.reload();
          this.moduleService.modulesResource.reload();
        },
        error: (error: { error?: { message?: string } }) => {
          const message = error.error?.message || 'Error al guardar el rol.';
          this.snackbarService.error(message);
          console.error(error);
        }
    });
  }
}
