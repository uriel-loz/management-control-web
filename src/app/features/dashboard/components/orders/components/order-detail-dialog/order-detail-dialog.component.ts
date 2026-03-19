import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Order } from '../../interfaces/orders.interface';

export interface StatusConfig {
  bg: string;
  text: string;
  border: string;
  icon: string;
  label: string;
}

const ORDER_STATUS_MAP: Record<string, StatusConfig> = {
  pending:    { bg: '#fef3c7', text: '#92400e', border: '#fde68a', icon: 'schedule',      label: 'Pendiente'   },
  processing: { bg: '#dbeafe', text: '#1e40af', border: '#bfdbfe', icon: 'autorenew',     label: 'En proceso'  },
  completed:  { bg: '#dcfce7', text: '#166534', border: '#bbf7d0', icon: 'check_circle',  label: 'Completado'  },
  cancelled:  { bg: '#fee2e2', text: '#991b1b', border: '#fecaca', icon: 'cancel',        label: 'Cancelado'   },
  refunded:   { bg: '#f3e8ff', text: '#6b21a8', border: '#e9d5ff', icon: 'replay',        label: 'Reembolsado' },
};

const PAYMENT_STATUS_MAP: Record<string, StatusConfig> = {
  pending:    { bg: '#fef3c7', text: '#92400e', border: '#fde68a', icon: 'schedule',      label: 'Pendiente'   },
  processing: { bg: '#dbeafe', text: '#1e40af', border: '#bfdbfe', icon: 'autorenew',     label: 'En proceso'  },
  completed:  { bg: '#dcfce7', text: '#166534', border: '#bbf7d0', icon: 'check_circle',  label: 'Completado'  },
  failed:     { bg: '#fee2e2', text: '#991b1b', border: '#fecaca', icon: 'error_outline', label: 'Fallido'     },
  refunded:   { bg: '#f3e8ff', text: '#6b21a8', border: '#e9d5ff', icon: 'replay',        label: 'Reembolsado' },
};

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  credit_card:   'Tarjeta de crédito',
  debit_card:    'Tarjeta de débito',
  paypal:        'PayPal',
  bank_transfer: 'Transferencia bancaria',
  cash:          'Efectivo',
};

@Component({
  selector: 'orders-order-detail-dialog',
  imports: [MatDialogModule, MatButtonModule, MatIconModule, CurrencyPipe, DatePipe],
  templateUrl: './order-detail-dialog.component.html',
  styleUrl: './order-detail-dialog.component.scss',
})
export class OrderDetailDialogComponent {
  readonly dialogRef = inject(MatDialogRef<OrderDetailDialogComponent>);
  readonly order: Order = inject(MAT_DIALOG_DATA);

  getOrderStatus(status: string): StatusConfig {
    return ORDER_STATUS_MAP[status] ?? { bg: '#f3f4f6', text: '#374151', border: '#e5e7eb', icon: 'help_outline', label: status };
  }

  getPaymentStatus(status: string): StatusConfig {
    return PAYMENT_STATUS_MAP[status] ?? { bg: '#f3f4f6', text: '#374151', border: '#e5e7eb', icon: 'help_outline', label: status };
  }

  getPaymentMethodLabel(method: string): string {
    return PAYMENT_METHOD_LABELS[method] ?? method;
  }

  getShortId(id: string): string {
    return id.slice(0, 8).toUpperCase();
  }

  close(): void {
    this.dialogRef.close();
  }
}
