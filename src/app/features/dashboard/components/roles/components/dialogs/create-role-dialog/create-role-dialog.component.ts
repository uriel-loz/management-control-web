import { Component, computed, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ApiService } from '../../../services/api.service';
import { NotificationService } from '../../../../../../../core/services/notification.service';
import { RolesStateService } from '../../../services/roles-state.service';
import { SingleRoleResponse } from '../../../interfaces/roles.interfaces';

@Component({
  selector: 'roles-create-role-dialog',
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './create-role-dialog.component.html',
  styleUrl: './create-role-dialog.component.scss',
})
export class CreateRoleDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<CreateRoleDialogComponent>);
  private readonly apiService = inject(ApiService);
  private readonly rolesStateService = inject(RolesStateService);
  private readonly snackbarService = inject(NotificationService);
  readonly roles = computed(() => this.rolesStateService.rolesResource.value() ?? []);

  readonly isLoading = signal(false);

  readonly roleNameControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(2)],
  });

  cancel(): void {
    this.dialogRef.close(false);
  }

  save(): void {
    if (this.roleNameControl.invalid) {
      this.roleNameControl.markAsTouched();
      return;
    }

    this.isLoading.set(true);

    this.apiService.saveRole({ role: this.roleNameControl.value }).subscribe({
      next: (response: SingleRoleResponse) => {
        this.snackbarService.success('Rol creado exitosamente.');
        this.dialogRef.close(response.data.id);
      },
      error: (error) => {
        const message = error.error?.message || 'Error al crear el rol.';
        this.snackbarService.error(message);
        console.error(error);
        this.isLoading.set(false);
      },
    });
  }
}

