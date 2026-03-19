export interface BadgeConfig {
  bg: string;
  text: string;
  border: string;
  icon?: string;
  label: string;
}

export interface TableColumn {
  key: string;
  header: string;
  dbField?: string;                    // columna DB real (ej: 'users.created_at'). Fallback: key
  type?: 'text' | 'image' | 'badge';  // tipo de celda; por defecto 'text'
  imageBaseUrl?: string;               // URL base para columnas de imagen
  badgeMap?: Record<string, BadgeConfig>; // mapa de valores → config visual del badge
  sortable?: boolean;
  filterable?: boolean;
  placeholder?: string;
}
