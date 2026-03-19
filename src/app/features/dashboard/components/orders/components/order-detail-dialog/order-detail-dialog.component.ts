import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CurrencyPipe } from '@angular/common';
import { Order } from '../../interfaces/orders.interface';
import {
  StatusConfig,
  getOrderStatus,
  getPaymentStatus,
  getPaymentMethodLabel,
  getShortId,
} from '../../../../../../core/utils/status-maps';

export type { StatusConfig };

@Component({
  selector: 'orders-order-detail-dialog',
  imports: [MatDialogModule, MatButtonModule, MatIconModule, CurrencyPipe],
  templateUrl: './order-detail-dialog.component.html',
  styleUrl: './order-detail-dialog.component.scss',
})
export class OrderDetailDialogComponent {
  readonly dialogRef = inject(MatDialogRef<OrderDetailDialogComponent>);
  readonly order: Order = inject(MAT_DIALOG_DATA);

  getOrderStatus(status: string): StatusConfig  { return getOrderStatus(status); }
  getPaymentStatus(status: string): StatusConfig { return getPaymentStatus(status); }
  getPaymentMethodLabel(method: string): string  { return getPaymentMethodLabel(method); }
  getShortId(id: string): string                 { return getShortId(id); }

  close(): void { this.dialogRef.close(); }
}
