import { Component, computed, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ApiService as UsersApiService } from '../../services/api.service';
import { ApiService as RolesApiService } from '../../../roles/services/api.service';
import { NotificationService } from '../../../../../../core/services/notification.service';
import { User, UpdateUserRequest } from '../../interfaces/users-table.interface';
import { Roles } from '../../../roles/interfaces/roles.interfaces';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

export interface CreateUserDialogData {
  user?: User;
}

/** Valida minLength(8) solo si el campo no está vacío. */
const optionalMinLength =
  (min: number): ValidatorFn =>
  (control: AbstractControl) =>
    control.value ? Validators.minLength(min)(control) : null;

@Component({
  selector: 'users-create-user-dialog',
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    ReactiveFormsModule,
  ],
  templateUrl: './create-user-dialog.component.html',
  styleUrl: './create-user-dialog.component.scss',
})
export class CreateUserDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<CreateUserDialogComponent>);
  private readonly usersApi = inject(UsersApiService);
  private readonly rolesApi = inject(RolesApiService);
  private readonly notification = inject(NotificationService);
  readonly data = inject<CreateUserDialogData>(MAT_DIALOG_DATA, { optional: true });

  readonly isEditMode = computed(() => !!this.data?.user);
  readonly isLoading = signal(false);
  readonly roles = toSignal<Roles[]>(
    this.rolesApi.getRoles().pipe(map((response) => response.data)),
  );

  readonly form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    phone: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    password: new FormControl('', { nonNullable: true, validators: [] }),
    role_id: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    is_customer: new FormControl<number | null>(null, { validators: [Validators.required] }),
  });

  readonly customerOptions = [
    { label: 'Usuario', value: 0 },
    { label: 'Administrador', value: 1 },
  ];

  constructor() {
    const user = this.data?.user;

    if (user) {
      // Modo edición: prellenar y hacer password opcional
      this.form.patchValue({
        name: user['name'],
        email: user['email'],
        phone: user['phone'],
        role_id: user['role_id'] ?? '',
        is_customer: user['type'] === 'Administrador' ? 1 : 0,
      });
      this.form.controls.password.setValidators([optionalMinLength(8)]);
    } else {
      // Modo creación: password requerida
      this.form.controls.password.setValidators([Validators.required, Validators.minLength(8)]);
    }

    this.form.controls.password.updateValueAndValidity();
  }

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

    if (this.isEditMode()) {
      const payload: UpdateUserRequest = { name, email, phone, role_id, is_customer: is_customer! };
      if (password) payload.password = password;

      this.usersApi.updateUser(this.data!.user!['id'], payload).subscribe({
        next: () => {
          this.notification.success('Usuario actualizado exitosamente.');
          this.dialogRef.close(true);
        },
        error: (error: { error?: { message?: string } }) => {
          const message = error.error?.message || 'Error al actualizar el usuario.';
          this.notification.error(message);
          this.isLoading.set(false);
        },
      });
    } else {
      this.usersApi
        .createUser({ name, email, phone, password, role_id, is_customer: is_customer! })
        .subscribe({
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
}
