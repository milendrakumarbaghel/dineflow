import { apiRequest } from './client';

export interface RestaurantDto {
  id: number;
  name: string;
  slug: string;
  description: string;
  logoUrl?: string;
  currency: string;
  currencySymbol: string;
  timezone: string;
  active: boolean;
  allowQrOrdering: boolean;
  allowCounterPickup: boolean;
  requireStaffAcceptance: boolean;
  allowOrderCancellation: boolean;
  noShowGraceMinutes: number;
  seatingStrategy: string;
  advanceOrderPolicy: string;
  defaultTaxRate: number;
  serviceChargeRate: number;
}

export interface DiningTableDto {
  id: number;
  tableNumber: string;
  seatsCapacity: number;
  status: string; // AVAILABLE, OCCUPIED, CLEANING, RESERVED, INACTIVE
  currentGuestNote?: string;
  qrToken: string;
  qrCodeDataUrl: string;
  areaName?: string;
}

export interface QrContextResponse {
  restaurant: RestaurantDto;
  table: DiningTableDto;
  activeSessionId?: number;
  sessionCode?: string;
  valid: boolean;
  message: string;
}

export const restaurantApi = {
  getPublicRestaurant: (slug = 'ember-and-olive') =>
    apiRequest<RestaurantDto>(`/public/restaurants/${slug}`),

  getQrContext: (slug: string, token: string) =>
    apiRequest<QrContextResponse>(`/public/restaurants/${slug}/qr/${token}/context`),

  getTables: (slug = 'ember-and-olive') =>
    apiRequest<DiningTableDto[]>(`/staff/tables?slug=${slug}`),

  updateTableStatus: (tableId: number, status: string, note?: string) =>
    apiRequest<DiningTableDto>(`/staff/tables/${tableId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, note }),
    }),

  createTable: (tableNumber: string, seatsCapacity = 4) =>
    apiRequest<DiningTableDto>(`/staff/tables`, {
      method: 'POST',
      body: JSON.stringify({ tableNumber, seatsCapacity }),
    }),

  startSession: (tableId: number, guestName: string, guestCount: number) =>
    apiRequest<any>(`/staff/tables/${tableId}/start-session`, {
      method: 'POST',
      body: JSON.stringify({ guestName, guestCount }),
    }),

  closeSession: (tableId: number) =>
    apiRequest<DiningTableDto>(`/staff/tables/${tableId}/close-session`, {
      method: 'POST',
    }),

  updateSettings: (settings: Partial<RestaurantDto>) =>
    apiRequest<RestaurantDto>(`/admin/settings`, {
      method: 'PUT',
      body: JSON.stringify(settings),
    }),
};
