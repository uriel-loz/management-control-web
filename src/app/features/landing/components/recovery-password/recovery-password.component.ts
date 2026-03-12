import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'landing-recovery-password',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    RouterLink,
  ],
  templateUrl: './recovery-password.component.html',
  styleUrl: './recovery-password.component.scss',
})
export class RecoveryPasswordComponent {
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);

  recoveryForm: FormGroup;
  isLoading = signal(false);
  isSuccess = signal(false);
  submittedEmail = signal('');

  constructor(private fb: FormBuilder) {
    this.recoveryForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit(): void {
    if (this.recoveryForm.valid && !this.isLoading()) {
      const { email } = this.recoveryForm.value;
      this.isLoading.set(true);

      this.authService.recoverPassword(email).subscribe({
        next: () => {
          this.isLoading.set(false);
          this.submittedEmail.set(email);
          this.isSuccess.set(true);
        },
        error: (error: { error?: { message?: string } }) => {
          this.isLoading.set(false);
          const errorMessage =
            error.error?.message ||
            'No se pudo procesar la solicitud. Verifica el correo ingresado.';
          this.notificationService.error(errorMessage);
        },
      });
    }
  }

  getErrorMessage(field: string): string {
    const control = this.recoveryForm.get(field);
    if (control?.hasError('required')) return 'Este campo es requerido';
    if (control?.hasError('email')) return 'Email inválido';
    return '';
  }
}
