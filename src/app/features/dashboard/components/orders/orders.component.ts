import { Component, inject, OnInit, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CardStructure } from '../../../../core/components/card-structure/card-structure.component';
import { CoreDataTable, TableFilterEvent, TablePageEvent, TableSortEvent } from '../../../../core/components/data-table/data-table.component';
import { TableColumn } from '../../../../core/interfaces/table-column.interface';
import { TableAction } from '../../../../core/interfaces/table-action.interface';
import { TableRow } from '../../../../core/interfaces/table-row.interface';
import { ConfirmDialogComponent } from '../../../../core/components/confirm-dialog/confirm-dialog.component';
import { ApiService } from './services/api.service';
import { Order } from './interfaces/orders.interface';
import { OrderDetailDialogComponent } from './components/order-detail-dialog/order-detail-dialog.component';

interface OrderRow extends Record<string, string | number | boolean | null | undefined> {
  id: string;
  user: string;
  status: string;
  total_products: number;
  total_price: string;
  payment_method: string;
  payment_status: string;
  created_at: string;
  updated_at: string;
}

@Component({
  selector: 'dashboard-orders',
  imports: [CardStructure, CoreDataTable],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
})
export class Orders implements OnInit {
  private readonly apiService = inject(ApiService);
  private readonly dialog     = inject(MatDialog);

  readonly columns: TableColumn[] = [
    { key: 'user',           header: 'Cliente',         sortable: false, filterable: false },
    { key: 'status',         header: 'Estado',          dbField: 'orders.status'           },
    { key: 'total_products', header: 'Productos',       dbField: 'orders.total_products'   },
    { key: 'total_price',    header: 'Total',           dbField: 'orders.total_price'      },
    { key: 'payment_method', header: 'Método de pago',  sortable: false, filterable: false },
    { key: 'payment_status', header: 'Estado del pago', sortable: false, filterable: false },
    { key: 'created_at',     header: 'Creado',          dbField: 'orders.created_at'       },
    { key: 'updated_at',     header: 'Actualizado',     dbField: 'orders.updated_at'       },
  ];

  readonly actions: TableAction[] = [
    { key: 'detail', icon: 'visibility', tooltip: 'Ver detalles',   color: 'primary' },
    { key: 'cancel', icon: 'cancel',     tooltip: 'Cancelar orden', color: 'accent'  },
    { key: 'delete', icon: 'delete',     tooltip: 'Eliminar orden', color: 'warn'    },
  ];

  data  = signal<OrderRow[]>([]);
  total = signal<number>(0);

  private currentPage = 1;
  private pageSize    = 10;
  private filters: Record<string, string> = {};
  private sortColumn  = 'orders.updated_at';
  private sortDir: 'asc' | 'desc' = 'desc';

  private originalOrders: Order[] = [];

  readonly titleReport = 'Reporte de Órdenes';

  ngOnInit(): void { this.loadOrders(); }

  onRefresh(): void {
    this.currentPage = 1;
    this.filters = {};
    this.loadOrders();
  }

  onPageChange(event: TablePageEvent): void {
    this.currentPage = event.page;
    this.pageSize    = event.pageSize === 0 ? this.total() : event.pageSize;
    this.loadOrders();
  }

  onFilterChange(event: TableFilterEvent): void {
    this.filters = event.filters;
    this.currentPage = 1;
    this.loadOrders();
  }

  onSortChange(event: TableSortEvent): void {
    this.sortColumn = event.column || 'orders.updated_at';
    this.sortDir    = (event.direction as 'asc' | 'desc') || 'desc';
    this.currentPage = 1;
    this.loadOrders();
  }

  onAction(event: { action: string; row: TableRow }): void {
    const row = event.row as OrderRow;
    const original = this.originalOrders.find(o => o.id === row.id);

    switch (event.action) {
      case 'detail':
        if (original) {
          this.dialog.open(OrderDetailDialogComponent, {
            data: original,
            panelClass: 'notification-dialog-panel',
          });
        }
        break;

      case 'cancel':
        this.dialog.open(ConfirmDialogComponent, {
          panelClass: 'notification-dialog-panel',
          data: {
            title: 'Cancelar orden',
            message: `¿Estás seguro de que deseas cancelar la orden del cliente "${row.user}"?\nEl estado cambiará a "Cancelado".`,
            action: () => this.apiService.cancelOrder(row.id),
            successMessage: 'Orden cancelada exitosamente.',
            errorMessage: 'Error al cancelar la orden.',
          },
        }).afterClosed().subscribe({ next: (confirmed: boolean) => { if (confirmed) this.loadOrders(); } });
        break;

      case 'delete':
        this.dialog.open(ConfirmDialogComponent, {
          panelClass: 'notification-dialog-panel',
          data: {
            title: 'Eliminar orden',
            message: `¿Estás seguro de que deseas eliminar la orden del cliente "${row.user}"?\nEsta acción no se puede deshacer.`,
            action: () => this.apiService.deleteOrder(row.id),
            successMessage: 'Orden eliminada exitosamente.',
            errorMessage: 'Error al eliminar la orden.',
          },
        }).afterClosed().subscribe({ next: (confirmed: boolean) => { if (confirmed) this.loadOrders(); } });
        break;
    }
  }

  private loadOrders(): void {
    this.apiService
      .getOrders(this.currentPage, this.pageSize, this.filters, this.sortColumn, this.sortDir)
      .subscribe(response => {
        this.originalOrders = response.data;
        this.total.set(response.total);
        this.data.set(response.data.map(o => this.toRow(o)));
      });
  }

  private toRow(order: Order): OrderRow {
    return {
      id:             order.id,
      user:           order.user?.name ?? '—',
      status:         order.status,
      total_products: order.total_products,
      total_price:    `$${parseFloat(order.total_price).toFixed(2)}`,
      payment_method: order.payment ? this.formatMethod(order.payment.method) : '—',
      payment_status: order.payment?.status ?? '—',
      created_at:     order.created_at,
      updated_at:     order.updated_at,
    };
  }

  private formatMethod(method: string): string {
    const map: Record<string, string> = {
      credit_card:   'T. Crédito',
      debit_card:    'T. Débito',
      paypal:        'PayPal',
      bank_transfer: 'Transferencia',
      cash:          'Efectivo',
    };
    return map[method] ?? method;
  }
}
