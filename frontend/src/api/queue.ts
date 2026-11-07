import { apiRequest } from './client';
import { OrderResponseDto } from './orders';

export interface QueueTicketDto {
  id: number;
  ticketToken: string; // e.g. Q-018
  customerName: string;
  customerPhone?: string;
  partySize: number;
  seatingPreference: string;
  status: string; // WAITING, NOTIFIED, SEATED, CANCELLED, NO_SHOW, EXPIRED
  estimatedWaitMinutes: number;
  positionAhead: number;
  assignedTableId?: number;
  assignedTableNumber?: string;
  advanceOrderMode?: string;
  advanceOrder?: OrderResponseDto;
  createdAt: string;
  waitDurationText: string;
}

export interface QueueJoinPayload {
  restaurantSlug?: string;
  customerName: string;
  customerPhone?: string;
  partySize: number;
  seatingPreference?: string;
}

export interface AdvanceOrderPayload {
  mode: string; // "after-seat" or "counter-now"
  items: {
    menuItemId: number;
    quantity: number;
    spiceLevel?: string;
    instructions?: string;
  }[];
}

export const queueApi = {
  joinQueue: (payload: QueueJoinPayload) =>
    apiRequest<QueueTicketDto>(`/public/queue`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getTicketStatus: (ticketToken: string) =>
    apiRequest<QueueTicketDto>(`/public/queue/${ticketToken}`),

  cancelTicket: (ticketToken: string) =>
    apiRequest<QueueTicketDto>(`/public/queue/${ticketToken}/cancel`, { method: 'POST' }),

  placeAdvanceOrder: (ticketToken: string, payload: AdvanceOrderPayload) =>
    apiRequest<OrderResponseDto>(`/public/queue/${ticketToken}/advance-order`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getStaffQueue: (slug = 'ember-and-olive') =>
    apiRequest<QueueTicketDto[]>(`/staff/queue?slug=${slug}`),

  assignTable: (ticketId: number, tableId?: number, tableNumber?: string) =>
    apiRequest<QueueTicketDto>(`/staff/queue/${ticketId}/assign-table`, {
      method: 'POST',
      body: JSON.stringify({ tableId, tableNumber }),
    }),

  markSeated: (ticketId: number) =>
    apiRequest<QueueTicketDto>(`/staff/queue/${ticketId}/mark-seated`, { method: 'POST' }),

  markNoShow: (ticketId: number) =>
    apiRequest<QueueTicketDto>(`/staff/queue/${ticketId}/mark-no-show`, { method: 'POST' }),
};
