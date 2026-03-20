import { ResponseTable } from '../../../../../core/interfaces/table-response.interface';

export interface OrderUser {
  id: string;
  name: string;
  email: string;
}

export interface OrderProductPivot {
  quantity: number;
  unit_price: string;
  subtotal: string;
}

export interface OrderProduct {
  pivot: OrderProductPivot;
}

export interface Product {
  id: string;
  name: string;
  price: string;
  orders: OrderProduct[];
}

export interface OrderPayment {
  id: string;
  status: string;
  method: string;
  quantity: string;
  order_id: string;
}

export interface Order extends Record<string, unknown> {
  id: string;
  status: string;
  total_products: number;
  total_price: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  user: OrderUser;
  products: Product[];
  payment: OrderPayment | null;
}

export type OrderTable = ResponseTable<Order>;
