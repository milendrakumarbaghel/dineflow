import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersApi, OrderResponseDto } from '../api/orders';
import { useDineFlowStore } from '../store/useDineFlowStore';
import { GuestHeader } from '../components/layout/GuestHeader';

export const Screen5OrderTracking: React.FC = () => {
  const { activeOrderNumber, setScreen, showToast } = useDineFlowStore();
  const queryClient = useQueryClient();

  const { data: order, isLoading } = useQuery<OrderResponseDto>({
    queryKey: ['order', activeOrderNumber],
    queryFn: () => ordersApi.getOrderStatus(activeOrderNumber),
    refetchInterval: 4000, // Live polling fallback
  });

  const advanceMutation = useMutation({
    mutationFn: async () => {
      if (!order) return;
      const nextStatuses = ['PLACED', 'ACCEPTED', 'PREPARING', 'READY', 'SERVED'];
      const nextIdx = Math.min(order.statusIndex + 1, 4);
      await ordersApi.updateOrderStatus(order.id, nextStatuses[nextIdx], 'Simulated status change');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order', activeOrderNumber] });
      showToast('Order status updated');
    },
  });

  const handleCallWaiter = async () => {
    try {
      await ordersApi.callWaiterRequest(order?.destination || 'T04', 'CALL_WAITER');
      showToast('Waiter request sent to the service team');
    } catch {
      showToast('Waiter request sent');
    }
  };

  const steps = ['Placed', 'Accepted', 'Preparing', 'Ready', 'Served'];
  const currentIdx = order ? order.statusIndex : 0;

  return (
    <div className="min-h-[760px] bg-[#fbfaf5] text-[#1d2925] flex flex-col justify-between">
      <div>
        <GuestHeader />

        <div className="p-4 md:p-8 max-w-[900px] mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-[9px] tracking-[1.7px] uppercase font-extrabold text-[#879188]">
                ORDER CONFIRMATION
              </div>
              <h1 className="font-heading font-extrabold text-[26px] md:text-[34px] tracking-tight my-1">
                Your order is in motion.
              </h1>
              <p className="text-[12px] text-[#7c887e]">
                We'll keep this page updated as the kitchen prepares your food.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e5efe4] text-[#4e7654] border border-[#d6e5d4] text-[10px] font-extrabold">
              ● Live updates
            </span>
          </div>

          {/* Hero Banner */}
          <div className="relative overflow-hidden rounded-[22px] p-6 text-white mb-4 bg-gradient-to-br from-[#1c2a23] to-[#30463a] shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[10px] text-[#c5d2c6] tracking-widest font-extrabold">
                  ORDER NUMBER
                </div>
                <div className="font-heading font-extrabold text-[42px] md:text-[50px] tracking-tight text-[#ffc36d] leading-none my-2">
                  {order?.orderNumber || activeOrderNumber}
                </div>
                <div className="text-[12px] text-[#c5d2c6]">
                  Table {order?.destination || 'T04'} · {order?.orderType || 'Dine-in'}
                </div>
              </div>

              <div className="text-[60px] md:text-[70px] animate-dish-hover">🍽️</div>
            </div>

            <div className="h-[1px] bg-[#ffffff24] my-4" />

            <div className="flex items-center justify-between text-[12px]">
              <span className="text-[#c5d2c6]">Estimated ready time</span>
              <strong className="text-[#ffd08a] font-extrabold text-[14px]">
                {currentIdx >= 3 ? 'Ready now!' : '12–18 min'}
              </strong>
            </div>
          </div>

          {/* Progress Card */}
          <div className="bg-[#fffefa] border border-[#e5e4da] rounded-[17px] p-5 shadow-[0_5px_18px_rgba(35,47,39,0.025)] mb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-extrabold text-[14px]">Order progress</h3>
              <span
                className={`inline-flex items-center px-3 py-0.5 rounded-full text-[10px] font-extrabold ${
                  currentIdx >= 3
                    ? 'bg-[#e5efe4] text-[#4e7654]'
                    : 'bg-[#fbf1d9] text-[#98722d]'
                }`}
              >
                {steps[currentIdx]?.toUpperCase() || 'PLACED'}
              </span>
            </div>

            {/* Timeline */}
            <div className="grid grid-cols-5 gap-1.5 my-4">
              {steps.map((step, idx) => {
                const isDone = idx < currentIdx;
                const isCurrent = idx === currentIdx;
                return (
                  <div key={step} className="text-center">
                    <div
                      className={`w-8 h-8 rounded-full mx-auto mb-1.5 grid place-items-center text-[11px] font-bold transition-all ${
                        isDone
                          ? 'bg-[#dcebdd] text-[#47764f]'
                          : isCurrent
                          ? 'bg-[#ef6b4b] text-white animate-current-pulse'
                          : 'bg-[#eeeae0] text-[#8a948a]'
                      }`}
                    >
                      {isDone ? '✓' : ['◷', '✓', '♨', '✦', '🍽'][idx]}
                    </div>
                    <span
                      className={`text-[9px] font-bold ${
                        isCurrent
                          ? 'text-[#ef6b4b]'
                          : isDone
                          ? 'text-[#47764f]'
                          : 'text-[#8b958c]'
                      }`}
                    >
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="h-[1px] bg-[#eeeae0] my-3.5" />

            <div className="flex items-center justify-between text-[11px]">
              <div>
                <strong className="block font-heading font-extrabold">Kitchen update</strong>
                <div className="text-[10px] text-[#89938b]">
                  {currentIdx === 0 && 'Order sent to restaurant'}
                  {currentIdx === 1 && 'Kitchen accepted your order'}
                  {currentIdx === 2 && 'Your food is being prepared at the station'}
                  {currentIdx === 3 && 'Your food is plated and ready for service'}
                  {currentIdx === 4 && 'Delivered! Enjoy your meal.'}
                </div>
              </div>
              <span className="text-[9px] text-[#89938b]">Just now</span>
            </div>
          </div>

          {/* Details & Actions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#fffefa] border border-[#e5e4da] rounded-[17px] p-5">
              <h3 className="font-heading font-extrabold text-[14px] mb-2">Items in this order</h3>
              <p className="text-[11px] text-[#7c887e] leading-relaxed">
                {order?.itemsSummary || '2 × Ghee Roast Dosa, 1 × Mint Lime Cooler'}
              </p>
              <div className="mt-3 text-[11px] text-[#1d2925] font-extrabold">
                Total: ₹{order?.totalAmount?.toLocaleString('en-IN') || '606'}
              </div>
            </div>

            <div className="bg-[#fffefa] border border-[#e5e4da] rounded-[17px] p-5 flex flex-col justify-between">
              <div>
                <h3 className="font-heading font-extrabold text-[14px] mb-2">Need anything?</h3>
                <p className="text-[11px] text-[#7c887e]">
                  Ask for assistance, extra cutlery, or request the bill whenever you're ready.
                </p>
              </div>

              <div className="flex items-center gap-2 mt-4">
                <button
                  onClick={handleCallWaiter}
                  className="flex-1 bg-[#f3f0e6] border border-[#e7e2d3] text-[#334139] py-2 px-3 rounded-[9px] text-[10px] font-extrabold hover:bg-[#e7e2d3] transition-colors"
                >
                  ♧ Call a waiter
                </button>
                <button
                  onClick={() => setScreen('bill')}
                  className="flex-1 bg-[#f3f0e6] border border-[#e7e2d3] text-[#334139] py-2 px-3 rounded-[9px] text-[10px] font-extrabold hover:bg-[#e7e2d3] transition-colors"
                >
                  View bill
                </button>
              </div>
            </div>
          </div>

          {/* Simulation Helper */}
          <div className="mt-5 p-3 rounded-[10px] bg-[#f4f0e5] border-l-4 border-[#e8b64d] text-[10px] text-[#7e7866] flex items-center justify-between">
            <span>Prototype control: Advance status to simulate kitchen and runner progress.</span>
            <button
              onClick={() => advanceMutation.mutate()}
              className="bg-[#17221e] text-white px-3 py-1.5 rounded-[8px] text-[10px] font-extrabold hover:bg-[#27362f] transition-colors"
            >
              Simulate next status →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
