import { apiRequest } from './client';

export interface BillItemDto {
  itemName: string;
  quantity: number;
  totalAmount: number;
}

export interface BillDto {
  id: number;
  billNumber: string;
  tableSessionId?: number;
  tableNumber: string;
  guestName: string;
  guestCount: number;
  subtotal: number;
  taxAmount: number;
  serviceCharge: number;
  discountAmount: number;
  totalDue: number;
  status: string; // UNPAID, PARTIALLY_PAID, PAID
  splitCount: number;
  shareAmount: number;
  sessionStartedAt?: string;
  items: BillItemDto[];
}

export interface PayBillPayload {
  splitCount?: number;
  amount?: number;
  paymentMethod?: string; // UPI, CARD, CASH
  transactionReference?: string;
}

export const billingApi = {
  getTableBill: (tableId: string | number, slug = 'ember-and-olive') =>
    apiRequest<BillDto>(`/public/table/${tableId}/bill?slug=${slug}`),

  payBill: (billId: number, payload: PayBillPayload) =>
    apiRequest<BillDto>(`/public/bills/${billId}/pay`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};
