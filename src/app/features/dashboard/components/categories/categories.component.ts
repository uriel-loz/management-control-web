import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CardStructure } from '../../../../core/components/card-structure/card-structure.component';
import { CoreDataTable, TablePageEvent, TableFilterEvent, TableSortEvent } from '../../../../core/components/data-table/data-table.component';
import { TableColumn } from '../../../../core/interfaces/table-column.interface';
import { TableAction } from '../../../../core/interfaces/table-action.interface';
import { ApiService } from './services/api.service';
import { Category } from './interfaces/categories.interface';
import { CreateCategoryDialogComponent } from './components/create-category-dialog/create-category-dialog.component';
import { ConfirmDialogComponent } from '../../../../core/components/confirm-dialog/confirm-dialog.component';
import { PermissionsService } from '../../../../core/services/permissions.service';

@Component({
  selector: 'dashboard-categories',
  imports: [CardStructure, CoreDataTable],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
})
export class Categories implements OnInit {
  private readonly permissions = inject(PermissionsService);
  private readonly categoryPermissions = this.permissions.forModule('categories');

  readonly canCreate = computed(() => this.categoryPermissions().includes('categories.create'));
  private readonly canEdit   = computed(() => this.categoryPermissions().includes('categories.update'));
  private readonly canDelete = computed(() => this.categoryPermissions().includes('categories.delete'));

  readonly actions = computed<TableAction[]>(() => {
    const list: TableAction[] = [];
    if (this.canEdit())   list.push({ key: 'edit',   icon: 'edit',   tooltip: 'Editar',   color: 'primary' });
    if (this.canDelete()) list.push({ key: 'delete', icon: 'delete', tooltip: 'Eliminar', color: 'warn'    });
    return list;
  });

  readonly columns: TableColumn[] = [
    { key: 'name',           header: 'Nombre',      dbField: 'categories.name'           },
    { key: 'description',    header: 'Descripción',  dbField: 'categories.description'    },
    { key: 'products_count', header: 'Productos',    dbField: 'categories.products_count' },
    { key: 'created_at',     header: 'Creado',       dbField: 'categories.created_at'     },
    { key: 'updated_at',     header: 'Actualizado',  dbField: 'categories.updated_at'     },
  ];

  data  = signal<Category[]>([]);
  total = signal<number>(0);

  private currentPage = 1;
  private pageSize    = 10;
  private filters: Record<string, string> = {};
  private sortColumn  = 'categories.updated_at';
  private sortDir: 'asc' | 'desc' = 'desc';
  private readonly apiService = inject(ApiService);
  private readonly dialog     = inject(MatDialog);
  titleReport = 'Reporte de Categorías';

  ngOnInit(): void {
    this.loadCategories();
  }

  onRefresh(): void {
    this.currentPage = 1;
    this.filters = {};
    this.loadCategories();
  }

  onCreate(): void {
    this.dialog.open(CreateCategoryDialogComponent).afterClosed().subscribe({
      next: (created) => {
        if (created) this.loadCategories();
      },
    });
  }

  onAction(event: { action: string; row: Category }): void {
    switch (event.action) {
      case 'edit':
        this.dialog.open(CreateCategoryDialogComponent, { data: { category: event.row } })
          .afterClosed().subscribe({
            next: (updated) => { if (updated) this.loadCategories(); },
          });
        break;
      case 'delete':
        this.dialog.open(ConfirmDialogComponent, {
          panelClass: 'notification-dialog-panel',
          data: {
            message: `¿Estás seguro de que deseas eliminar la categoría "${event.row['name']}"?\nEsta acción no se puede deshacer.`,
            action: () => this.apiService.deleteCategory(event.row['id']),
            successMessage: 'Categoría eliminada exitosamente.',
            errorMessage: 'Error al eliminar la categoría.',
          },
        }).afterClosed().subscribe({
          next: (confirmed: boolean) => {
            if (confirmed) this.loadCategories();
          },
        });
        break;
    }
  }

  onPageChange(event: TablePageEvent): void {
    this.currentPage = event.page;
    this.pageSize    = event.pageSize === 0 ? this.total() : event.pageSize;
    this.loadCategories();
  }

  onFilterChange(event: TableFilterEvent): void {
    this.filters = event.filters;
    this.currentPage = 1;
    this.loadCategories();
  }

  onSortChange(event: TableSortEvent): void {
    this.sortColumn = event.column || 'categories.updated_at';
    this.sortDir    = (event.direction as 'asc' | 'desc') || 'desc';
    this.currentPage = 1;
    this.loadCategories();
  }

  private loadCategories(): void {
    this.apiService.getCategories(
      this.currentPage,
      this.pageSize,
      this.filters,
      this.sortColumn,
      this.sortDir,
    ).subscribe(response => {
      this.data.set(response.data);
      this.total.set(response.total);
    });
  }
}
