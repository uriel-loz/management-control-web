export interface StatusConfig {
  bg: string;
  text: string;
  border: string;
  icon: string;
  label: string;
}

export const ORDER_STATUS_MAP: Record<string, StatusConfig> = {
  pending:    { bg: '#fef3c7', text: '#92400e', border: '#fde68a', icon: 'schedule',      label: 'Pendiente'   },
  processing: { bg: '#dbeafe', text: '#1e40af', border: '#bfdbfe', icon: 'autorenew',     label: 'En proceso'  },
  completed:  { bg: '#dcfce7', text: '#166534', border: '#bbf7d0', icon: 'check_circle',  label: 'Completado'  },
  cancelled:  { bg: '#fee2e2', text: '#991b1b', border: '#fecaca', icon: 'cancel',        label: 'Cancelado'   },
  refunded:   { bg: '#f3e8ff', text: '#6b21a8', border: '#e9d5ff', icon: 'replay',        label: 'Reembolsado' },
};

export const PAYMENT_STATUS_MAP: Record<string, StatusConfig> = {
  pending:    { bg: '#fef3c7', text: '#92400e', border: '#fde68a', icon: 'schedule',      label: 'Pendiente'   },
  processing: { bg: '#dbeafe', text: '#1e40af', border: '#bfdbfe', icon: 'autorenew',     label: 'En proceso'  },
  completed:  { bg: '#dcfce7', text: '#166534', border: '#bbf7d0', icon: 'check_circle',  label: 'Completado'  },
  failed:     { bg: '#fee2e2', text: '#991b1b', border: '#fecaca', icon: 'error_outline', label: 'Fallido'     },
  refunded:   { bg: '#f3e8ff', text: '#6b21a8', border: '#e9d5ff', icon: 'replay',        label: 'Reembolsado' },
};

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  credit_card:   'Tarjeta de crédito',
  debit_card:    'Tarjeta de débito',
  paypal:        'PayPal',
  bank_transfer: 'Transferencia bancaria',
  cash:          'Efectivo',
};

const FALLBACK_STATUS: StatusConfig = {
  bg: '#f3f4f6', text: '#374151', border: '#e5e7eb', icon: 'help_outline', label: '—',
};

export function getOrderStatus(status: string): StatusConfig {
  return ORDER_STATUS_MAP[status] ?? { ...FALLBACK_STATUS, label: status };
}

export function getPaymentStatus(status: string): StatusConfig {
  return PAYMENT_STATUS_MAP[status] ?? { ...FALLBACK_STATUS, label: status };
}

export function getPaymentMethodLabel(method: string): string {
  return PAYMENT_METHOD_LABELS[method] ?? method;
}

export function getShortId(id: string): string {
  return id.slice(0, 8).toUpperCase();
}
