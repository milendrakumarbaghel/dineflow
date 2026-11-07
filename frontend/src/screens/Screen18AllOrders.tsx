import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Search, Filter, RefreshCw, Eye, ArrowRight, CheckCircle2 } from 'lucide-react';
import { ordersApi, OrderResponseDto } from '../api/orders';
import { useDineFlowStore } from '../store/useDineFlowStore';

export const Screen18AllOrders: React.FC = () => {
  const queryClient = useQueryClient();
  const { showToast, setScreen, setActiveOrderNumber } = useDineFlowStore();
  const [activeFilter, setActiveFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const { data: orders = [], isLoading, refetch } = useQuery({
    queryKey: ['all-orders'],
    queryFn: () => ordersApi.getAllOrders('ember-and-olive'),
    refetchInterval: 5000,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      ordersApi.updateOrderStatus(id, status),
    onSuccess: (updated) => {
      queryClient.setQueryData<OrderResponseDto[]>(['all-orders'], (old = []) =>
        old.map((o) => (o.id === updated.id ? updated : o))
      );
      showToast(`Order ${updated.orderNumber} updated to ${updated.status}`);
    },
  });

  const placedCount = orders.filter((o) => o.status === 'PLACED').length;
  const prepCount = orders.filter((o) => o.status === 'PREPARING' || o.status === 'ACCEPTED').length;
  const readyCount = orders.filter((o) => o.status === 'READY').length;

  const filteredOrders = orders.filter((order) => {
    const matchesFilter =
      activeFilter === 'ALL' ||
      (activeFilter === 'PLACED' && order.status === 'PLACED') ||
      (activeFilter === 'PREPARING' && (order.status === 'PREPARING' || order.status === 'ACCEPTED')) ||
      (activeFilter === 'READY' && order.status === 'READY') ||
      (activeFilter === 'SERVED' && order.status === 'SERVED');

    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      !searchTerm ||
      order.orderNumber.toLowerCase().includes(searchLower) ||
      order.destination.toLowerCase().includes(searchLower) ||
      (order.itemsSummary && order.itemsSummary.toLowerCase().includes(searchLower));

    return matchesFilter && matchesSearch;
  });

  const handleInspect = (orderNumber: string) => {
    setActiveOrderNumber(orderNumber);
    setScreen('order-tracking');
  };

  return (
    <div className="p-4 sm:p-7 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#ece8dc]">
        <div>
          <div className="text-[11px] font-bold tracking-widest text-[#ef6b4b] uppercase mb-1">
            ORDER CONTROL
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17221e] font-serif tracking-tight">
            All orders
          </h1>
          <p className="text-sm text-[#67776d] mt-1 font-sans">
            A unified view of dine-in, advance orders, and counter pickup.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#eaf5ed] text-[#34784a] border border-[#c4e6cc]">
            <span className="w-2 h-2 rounded-full bg-[#34784a] animate-pulse" />
            Sync active
          </span>
          <button
            onClick={() => refetch()}
            className="p-2 rounded-[12px] bg-[#f3f0e6] hover:bg-[#e7e3d5] text-[#3e4c43] transition-colors"
            title="Refresh Orders"
          >
            <RefreshCw size={15} />
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 my-5">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setActiveFilter('ALL')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              activeFilter === 'ALL'
                ? 'bg-[#17221e] text-white shadow-xs'
                : 'bg-[#f3f0e6] text-[#55635b] hover:bg-[#e7e3d5]'
            }`}
          >
            All {orders.length}
          </button>
          <button
            onClick={() => setActiveFilter('PLACED')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              activeFilter === 'PLACED'
                ? 'bg-[#b07d1b] text-white shadow-xs'
                : 'bg-[#fdf6e6] text-[#b07d1b] hover:bg-[#fae8b8]'
            }`}
          >
            Placed {placedCount}
          </button>
          <button
            onClick={() => setActiveFilter('PREPARING')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              activeFilter === 'PREPARING'
                ? 'bg-[#ef6b4b] text-white shadow-xs'
                : 'bg-[#fbeeed] text-[#c93f24] hover:bg-[#f7d6ce]'
            }`}
          >
            Preparing {prepCount}
          </button>
          <button
            onClick={() => setActiveFilter('READY')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              activeFilter === 'READY'
                ? 'bg-[#34784a] text-white shadow-xs'
                : 'bg-[#eaf5ed] text-[#34784a] hover:bg-[#d2edd7]'
            }`}
          >
            Ready {readyCount}
          </button>
        </div>

        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8c9c92]" />
          <input
            type="text"
            placeholder="Search order / table..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 pr-3 py-1.5 rounded-[12px] border border-[#ddd8ca] bg-white text-xs text-[#17221e] focus:outline-none focus:border-[#ef6b4b] w-full sm:w-52"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-[18px] border border-[#eae6da] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#f0ece0] bg-[#faf8f2] text-[11px] font-bold text-[#79887e] uppercase tracking-wider">
                <th className="py-3.5 px-4 sm:px-6">Order</th>
                <th className="py-3.5 px-4">Destination</th>
                <th className="py-3.5 px-4 min-w-[200px]">Items</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Age</th>
                <th className="py-3.5 px-4 text-right sm:pr-6">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f2efe5] text-sm text-[#17221e]">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#879188]">
                    Loading restaurant orders...
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#879188]">
                    No orders match the current filter.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const isReady = order.status === 'READY';
                  const isPrep = order.status === 'PREPARING' || order.status === 'ACCEPTED';
                  const isPlaced = order.status === 'PLACED';
                  const isServed = order.status === 'SERVED' || order.status === 'COMPLETED';

                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-[#faf9f5] transition-colors group cursor-pointer"
                      onClick={() => handleInspect(order.orderNumber)}
                    >
                      <td className="py-3.5 px-4 sm:px-6">
                        <span className="font-mono font-bold text-[#17221e] group-hover:text-[#ef6b4b] transition-colors">
                          {order.orderNumber}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2 py-0.5 rounded-[8px] bg-[#f3f0e6] font-bold text-xs text-[#28382f]">
                          {order.destination}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="text-xs text-[#415147] line-clamp-1 max-w-xs sm:max-w-md">
                          {order.itemsSummary ||
                            (order.items &&
                              order.items.map((i) => `${i.quantity} × ${i.name}`).join(', ')) ||
                            'Selected dishes'}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-[#6e7d72] whitespace-nowrap">
                        {order.orderType || (order.destination === 'PICKUP' ? 'Counter' : 'Dine-in')}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            isReady
                              ? 'bg-[#eaf5ed] text-[#34784a] border border-[#c4e6cc]'
                              : isPrep
                              ? 'bg-[#fbeeed] text-[#c93f24] border border-[#f5c7be]'
                              : isPlaced
                              ? 'bg-[#fdf6e6] text-[#b07d1b] border border-[#fae8b8]'
                              : 'bg-[#ece8dc] text-[#55635b]'
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-xs font-mono text-[#8a998f] whitespace-nowrap">
                        {order.age || 'Just now'}
                      </td>
                      <td className="py-3.5 px-4 text-right sm:pr-6" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleInspect(order.orderNumber)}
                          className="px-2.5 py-1 rounded-[8px] bg-[#f3f0e6] hover:bg-[#17221e] hover:text-white text-xs font-medium text-[#44534a] transition-all"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
