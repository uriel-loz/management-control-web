import { Injectable, inject } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { CustomSnackbarComponent } from '../components/custom-snackbar.component';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  private snackBar = inject(MatSnackBar);

  private defaultConfig: MatSnackBarConfig = {
    horizontalPosition: 'end',
    verticalPosition: 'top',
  };

  success(message: string, duration: number = 3000): void {
    this.snackBar.openFromComponent(CustomSnackbarComponent, {
      ...this.defaultConfig,
      duration,
      data: { message, type: 'success' }
    });
  }

  error(message: string, duration: number = 5000): void {
    this.snackBar.openFromComponent(CustomSnackbarComponent, {
      ...this.defaultConfig,
      duration,
      data: { message, type: 'error' }
    });
  }

  warning(message: string, duration: number = 4000): void {
    this.snackBar.openFromComponent(CustomSnackbarComponent, {
      ...this.defaultConfig,
      duration,
      data: { message, type: 'warning' }
    });
  }

  info(message: string, duration: number = 3000): void {
    this.snackBar.openFromComponent(CustomSnackbarComponent, {
      ...this.defaultConfig,
      duration,
      data: { message, type: 'info' }
    });
  }

  custom(message: string, config?: MatSnackBarConfig): void {
    this.snackBar.open(message, 'Cerrar', {
      ...this.defaultConfig,
      ...config
    });
  }
}
