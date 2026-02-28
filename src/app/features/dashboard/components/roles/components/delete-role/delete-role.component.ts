import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../../../../core/components/confirm-dialog/confirm-dialog.component';
import { ApiService } from '../../services/api.service';
import { RolesStateService } from '../../services/roles-state.service';
import { NotificationService } from '../../../../../../core/services/notification.service';

@Component({
  selector: 'roles-delete-role',
  imports: [MatButtonModule],
  templateUrl: './delete-role.component.html',
  styleUrl: './delete-role.component.scss',
})
export class DeleteRole {
  private readonly dialog = inject(MatDialog);
  private readonly apiService = inject(ApiService);
  private readonly stateService = inject(RolesStateService);
  private readonly snackbarService = inject(NotificationService);

  openConfirmDialog(): void {
    this.dialog
      .open(ConfirmDialogComponent, { panelClass: 'notification-dialog-panel' })
      .afterClosed()
      .subscribe({
        next: (confirmed: boolean) => {
          if (!confirmed) return;

          const roleId = this.stateService.selectedRole()?.id;
          if (!roleId) return;

          this.apiService.deleteRole(roleId).subscribe({
            next: () => {
              this.snackbarService.success('Rol eliminado exitosamente.');
              this.stateService.selectRole(null);
              this.stateService.rolesResource.reload();
            },
            error: (error: { error?: { message?: string } }) => {
              const message = error.error?.message || 'Error al eliminar el rol.';
              this.snackbarService.error(message);
              console.error(error);
            },
          });
        },
      });
  }
}
