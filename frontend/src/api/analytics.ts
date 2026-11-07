import { apiRequest } from './client';

export interface HourlySalesPoint {
  hourLabel: string;
  salesInThousands: number;
  totalAmount: number;
}

export interface PopularDishStat {
  name: string;
  emoji: string;
  ordersCount: number;
  percentage: number;
}

export interface AnalyticsDashboardDto {
  grossSales: number;
  netSales: number;
  avgOrderValue: number;
  totalOrders: number;
  avgPrepTimeMinutes: number;
  tableTurnoverMinutes: number;
  activeTables: number;
  totalTables: number;
  occupancyPercentage: number;
  queueLength: number;
  avgQueueWaitMinutes: number;
  hourlySales: HourlySalesPoint[];
  popularDishes: PopularDishStat[];
}

export const analyticsApi = {
  getAnalytics: (slug = 'ember-and-olive', range = 'today') =>
    apiRequest<AnalyticsDashboardDto>(`/admin/analytics?slug=${slug}&range=${range}`),
};
