import { Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Observable } from 'rxjs';
import { NotificationService } from '../../services/notification.service';

export interface ConfirmDialogData {
  title?: string;
  message?: string;
  action?: () => Observable<unknown>;
  successMessage?: string;
  errorMessage?: string;
}

@Component({
  selector: 'app-confirm-dialog',
  imports: [MatDialogModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss',
})
export class ConfirmDialogComponent {
  readonly dialogRef = inject(MatDialogRef<ConfirmDialogComponent>);
  readonly data: ConfirmDialogData = inject(MAT_DIALOG_DATA);
  private readonly notification = inject(NotificationService);

  readonly title = this.data?.title ?? 'Atención';
  readonly message =
    this.data?.message ??
    '¿Estás seguro de querer realizar esta acción? No se podrán deshacer estos cambios.';

  isLoading = signal(false);

  cancel(): void {
    if (this.isLoading()) return;
    this.dialogRef.close(false);
  }

  confirm(): void {
    if (!this.data?.action) {
      this.dialogRef.close(true);
      return;
    }

    this.isLoading.set(true);
    this.dialogRef.disableClose = true;

    this.data.action().subscribe({
      next: () => {
        this.isLoading.set(false);
        this.dialogRef.disableClose = false;
        if (this.data.successMessage) {
          this.notification.success(this.data.successMessage);
        }
        this.dialogRef.close(true);
      },
      error: (error: { error?: { message?: string } }) => {
        this.isLoading.set(false);
        this.dialogRef.disableClose = false;
        const message =
          error.error?.message ?? this.data.errorMessage ?? 'Error al procesar la solicitud.';
        this.notification.error(message);
        console.error(error);
        this.dialogRef.close(false);
      },
    });
  }
}
