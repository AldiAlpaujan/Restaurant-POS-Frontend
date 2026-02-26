import client, { api } from '@/lib/http-client';
import type { Order } from '@/types/order';

export type CreateOrderPayload = {
  table_id: number;
  status: 'occupied' | 'reserved';
  items: ItemsPayload;
};

type ItemsPayload = { food_item_id: number; quantity: number; notes?: string }[];

export type AddOrderItemsPayload = {
  items: ItemsPayload;
};

export type OrderDetail = Order & {
  items: {
    id: number;
    order_id: number;
    food_item_id: number;
    quantity: number;
    price: string;
    food_item: {
      id: number;
      name: string;
      price: string;
      category: string;
    };
  }[];
};

export class OrderService {
  static async createOrder(payload: CreateOrderPayload): Promise<Order> {
    const res = await client().post<{ data: Order }>(api.createOrder, payload);
    return res.data?.data ?? (res.data as unknown as Order);
  }

  static async getOrderDetail(id: number): Promise<OrderDetail> {
    const res = await client().get<{ data: OrderDetail }>(api.getOrderDetail(id));
    return res.data?.data ?? (res.data as unknown as OrderDetail);
  }

  static async getOrderFromTable(tableId: number): Promise<OrderDetail | null> {
    try {
      const res = await client().get<{ data: OrderDetail }>(api.getOrderFromTable(tableId));
      return res.data?.data ?? (res.data as unknown as OrderDetail);
    } catch {
      return null;
    }
  }

  static async addOrderItems(orderId: number, payload: AddOrderItemsPayload): Promise<void> {
    await client().post(api.addOrderItems(orderId), payload);
  }

  static async closeOrder(id: number): Promise<void> {
    await client().post(api.closeOrder(id));
  }
}
