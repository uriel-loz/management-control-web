export interface TableColumn {
  key: string;
  header: string;
  sortable?: boolean;
  filterable?: boolean;
  placeholder?: string;
}
