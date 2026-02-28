import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface RejectDialogData {
  message: string;
}

@Component({
  selector: 'app-reject-dialog',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './reject-dialog.component.html',
  styleUrl: './reject-dialog.component.scss',
})
export class RejectDialogComponent {
  readonly data = inject<RejectDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<RejectDialogComponent>);

  close(): void {
    this.dialogRef.close();
  }
}
