import { Component, inject, OnInit, signal } from '@angular/core';
import { CardStructure } from '../../../../core/components/card-structure/card-structure.component';
import { CoreDataTable, TablePageEvent, TableFilterEvent, TableSortEvent } from '../../../../core/components/data-table/data-table.component';
import { TableColumn } from '../../../../core/interfaces/table-column.interface';
import { TableAction } from '../../../../core/interfaces/table-action.interface';
import { ApiService } from './services/api.service';
import { User } from './interfaces/users-table.interface';

@Component({
  selector: 'dashboard-users',
  imports: [CardStructure, CoreDataTable],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class Users implements OnInit {
  readonly actions: TableAction[] = [
    { key: 'edit',   icon: 'edit',   tooltip: 'Editar',   color: 'primary' },
    { key: 'delete', icon: 'delete', tooltip: 'Eliminar', color: 'warn'    },
  ];

  readonly columns: TableColumn[] = [
    { key: 'name',       header: 'Nombre',      dbField: 'users.name' },
    { key: 'email',      header: 'Correo',       dbField: 'users.email' },
    { key: 'phone',      header: 'Teléfono',     dbField: 'users.phone' },
    { key: 'role',       header: 'Rol',          dbField: 'roles.name' },
    { key: 'type',       header: 'Tipo',         dbField: 'users.is_customer'},
    { key: 'created_at', header: 'Creado',       dbField: 'users.created_at' },
    { key: 'updated_at', header: 'Actualizado',  dbField: 'users.updated_at' },
  ];

  data  = signal<User[]>([]);
  total = signal<number>(0);

  private currentPage = 1;
  private pageSize    = 10;
  private filters: Record<string, string> = {};
  private sortColumn  = 'users.updated_at';
  private sortDir: 'asc' | 'desc' = 'desc';
  private apiService = inject(ApiService);
  titleReport = 'Reporte de Usuarios';

  constructor() {}

  ngOnInit(): void {
    this.loadUsers();
  }

  onRefresh(): void {
    this.currentPage = 1;
    this.filters = {};
    this.loadUsers();
  }

  onCreate(): void {
    // TODO: abrir dialog de creación
    console.log('creation');
  }

  onAction(event: { action: string; row: User }): void {
    switch (event.action) {
      case 'edit':
        // TODO: abrir dialog de edición
        console.log('edit', event.row);
        break;
      case 'delete':
        // TODO: abrir dialog de confirmación y eliminar
        console.log('delete', event.row);
        break;
    }
  }

  onPageChange(event: TablePageEvent): void {
    this.currentPage = event.page;
    this.pageSize    = event.pageSize === 0 ? this.total() : event.pageSize;
    this.loadUsers();
  }

  onFilterChange(event: TableFilterEvent): void {
    this.filters = event.filters;
    this.currentPage = 1;
    this.loadUsers();
  }

  onSortChange(event: TableSortEvent): void {
    this.sortColumn  = event.column || 'users.updated_at';
    this.sortDir     = (event.direction as 'asc' | 'desc') || 'desc';
    this.currentPage = 1;
    this.loadUsers();
  }

  private loadUsers(): void {
    this.apiService.getUsers(this.currentPage, this.pageSize, this.filters, this.sortColumn, this.sortDir).subscribe(response => {
      this.data.set(response.data);
      this.total.set(response.total);
    });
  }
}
