import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersApi, OrderResponseDto } from '../api/orders';
import { apiRequest } from '../api/client';
import { useDineFlowStore } from '../store/useDineFlowStore';

export const Screen14WaiterRunner: React.FC = () => {
  const { showToast, triggerConfetti } = useDineFlowStore();
  const queryClient = useQueryClient();

  const { data: readyOrders = [] } = useQuery<OrderResponseDto[]>({
    queryKey: ['readyRunnerOrders'],
    queryFn: () => ordersApi.getReadyRunnerOrders('ember-and-olive'),
    refetchInterval: 3000,
  });

  const { data: serviceRequests = [] } = useQuery<any[]>({
    queryKey: ['serviceRequests'],
    queryFn: () => apiRequest<any[]>('/staff/runner/requests?slug=ember-and-olive'),
    refetchInterval: 3000,
  });

  const serveMutation = useMutation({
    mutationFn: async (orderId: number) => ordersApi.confirmServedOrder(orderId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['readyRunnerOrders'] });
      triggerConfetti();
      showToast(`${data.orderNumber} confirmed served to ${data.destination}!`);
    },
  });

  const resolveRequestMutation = useMutation({
    mutationFn: async (requestId: number) =>
      apiRequest(`/staff/runner/requests/${requestId}/resolve`, { method: 'POST' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['serviceRequests'] });
      showToast('Service request marked handled');
    },
  });

  return (
    <div className="p-4 md:p-8 max-w-[1200px] mx-auto min-h-[760px] bg-[#fbfaf5]">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="text-[9px] tracking-[1.7px] uppercase font-extrabold text-[#879188]">
            SERVICE TEAM
          </div>
          <h1 className="font-heading font-extrabold text-[26px] md:text-[34px] tracking-tight my-1 text-[#1d2925]">
            Ready to run.
          </h1>
          <p className="text-[12px] text-[#7c887e]">
            Take each completed order to the right destination and confirm the handoff.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e5efe4] text-[#4e7654] border border-[#d6e5d4] text-[10px] font-extrabold">
          {readyOrders.length} orders ready
        </span>
      </div>

      {/* Ready Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {readyOrders.length > 0 ? (
          readyOrders.map((order) => (
            <div
              key={order.id}
              className="bg-[#fffefa] border border-[#e5e4da] rounded-[17px] p-5 shadow-[0_5px_18px_rgba(35,47,39,0.025)] hover:-translate-y-1 transition-transform"
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#e5efe4] text-[#4e7654] text-[9px] font-extrabold">
                  READY FOR SERVICE
                </span>
                <b className="text-[10px] text-[#89938b]">{order.age}</b>
              </div>

              <h2 className="font-heading font-extrabold text-[22px] text-[#1d2925] mt-3 mb-1">
                {order.destination === 'PICKUP' ? 'Counter pickup' : `Table ${order.destination}`}
              </h2>
              <div className="text-[10px] text-[#89938b] mb-2 font-bold">
                {order.orderNumber} · {order.orderType}
              </div>

              <p className="text-[11px] text-[#33423b] leading-relaxed my-3 font-medium">
                {order.itemsSummary}
              </p>

              <div className="h-[1px] bg-[#eeeae0] my-3.5" />

              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[#748076] font-semibold">Assigned runner: You</span>
                <button
                  disabled={serveMutation.isPending}
                  onClick={() => serveMutation.mutate(order.id)}
                  className="bg-[#ef6b4b] text-white px-4 py-2 rounded-[9px] text-[10px] font-extrabold shadow-[0_5px_14px_rgba(239,107,75,0.2)] hover:scale-105 active:scale-95 transition-transform disabled:opacity-50"
                >
                  Confirm served ✓
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full bg-[#fffefa] border border-[#e5e4da] rounded-[17px] p-10 text-center text-[#748076]">
            <div className="text-[40px] mb-2">✨</div>
            <h3 className="font-heading font-extrabold text-[16px] text-[#1d2925] mb-1">
              All caught up
            </h3>
            <p className="text-[11px]">When the kitchen marks orders ready, they will appear here instantly.</p>
          </div>
        )}
      </div>

      {/* Service Requests Card */}
      <div className="bg-[#fffefa] border border-[#e5e4da] rounded-[17px] p-5 shadow-[0_5px_18px_rgba(35,47,39,0.025)] mt-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-heading font-extrabold text-[14px]">Guest service requests</h3>
          <span className="text-[10px] text-[#89938b] font-bold">
            {serviceRequests.length} pending
          </span>
        </div>

        <div className="divide-y divide-[#eeeae0]">
          {serviceRequests.length > 0 ? (
            serviceRequests.map((req) => (
              <div key={req.id} className="py-3 flex items-center justify-between">
                <div>
                  <b className="font-heading font-extrabold text-[11px] text-[#1d2925] block">
                    Table {req.tableNumber} ·{' '}
                    {req.requestType === 'REQUEST_BILL' ? 'Request bill' : 'Call for waiter'}
                  </b>
                  <div className="text-[9px] text-[#89938b]">
                    Guest requested assistance · Just now
                  </div>
                </div>
                <button
                  onClick={() => resolveRequestMutation.mutate(req.id)}
                  className="bg-[#f3f0e6] border border-[#e7e2d3] text-[#334139] px-3 py-1.5 rounded-[8px] text-[10px] font-extrabold hover:bg-[#e4dfd0] transition-colors"
                >
                  Mark handled
                </button>
              </div>
            ))
          ) : (
            <div className="py-3 text-[10px] text-[#89938b]">
              No active customer assistance requests.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
