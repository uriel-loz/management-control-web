import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

export interface SnackbarData {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

@Component({
  selector: 'app-custom-snackbar',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  template: `
    <div class="custom-snackbar" [ngClass]="'snackbar-' + data.type">
      <div class="snackbar-content">
        <span class="snackbar-icon">{{ getIcon() }}</span>
        <span class="snackbar-message">{{ data.message }}</span>
      </div>
      <button mat-icon-button (click)="dismiss()" class="snackbar-close">
        <mat-icon>close</mat-icon>
      </button>
    </div>
  `,
  styles: [`
    .custom-snackbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 16px;
      border-radius: 4px;
      min-width: 300px;
      color: white;
      font-family: Roboto, sans-serif;
      font-size: 14px;
      font-weight: 500;
      border: none;
      outline: none;
      box-shadow: 0 3px 5px -1px rgba(0, 0, 0, 0.2), 
                  0 6px 10px 0 rgba(0, 0, 0, 0.14), 
                  0 1px 18px 0 rgba(0, 0, 0, 0.12);
    }

    .snackbar-content {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .snackbar-icon {
      font-size: 20px;
      line-height: 1;
    }

    .snackbar-message {
      flex: 1;
    }

    .snackbar-close {
      color: white !important;
      margin-left: 8px;
      
      mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
      }
    }

    .snackbar-success {
      background-color: #4caf50;
    }

    .snackbar-error {
      background-color: #f44336;
    }

    .snackbar-warning {
      background-color: #ff9800;
    }

    .snackbar-info {
      background-color: #2196f3;
    }
  `]
})
export class CustomSnackbarComponent {
  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: SnackbarData,
    public snackBarRef: MatSnackBarRef<CustomSnackbarComponent>
  ) {}

  getIcon(): string {
    const icons = {
      success: '✓',
      error: '✗',
      warning: '⚠',
      info: 'ℹ'
    };
    return icons[this.data.type];
  }

  dismiss(): void {
    this.snackBarRef.dismiss();
  }
}
