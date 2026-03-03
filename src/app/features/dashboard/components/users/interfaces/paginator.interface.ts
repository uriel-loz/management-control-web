export interface Paginator {
  page: number;
  per_page: number;
  'filters[email]'?: string;
  'filters[role]'?: string;
}

