import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SuccessDialogComponent } from '../components/success-dialog/success-dialog.component';
import { RejectDialogComponent } from '../components/reject-dialog/reject-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly dialog = inject(MatDialog);

  success(message: string): void {
    this.dialog.open(SuccessDialogComponent, {
      data: { message },
      panelClass: 'notification-dialog-panel',
      disableClose: false,
    });
  }

  error(message: string): void {
    this.dialog.open(RejectDialogComponent, {
      data: { message },
      panelClass: 'notification-dialog-panel',
      disableClose: false,
    });
  }
}
