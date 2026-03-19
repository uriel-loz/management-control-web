import { Component, inject, OnInit, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CardStructure } from '../../../../core/components/card-structure/card-structure.component';
import { CoreDataTable, TableFilterEvent, TablePageEvent, TableSortEvent } from '../../../../core/components/data-table/data-table.component';
import { TableColumn } from '../../../../core/interfaces/table-column.interface';
import { TableAction } from '../../../../core/interfaces/table-action.interface';
import { TableRow } from '../../../../core/interfaces/table-row.interface';
import { ApiService } from './services/api.service';
import { Payment } from './interfaces/sales.interface';
import { PaymentDetailDialogComponent } from './components/payment-detail-dialog/payment-detail-dialog.component';
import { getPaymentMethodLabel, PAYMENT_STATUS_MAP } from '../../../../core/utils/status-maps';

interface PaymentRow extends Record<string, string | number | boolean | null | undefined> {
  id: string;
  status: string;
  method: string;
  quantity: string;
  order_status: string;
  order_total: string;
  created_at: string;
  updated_at: string;
}

@Component({
  selector: 'dashboard-sales',
  imports: [CardStructure, CoreDataTable],
  templateUrl: './sales.component.html',
  styleUrl: './sales.component.scss',
})
export class Sales implements OnInit {
  private readonly apiService = inject(ApiService);
  private readonly dialog     = inject(MatDialog);

  readonly columns: TableColumn[] = [
    { key: 'status',       header: 'Estado',          dbField: 'payments.status',   type: 'badge', badgeMap: PAYMENT_STATUS_MAP              },
    { key: 'method',       header: 'Método de pago',  dbField: 'payments.method'                                                          },
    { key: 'quantity',     header: 'Monto',           dbField: 'payments.quantity'                                                          },
    { key: 'order_status', header: 'Estado de orden', sortable: false, filterable: false },
    { key: 'order_total',  header: 'Total de orden',  sortable: false, filterable: false                                                     },
    { key: 'created_at',   header: 'Creado',          dbField: 'payments.created_at'                                                        },
    { key: 'updated_at',   header: 'Actualizado',     dbField: 'payments.updated_at'                                                        },
  ];

  readonly actions: TableAction[] = [
    { key: 'detail', icon: 'visibility', tooltip: 'Ver detalles', color: 'primary' },
  ];

  data  = signal<PaymentRow[]>([]);
  total = signal<number>(0);

  private currentPage = 1;
  private pageSize    = 10;
  private filters: Record<string, string> = {};
  private sortColumn  = 'payments.updated_at';
  private sortDir: 'asc' | 'desc' = 'desc';

  private originalPayments: Payment[] = [];

  readonly titleReport = 'Reporte de Ventas';

  ngOnInit(): void { this.loadPayments(); }

  onRefresh(): void {
    this.currentPage = 1;
    this.filters = {};
    this.loadPayments();
  }

  onPageChange(event: TablePageEvent): void {
    this.currentPage = event.page;
    this.pageSize    = event.pageSize === 0 ? this.total() : event.pageSize;
    this.loadPayments();
  }

  onFilterChange(event: TableFilterEvent): void {
    this.filters = event.filters;
    this.currentPage = 1;
    this.loadPayments();
  }

  onSortChange(event: TableSortEvent): void {
    this.sortColumn = event.column || 'payments.updated_at';
    this.sortDir    = (event.direction as 'asc' | 'desc') || 'desc';
    this.currentPage = 1;
    this.loadPayments();
  }

  onAction(event: { action: string; row: TableRow }): void {
    if (event.action !== 'detail') return;
    const row = event.row as PaymentRow;
    const original = this.originalPayments.find(p => p.id === row.id);
    if (original) {
      this.dialog.open(PaymentDetailDialogComponent, {
        data: original,
        panelClass: 'notification-dialog-panel',
      });
    }
  }

  private loadPayments(): void {
    this.apiService
      .getPayments(this.currentPage, this.pageSize, this.filters, this.sortColumn, this.sortDir)
      .subscribe(response => {
        this.originalPayments = response.data;
        this.total.set(response.total);
        this.data.set(response.data.map(p => this.toRow(p)));
      });
  }

  private toRow(payment: Payment): PaymentRow {
    return {
      id:           payment.id,
      status:       payment.status,
      method:       getPaymentMethodLabel(payment.method),
      quantity:     `$${parseFloat(payment.quantity).toFixed(2)}`,
      order_status: payment.order?.status ?? '—',
      order_total:  payment.order ? `$${parseFloat(payment.order.total_price).toFixed(2)}` : '—',
      created_at:   payment.created_at,
      updated_at:   payment.updated_at,
    };
  }
}
