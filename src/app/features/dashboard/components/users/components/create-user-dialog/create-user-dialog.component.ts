import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ApiService as UsersApiService } from '../../services/api.service';
import { ApiService as RolesApiService } from '../../../roles/services/api.service';
import { NotificationService } from '../../../../../../core/services/notification.service';
import { Roles } from '../../../roles/interfaces/roles.interfaces';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({
  selector: 'users-create-user-dialog',
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    ReactiveFormsModule,
  ],
  templateUrl: './create-user-dialog.component.html',
  styleUrl: './create-user-dialog.component.scss',
})
export class CreateUserDialogComponent {
  private readonly dialogRef    = inject(MatDialogRef<CreateUserDialogComponent>);
  private readonly usersApi     = inject(UsersApiService);
  private readonly rolesApi     = inject(RolesApiService);
  private readonly notification = inject(NotificationService);

  readonly isLoading = signal(false);
  readonly roles     = toSignal<Roles[]>(this.rolesApi.getRoles().pipe(
    map(response => response.data)
  ));

  readonly form = new FormGroup({
    name:        new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email:       new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    phone:       new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    password:    new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(8)] }),
    role_id:     new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    is_customer: new FormControl<number | null>(null, { validators: [Validators.required] }),
  });

  readonly customerOptions = [
    { label: 'Usuario',        value: 0 },
    { label: 'Administrador',  value: 1 },
  ];

  cancel(): void {
    this.dialogRef.close(false);
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    const { name, email, phone, password, role_id, is_customer } = this.form.getRawValue();

    this.usersApi.createUser({ name, email, phone, password, role_id, is_customer: is_customer! }).subscribe({
      next: () => {
        this.notification.success('Usuario creado exitosamente.');
        this.dialogRef.close(true);
      },
      error: (error: { error?: { message?: string } }) => {
        const message = error.error?.message || 'Error al crear el usuario.';
        this.notification.error(message);
        this.isLoading.set(false);
      },
    });
  }
}
