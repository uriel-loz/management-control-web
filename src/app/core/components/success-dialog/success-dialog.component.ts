import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface SuccessDialogData {
  message: string;
}

@Component({
  selector: 'app-success-dialog',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './success-dialog.component.html',
  styleUrl: './success-dialog.component.scss',
})
export class SuccessDialogComponent {
  readonly data = inject<SuccessDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<SuccessDialogComponent>);

  close(): void {
    this.dialogRef.close();
  }
}
