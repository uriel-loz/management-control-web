import {
  AfterViewInit,
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { TableColumn } from '../../interfaces/table-column.interface';
import { TableRow } from '../../interfaces/table-row.interface';
import { TableAction } from '../../interfaces/table-action.interface';

export interface TablePageEvent {
  page: number; // 1-based
  pageSize: number; // 0 = todos los registros
}

export interface TableFilterEvent {
  filters: Record<string, string>;
}

export interface TableSortEvent {
  column: string;
  direction: 'asc' | 'desc' | '';
}

const ALL_PAGE_SIZE = 9999;

function createPaginatorIntl(): MatPaginatorIntl {
  const intl = new MatPaginatorIntl();
  intl.itemsPerPageLabel = 'Registros por página:';
  const baseRangeLabel = intl.getRangeLabel.bind(intl);
  intl.getRangeLabel = (page: number, pageSize: number, length: number) => {
    if (pageSize >= ALL_PAGE_SIZE) {
      return `Todos los registros (${length})`;
    }
    return baseRangeLabel(page, pageSize, length);
  };
  return intl;
}

@Component({
  selector: 'core-data-table',
  providers: [{ provide: MatPaginatorIntl, useFactory: createPaginatorIntl }],
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
  ],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.scss',
})
export class CoreDataTable<T extends TableRow> implements AfterViewInit, OnChanges {
  @Input() columns: TableColumn[] = [];
  @Input() data: T[] = [];
  @Input() pageSizeOptions: number[] = [10, 50, 100];
  @Input() sortActive: string = '';
  @Input() sortDirection: 'asc' | 'desc' = 'asc';
  @Input() showCreate: boolean = false;
  @Input() createLabel: string = 'Crear';
  @Input() serverSide: boolean = false;
  @Input() total: number = 0;
  @Input() showAllOption: boolean = false;
  @Input() actions: TableAction[] = [];
  @Input() titleReport: string = '';

  @Output() refresh = new EventEmitter<void>();
  @Output() create = new EventEmitter<void>();
  @Output() pageChange = new EventEmitter<TablePageEvent>();
  @Output() filterChange = new EventEmitter<TableFilterEvent>();
  @Output() sortChange = new EventEmitter<TableSortEvent>();
  @Output() actionClick = new EventEmitter<{ action: string; row: T }>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource = new MatTableDataSource<T>([]);
  displayedColumns: string[] = [];
  filterColumns: string[] = [];
  columnFilters: Record<string, string> = {};

  private keyToDbField: Record<string, string> = {};
  private readonly destroyRef = inject(DestroyRef);
  private readonly filterSubject = new Subject<void>();

  get effectivePageSizeOptions(): number[] {
    if (!this.showAllOption) return this.pageSizeOptions;
    return [...this.pageSizeOptions, ALL_PAGE_SIZE];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['columns'] || changes['actions']) {
      this.displayedColumns = this.columns.map(c => c.key);
      this.filterColumns = this.columns.map(c => c.key + '-filter');
      this.columnFilters = Object.fromEntries(this.columns.map(c => [c.key, '']));
      this.keyToDbField = Object.fromEntries(this.columns.map(c => [c.key, c.dbField ?? c.key]));
      if (this.actions.length > 0) {
        this.displayedColumns.unshift('actions');
        this.filterColumns.unshift('actions-filter');
      }
    }
    if (changes['data']) {
      this.dataSource.data = this.data;
    }
    if (changes['total'] && this.serverSide && this.paginator) {
      this.paginator.length = this.total;
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;

    if (this.serverSide) {
      this.paginator.length = this.total;

      this.paginator.page
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((event: PageEvent) => {
          const isAll = event.pageSize >= ALL_PAGE_SIZE;
          this.pageChange.emit({
            page: isAll ? 1 : event.pageIndex + 1,
            pageSize: isAll ? 0 : event.pageSize,
          });
        });

      this.sort.sortChange
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(sort => {
          this.paginator.firstPage();
          this.sortChange.emit({ column: this.keyToDbField[sort.active] ?? sort.active, direction: sort.direction });
        });

      // Setup filter debouncing for server-side mode
      this.filterSubject
        .pipe(
          debounceTime(600),
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe(() => {
          const activeFilters = Object.fromEntries(
            Object.entries(this.columnFilters)
              .filter(([_, value]) => value.trim() !== '')
              .map(([key, value]) => [this.keyToDbField[key] ?? key, value])
          );
          this.filterChange.emit({ filters: activeFilters });
        });

    } else {
      this.dataSource.paginator = this.paginator;
    }

    this.dataSource.filterPredicate = (row: T, filter: string) => {
      const filters: Record<string, string> = JSON.parse(filter);
      return Object.entries(filters).every(([key, val]) => {
        if (!val) return true;
        return String(row[key]).toLowerCase().includes(val.toLowerCase());
      });
    };
  }

  applyColumnFilter(_column: string): void {
    if (this.serverSide) {
      // Server-side: trigger debounced event emission
      this.filterSubject.next();
    } else {
      // Client-side: apply filter locally
      this.dataSource.filter = JSON.stringify(this.columnFilters);
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }
  }

  onRefresh(): void {
    this.refresh.emit();
  }

  onCreate(): void {
    this.create.emit();
  }

  onActionClick(key: string, row: T): void {
    this.actionClick.emit({ action: key, row });
  }

  exportToCsv(): void {
    const headers = this.columns.map(c => c.header);
    const rows = this.dataSource.filteredData.map(row =>
      this.columns.map(c => row[c.key])
    );

    const csvContent = [headers, ...rows]
      .map(row => row.map(v => `"${v}"`).join(','))
      .join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${this.titleReport}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  }
}
