export interface TableColumn {
  key: string;
  header: string;
  dbField?: string;         // columna DB real (ej: 'users.created_at'). Fallback: key
  type?: 'text' | 'image'; // tipo de celda; por defecto 'text'
  imageBaseUrl?: string;    // URL base para columnas de imagen (ej: 'http://localhost:8000/storage/')
  sortable?: boolean;
  filterable?: boolean;
  placeholder?: string;
}
