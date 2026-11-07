import { apiRequest } from './client';

export interface OrderItemDto {
  id: number;
  menuItemId?: number;
  name: string;
  unitPrice: number;
  quantity: number;
  spiceLevel?: string;
  instructions?: string;
  totalPrice: number;
}

export interface OrderResponseDto {
  id: number;
  orderNumber: string;
  destination: string;
  orderType: string;
  customerName?: string;
  customerPhone?: string;
  status: string; // PLACED, ACCEPTED, PREPARING, READY, SERVED, COMPLETED, CANCELLED
  statusIndex: number;
  holdForSeating: boolean;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  specialInstructions?: string;
  paymentStatus: string;
  paymentMode: string;
  age: string;
  items: OrderItemDto[];
  itemsSummary: string;
  createdAt: string;
}

export interface OrderCreatePayload {
  restaurantSlug?: string;
  destination: string;
  orderType?: string;
  customerName?: string;
  customerPhone?: string;
  specialInstructions?: string;
  paymentMode?: string;
  tableSessionId?: number;
  queueTicketToken?: string;
  items: {
    menuItemId: number;
    quantity: number;
    spiceLevel?: string;
    instructions?: string;
  }[];
}

export const ordersApi = {
  placeOrder: (payload: OrderCreatePayload) =>
    apiRequest<OrderResponseDto>(`/public/orders`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getOrderStatus: (orderNumber: string) =>
    apiRequest<OrderResponseDto>(`/public/orders/${orderNumber}`),

  getAllOrders: (slug = 'ember-and-olive') =>
    apiRequest<OrderResponseDto[]>(`/staff/orders?slug=${slug}`),

  updateOrderStatus: (orderId: number, status: string, note?: string) =>
    apiRequest<OrderResponseDto>(`/staff/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, note }),
    }),

  getKitchenOrders: (slug = 'ember-and-olive') =>
    apiRequest<OrderResponseDto[]>(`/staff/kitchen/orders?slug=${slug}`),

  acceptKitchenOrder: (orderId: number) =>
    apiRequest<OrderResponseDto>(`/staff/kitchen/orders/${orderId}/accept`, { method: 'POST' }),

  markPreparingOrder: (orderId: number) =>
    apiRequest<OrderResponseDto>(`/staff/kitchen/orders/${orderId}/preparing`, { method: 'POST' }),

  markReadyOrder: (orderId: number) =>
    apiRequest<OrderResponseDto>(`/staff/kitchen/orders/${orderId}/ready`, { method: 'POST' }),

  getReadyRunnerOrders: (slug = 'ember-and-olive') =>
    apiRequest<OrderResponseDto[]>(`/staff/runner/orders?slug=${slug}`),

  confirmServedOrder: (orderId: number) =>
    apiRequest<OrderResponseDto>(`/staff/runner/orders/${orderId}/serve`, { method: 'POST' }),

  callWaiterRequest: (tableNumber: string, requestType = 'CALL_WAITER') =>
    apiRequest<any>(`/public/service-requests`, {
      method: 'POST',
      body: JSON.stringify({ tableNumber, requestType, restaurantSlug: 'ember-and-olive' }),
    }),
};
