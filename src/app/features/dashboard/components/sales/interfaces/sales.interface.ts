import { ResponseTable } from '../../../../../core/interfaces/table-response.interface';
import { ApiResponse } from '../../../../../core/interfaces/api-response.interface';
import { Order } from '../../orders/interfaces/orders.interface';

export interface PaymentOrder {
  id: string;
  status: string;
  total_products: number;
  total_price: string;
  user_id: string;
}

export interface Payment extends Record<string, unknown> {
  id: string;
  status: string;
  method: string;
  quantity: string;
  order_id: string;
  created_at: string;
  updated_at: string;
  order: PaymentOrder;
}

export type PaymentTable = ResponseTable<Payment>;
export type OrderDetailResponse = ApiResponse<Order>;
