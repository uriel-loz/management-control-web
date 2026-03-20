import { Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CurrencyPipe } from '@angular/common';
import { Payment } from '../../interfaces/sales.interface';
import { OrderDetailDialogComponent } from '../../../orders/components/order-detail-dialog/order-detail-dialog.component';
import { NotificationService } from '../../../../../../core/services/notification.service';
import { ApiService } from '../../../orders/services/api.service';
import {
  StatusConfig,
  getOrderStatus,
  getPaymentStatus,
  getPaymentMethodLabel,
  getShortId,
} from '../../../../../../core/utils/status-maps';

@Component({
  selector: 'sales-payment-detail-dialog',
  imports: [MatDialogModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, CurrencyPipe],
  templateUrl: './payment-detail-dialog.component.html',
  styleUrl: './payment-detail-dialog.component.scss',
})
export class PaymentDetailDialogComponent {
  readonly dialogRef    = inject(MatDialogRef<PaymentDetailDialogComponent>);
  readonly payment: Payment = inject(MAT_DIALOG_DATA);
  private readonly apiService    = inject(ApiService);
  private readonly dialog        = inject(MatDialog);
  private readonly notification  = inject(NotificationService);

  readonly isLoadingOrder = signal(false);

  getPaymentStatus(status: string): StatusConfig  { return getPaymentStatus(status); }
  getOrderStatus(status: string): StatusConfig    { return getOrderStatus(status); }
  getPaymentMethodLabel(method: string): string   { return getPaymentMethodLabel(method); }
  getShortId(id: string): string                  { return getShortId(id); }

  openOrderDetail(): void {
    this.isLoadingOrder.set(true);
    this.apiService.getOrderById(this.payment.order_id).subscribe({
      next: (response) => {
        this.isLoadingOrder.set(false);
        this.dialog.open(OrderDetailDialogComponent, {
          data: response.data,
          panelClass: 'notification-dialog-panel',
        });
      },
      error: () => {
        this.isLoadingOrder.set(false);
        this.notification.error('No se pudo cargar el detalle de la orden.');
      },
    });
  }

  close(): void { this.dialogRef.close(); }
}
