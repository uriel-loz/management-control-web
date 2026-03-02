import { Component, OnInit, signal } from '@angular/core';
import { CardStructure } from '../../../../core/components/card-structure/card-structure.component';
import { CoreDataTable, TablePageEvent } from '../../../../core/components/data-table/data-table.component';
import { TableColumn } from '../../../../core/interfaces/table-column.interface';
import { ApiService } from './services/api.service';
import { User } from './interfaces/users-table.interface';

@Component({
  selector: 'dashboard-users',
  imports: [CardStructure, CoreDataTable],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class Users implements OnInit {
  readonly columns: TableColumn[] = [
    { key: 'name',       header: 'Nombre' },
    { key: 'email',      header: 'Correo' },
    { key: 'phone',      header: 'Teléfono' },
    { key: 'role',       header: 'Rol' },
    { key: 'type',       header: 'Tipo' },
    { key: 'created_at', header: 'Creado' },
    { key: 'updated_at', header: 'Actualizado' },
  ];

  data  = signal<User[]>([]);
  total = signal<number>(0);

  private currentPage = 1;
  private pageSize    = 10;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  onRefresh(): void {
    this.currentPage = 1;
    this.loadUsers();
  }

  onCreate(): void {
    // TODO: abrir dialog de creación
  }

  onPageChange(event: TablePageEvent): void {
    this.currentPage = event.page;
    this.pageSize    = event.pageSize === 0 ? this.total() : event.pageSize;
    this.loadUsers();
  }

  private loadUsers(): void {
    this.api.getUsers(this.currentPage, this.pageSize).subscribe(response => {
      this.data.set(response.data);
      this.total.set(response.total);
    });
  }
}
