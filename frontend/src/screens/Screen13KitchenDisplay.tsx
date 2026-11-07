import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersApi, OrderResponseDto } from '../api/orders';
import { useDineFlowStore } from '../store/useDineFlowStore';

export const Screen13KitchenDisplay: React.FC = () => {
  const { showToast, triggerConfetti } = useDineFlowStore();
  const queryClient = useQueryClient();

  const { data: kitchenOrders = [] } = useQuery<OrderResponseDto[]>({
    queryKey: ['kitchenOrders'],
    queryFn: () => ordersApi.getKitchenOrders('ember-and-olive'),
    refetchInterval: 3000,
  });

  const acceptMutation = useMutation({
    mutationFn: async (orderId: number) => ordersApi.acceptKitchenOrder(orderId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['kitchenOrders'] });
      showToast(`${data.orderNumber} accepted by kitchen`);
    },
  });

  const preparingMutation = useMutation({
    mutationFn: async (orderId: number) => ordersApi.markPreparingOrder(orderId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['kitchenOrders'] });
      showToast(`${data.orderNumber} in preparation`);
    },
  });

  const readyMutation = useMutation({
    mutationFn: async (orderId: number) => ordersApi.markReadyOrder(orderId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['kitchenOrders'] });
      triggerConfetti();
      showToast(`${data.orderNumber} marked READY for service!`);
    },
  });

  const placedOrders = kitchenOrders.filter((o) => o.status === 'PLACED');
  const preparingOrders = kitchenOrders.filter((o) => o.status === 'ACCEPTED' || o.status === 'PREPARING');
  const readyOrders = kitchenOrders.filter((o) => o.status === 'READY');

  const columns = [
    { key: 'PLACED', label: 'New orders', list: placedOrders, color: 'bg-[#fbf1d9] text-[#98722d]' },
    { key: 'PREPARING', label: 'In preparation', list: preparingOrders, color: 'bg-[#fae4dc] text-[#c45137]' },
    { key: 'READY', label: 'Ready to serve', list: readyOrders, color: 'bg-[#e5efe4] text-[#4e7654]' },
  ];

  return (
    <div className="p-4 md:p-8 max-w-[1400px] mx-auto min-h-[760px] bg-[#fbfaf5]">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="text-[9px] tracking-[1.7px] uppercase font-extrabold text-[#879188]">
            BACK OF HOUSE · KITCHEN DISPLAY
          </div>
          <h1 className="font-heading font-extrabold text-[26px] md:text-[34px] tracking-tight my-1 text-[#1d2925]">
            Kitchen queue
          </h1>
          <p className="text-[12px] text-[#7c887e]">
            Prioritize by age, promised time, and station. Touch-friendly controls designed for kitchen tablets.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e5efe4] text-[#4e7654] border border-[#d6e5d4] text-[10px] font-extrabold">
          ● Connected · Live KDS
        </span>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-3.5 mb-6">
        <div className="bg-[#fffefa] border border-[#e5e4da] rounded-[15px] p-4 shadow-sm">
          <span className="text-[9px] text-[#879188] font-bold block">Open tickets</span>
          <b className="font-heading font-extrabold text-[25px] text-[#1d2925] block my-1">
            {kitchenOrders.length}
          </b>
          <span className="text-[9px] text-[#879188]">Active tickets in kitchen</span>
        </div>

        <div className="bg-[#fffefa] border border-[#e5e4da] rounded-[15px] p-4 shadow-sm">
          <span className="text-[9px] text-[#879188] font-bold block">Avg. prep time</span>
          <b className="font-heading font-extrabold text-[25px] text-[#1d2925] block my-1">
            14m
          </b>
          <span className="text-[9px] text-[#879188]">Target: &lt;18 min</span>
        </div>

        <div className="bg-[#fffefa] border border-[#e5e4da] rounded-[15px] p-4 shadow-sm">
          <span className="text-[9px] text-[#879188] font-bold block">Ready to run</span>
          <b className="font-heading font-extrabold text-[25px] text-[#4e7654] block my-1">
            {readyOrders.length}
          </b>
          <span className="text-[9px] text-[#879188]">Awaiting waiter handoff</span>
        </div>
      </div>

      {/* 3-Column Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {columns.map((col) => (
          <div
            key={col.key}
            className="bg-[#f0eee5] border border-[#e3dfd2] rounded-[16px] p-3.5 min-h-[300px]"
          >
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#e5e1d4]">
              <h3 className="font-heading font-extrabold text-[12px] text-[#1d2925]">
                {col.label}
              </h3>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-extrabold ${col.color}`}>
                {col.list.length}
              </span>
            </div>

            <div className="space-y-3">
              {col.list.length > 0 ? (
                col.list.map((order) => (
                  <div
                    key={order.id}
                    className="bg-[#fffefa] border border-[#e7e2d5] rounded-[13px] p-3.5 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <strong className="font-heading font-extrabold text-[12px]">
                        {order.orderNumber}
                      </strong>
                      <span className="text-[9px] text-[#89938b] font-bold bg-[#f3f0e6] px-2 py-0.5 rounded-full">
                        {order.age}
                      </span>
                    </div>

                    <div className="text-[10px] text-[#748076] font-bold my-1">
                      {order.destination === 'PICKUP' ? 'Counter Pickup' : `Table ${order.destination}`} · {order.orderType}
                    </div>

                    <p className="text-[11px] text-[#33423b] my-2 leading-relaxed font-medium">
                      {order.itemsSummary}
                    </p>

                    {order.specialInstructions && (
                      <div className="text-[9px] text-[#ef6b4b] bg-[#fae4dc] px-2 py-1 rounded-[6px] mb-2 font-semibold">
                        Note: {order.specialInstructions}
                      </div>
                    )}

                    {col.key === 'PLACED' && (
                      <button
                        onClick={() => preparingMutation.mutate(order.id)}
                        className="w-full mt-2 bg-[#ef6b4b] text-white py-2 rounded-[8px] text-[10px] font-extrabold hover:scale-102 transition-transform shadow-sm"
                      >
                        Accept &amp; start cooking
                      </button>
                    )}

                    {col.key === 'PREPARING' && (
                      <button
                        onClick={() => readyMutation.mutate(order.id)}
                        className="w-full mt-2 bg-[#6d8b72] text-white py-2 rounded-[8px] text-[10px] font-extrabold hover:scale-102 transition-transform shadow-sm"
                      >
                        Mark ready for runner ✓
                      </button>
                    )}

                    {col.key === 'READY' && (
                      <div className="text-center py-1 text-[10px] font-extrabold text-[#4e7654] bg-[#e5efe4] rounded-[8px] mt-2">
                        Waiting for service team
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center text-[10px] text-[#89938b] py-8">
                  No orders in this station.
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
