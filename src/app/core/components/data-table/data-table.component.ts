import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TableColumn } from '../../interfaces/table-column.interface';

@Component({
  selector: 'core-data-table',
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.scss',
})
export class CoreDataTable implements AfterViewInit, OnChanges {
  @Input() columns: TableColumn[] = [];
  @Input() data: unknown[] = [];
  @Input() pageSizeOptions: number[] = [5, 10, 20];
  @Input() sortActive: string = '';
  @Input() sortDirection: 'asc' | 'desc' = 'asc';
  @Input() showCreate: boolean = false;
  @Input() createLabel: string = 'Crear';

  @Output() refresh = new EventEmitter<void>();
  @Output() create = new EventEmitter<void>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource = new MatTableDataSource<unknown>([]);

  displayedColumns: string[] = [];
  filterColumns: string[] = [];
  columnFilters: Record<string, string> = {};

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['columns']) {
      this.displayedColumns = this.columns.map(c => c.key);
      this.filterColumns = this.columns.map(c => c.key + '-filter');
      this.columnFilters = Object.fromEntries(this.columns.map(c => [c.key, '']));
    }
    if (changes['data']) {
      this.dataSource.data = this.data;
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.filterPredicate = (row: unknown, filter: string) => {
      const filters: Record<string, string> = JSON.parse(filter);
      return Object.entries(filters).every(([key, val]) => {
        if (!val) return true;
        return String((row as Record<string, unknown>)[key])
          .toLowerCase()
          .includes(val.toLowerCase());
      });
    };
  }

  applyColumnFilter(_column: string): void {
    this.dataSource.filter = JSON.stringify(this.columnFilters);
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onRefresh(): void {
    this.refresh.emit();
  }

  onCreate(): void {
    this.create.emit();
  }

  exportToCsv(): void {
    const headers = this.columns.map(c => c.header);
    const rows = (this.dataSource.filteredData as Record<string, unknown>[]).map(row =>
      this.columns.map(c => row[c.key])
    );

    const csvContent = [headers, ...rows]
      .map(row => row.map(v => `"${v}"`).join(','))
      .join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'export.csv';
    anchor.click();
    URL.revokeObjectURL(url);
  }
}
