import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CardStructure } from '../../../../core/components/card-structure/card-structure.component';
import { CoreDataTable, TablePageEvent, TableFilterEvent, TableSortEvent } from '../../../../core/components/data-table/data-table.component';
import { TableColumn } from '../../../../core/interfaces/table-column.interface';
import { TableAction } from '../../../../core/interfaces/table-action.interface';
import { TableRow } from '../../../../core/interfaces/table-row.interface';
import { ApiService } from './services/api.service';
import { Product } from './interfaces/products.interface';
import { ConfirmDialogComponent } from '../../../../core/components/confirm-dialog/confirm-dialog.component';
import { PermissionsService } from '../../../../core/services/permissions.service';
import { environment } from '../../../../../environments/environments';
import { CreateProductDialogComponent } from './components/create-product-dialog/create-product-dialog.component';

/** Fila aplanada compatible con TableRow para CoreDataTable */
interface ProductRow extends Record<string, string | number | boolean | null | undefined> {
  id: string;
  main_image: string;
  name: string;
  price: string;
  quantity: number;
  categories: string;
  created_at: string;
  updated_at: string;
}

@Component({
  selector: 'dashboard-products',
  imports: [CardStructure, CoreDataTable],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class Products implements OnInit {
  private readonly permissions = inject(PermissionsService);
  private readonly productPermissions = this.permissions.forModule('products');

  readonly canCreate = computed(() => this.productPermissions().includes('products.create'));
  private readonly canEdit   = computed(() => this.productPermissions().includes('products.update'));
  private readonly canDelete = computed(() => this.productPermissions().includes('products.delete'));

  readonly actions = computed<TableAction[]>(() => {
    const list: TableAction[] = [];
    if (this.canEdit())   list.push({ key: 'edit',   icon: 'edit',   tooltip: 'Editar',   color: 'primary' });
    if (this.canDelete()) list.push({ key: 'delete', icon: 'delete', tooltip: 'Eliminar', color: 'warn'    });
    return list;
  });

  readonly columns: TableColumn[] = [
    {
      key: 'main_image',
      header: 'Imagen',
      type: 'image',
      sortable: false,
      filterable: false,
    },
    { key: 'name',       header: 'Nombre',      dbField: 'products.name'       },
    { key: 'price',      header: 'Precio',       dbField: 'products.price'      },
    { key: 'quantity',   header: 'Stock',        dbField: 'products.quantity'   },
    { key: 'categories', header: 'Categorías',   sortable: false, filterable: false },
    { key: 'created_at', header: 'Creado',       dbField: 'products.created_at' },
    { key: 'updated_at', header: 'Actualizado',  dbField: 'products.updated_at' },
  ];

  data  = signal<ProductRow[]>([]);
  total = signal<number>(0);

  private currentPage   = 1;
  private pageSize      = 10;
  private filters: Record<string, string> = {};
  private sortColumn    = 'products.updated_at';
  private sortDir: 'asc' | 'desc' = 'desc';

  private readonly apiService = inject(ApiService);
  private readonly dialog     = inject(MatDialog);

  readonly titleReport = 'Reporte de Productos';

  ngOnInit(): void { this.loadProducts(); }

  onRefresh(): void { this.currentPage = 1; this.filters = {}; this.loadProducts(); }

  onCreate(): void {
    this.dialog.open(CreateProductDialogComponent).afterClosed().subscribe({
      next: (created) => { if (created) this.loadProducts(); },
    });
  }

  onAction(event: { action: string; row: TableRow }): void {
    const row = event.row as ProductRow;
    switch (event.action) {
      case 'edit':
        this.dialog.open(CreateProductDialogComponent, { data: { product: this.findOriginal(row.id) } })
          .afterClosed().subscribe({ next: (updated) => { if (updated) this.loadProducts(); } });
        break;
      case 'delete':
        this.dialog.open(ConfirmDialogComponent, {
          panelClass: 'notification-dialog-panel',
          data: {
            message: `¿Estás seguro de que deseas eliminar el producto "${row.name}"?\nEsta acción no se puede deshacer.`,
            action: () => this.apiService.deleteProduct(row.id),
            successMessage: 'Producto eliminado exitosamente.',
            errorMessage: 'Error al eliminar el producto.',
          },
        }).afterClosed().subscribe({ next: (confirmed: boolean) => { if (confirmed) this.loadProducts(); } });
        break;
    }
  }

  onPageChange(event: TablePageEvent): void {
    this.currentPage = event.page;
    this.pageSize    = event.pageSize === 0 ? this.total() : event.pageSize;
    this.loadProducts();
  }

  onFilterChange(event: TableFilterEvent): void {
    this.filters = event.filters;
    this.currentPage = 1;
    this.loadProducts();
  }

  onSortChange(event: TableSortEvent): void {
    this.sortColumn  = event.column || 'products.updated_at';
    this.sortDir     = (event.direction as 'asc' | 'desc') || 'desc';
    this.currentPage = 1;
    this.loadProducts();
  }

  // ── Datos originales para pasar al dialog de edición ──────────
  private originalProducts: Product[] = [];

  private findOriginal(id: string): Product | undefined {
    return this.originalProducts.find(p => p.id === id);
  }

  private loadProducts(): void {
    this.apiService
      .getProducts(this.currentPage, this.pageSize, this.filters, this.sortColumn, this.sortDir)
      .subscribe(response => {
        this.originalProducts = response.data;
        this.total.set(response.total);
        this.data.set(response.data.map(p => this.toRow(p)));
      });
  }

  /** Aplana el producto para que CoreDataTable pueda renderizarlo */
  private toRow(product: Product): ProductRow {
    return {
      id:          product.id,
      main_image:  product.main_image,
      name:        product.name,
      price:       `$${parseFloat(product.price).toFixed(2)}`,
      quantity:    product.quantity,
      categories:  product.categories.map(c => c.name).join(', '),
      created_at:  product.created_at,
      updated_at:  product.updated_at,
    };
  }
}
