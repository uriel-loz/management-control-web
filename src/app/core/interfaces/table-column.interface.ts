export interface TableColumn {
  key: string;
  header: string;
  dbField?: string;     // columna DB real (ej: 'users.created_at'). Fallback: key
  sortable?: boolean;
  filterable?: boolean;
  placeholder?: string;
}
