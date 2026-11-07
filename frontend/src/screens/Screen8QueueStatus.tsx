import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queueApi, QueueTicketDto } from '../api/queue';
import { useDineFlowStore } from '../store/useDineFlowStore';

export const Screen8QueueStatus: React.FC = () => {
  const { queueToken, queueName, partySize, setScreen, showToast } = useDineFlowStore();
  const queryClient = useQueryClient();

  const { data: ticket } = useQuery<QueueTicketDto>({
    queryKey: ['queueTicket', queueToken],
    queryFn: () => queueApi.getTicketStatus(queueToken),
    refetchInterval: 3500, // Live poll queue position
  });

  const leaveMutation = useMutation({
    mutationFn: async () => queueApi.cancelTicket(queueToken),
    onSuccess: () => {
      showToast('You have left the waiting list');
      setScreen('guest-menu');
    },
  });

  const isAssigned = ticket?.status === 'NOTIFIED' || ticket?.status === 'SEATED';
  const assignedTable = ticket?.assignedTableNumber || 'T03';

  return (
    <div className="min-h-[760px] bg-[#fbfaf5] text-[#1d2925] flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-2.5 px-6 py-4 border-b border-[#eae7dd] bg-[#fffefa]">
          <div className="flex items-center gap-2.5 font-extrabold text-[15px] font-heading tracking-tight">
            <span className="w-8 h-8 rounded-[11px] bg-[#17221e] text-white grid place-items-center text-sm">
              ✦
            </span>
            EMBER &amp; OLIVE
          </div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#e5efe4] text-[#4e7654] border border-[#d6e5d4] text-[9px] font-extrabold">
            QUEUE LIVE
          </span>
        </div>

        <div className="p-4 md:p-8 max-w-[850px] mx-auto">
          {/* Queue Hero */}
          <div className="relative overflow-hidden rounded-[22px] p-6 text-white bg-gradient-to-br from-[#1c2a23] to-[#30463a] shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[10px] text-[#c5d2c6] tracking-widest font-extrabold uppercase">
                  YOUR QUEUE TOKEN
                </div>
                <div className="font-heading font-extrabold text-[50px] md:text-[62px] tracking-tight text-[#ffc36d] leading-none my-2">
                  {ticket?.ticketToken || queueToken}
                </div>
                <div className="text-[12px] text-[#c5d2c6]">
                  {ticket?.customerName || queueName} · Party of {ticket?.partySize || partySize}
                </div>
              </div>

              <div className="text-[60px] md:text-[75px] animate-dish-hover">🎟️</div>
            </div>

            <div className="h-[1px] bg-[#ffffff24] my-4" />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-[10px] text-[#c5d2c6] uppercase tracking-wider font-extrabold">
                  PEOPLE AHEAD
                </div>
                <div className="font-heading font-extrabold text-[26px] md:text-[30px] text-white">
                  {isAssigned ? '0 parties' : `${ticket?.positionAhead ?? 2} parties`}
                </div>
              </div>

              <div>
                <div className="text-[10px] text-[#c5d2c6] uppercase tracking-wider font-extrabold">
                  ESTIMATED WAIT
                </div>
                <div className="font-heading font-extrabold text-[26px] md:text-[30px] text-[#ffd08a]">
                  {isAssigned ? 'Table ready!' : `${ticket?.estimatedWaitMinutes ?? 15} min`}
                </div>
              </div>
            </div>
          </div>

          {/* Status Tracker */}
          <div className="bg-[#fffefa] border border-[#e5e4da] rounded-[17px] p-5 shadow-[0_5px_18px_rgba(35,47,39,0.025)] mt-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-heading font-extrabold text-[14px]">Your seating status</h3>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-extrabold ${
                  isAssigned
                    ? 'bg-[#e5efe4] text-[#4e7654]'
                    : 'bg-[#fbf1d9] text-[#98722d]'
                }`}
              >
                {ticket?.status || 'WAITING'}
              </span>
            </div>

            <div className="h-2 rounded-full bg-[#eeeae0] overflow-hidden my-3">
              <div
                className="h-full bg-gradient-to-r from-[#ef6b4b] to-[#e8b64d] rounded-full transition-all duration-700"
                style={{ width: isAssigned ? '100%' : '55%' }}
              />
            </div>

            <div className="flex justify-between text-[9px] text-[#89938b] font-bold">
              <span>Joined</span>
              <span>Table assigned</span>
              <span>Seated</span>
            </div>

            {isAssigned ? (
              <div className="mt-4 p-4 rounded-[16px] bg-gradient-to-r from-[#17221e] to-[#27362f] text-white flex items-center justify-between">
                <div>
                  <div className="text-[9px] text-[#ffd08a] uppercase tracking-wider font-extrabold">
                    YOUR TABLE IS READY
                  </div>
                  <div className="font-heading font-extrabold text-[32px] text-white">
                    {assignedTable}
                  </div>
                  <div className="text-[10px] text-[#c2cec4]">
                    Please proceed to the host stand within 5 minutes.
                  </div>
                </div>
                <button
                  onClick={() => setScreen('guest-menu')}
                  className="bg-[#ef6b4b] text-white px-3.5 py-2 rounded-[9px] text-[10px] font-extrabold hover:scale-105 transition-transform"
                >
                  Open Table Menu →
                </button>
              </div>
            ) : (
              <p className="text-[11px] text-[#7c887e] mt-3">
                You're in line. Keep this page open so you don't miss your seating call.
              </p>
            )}
          </div>

          {/* Advance Order Summary if present */}
          {ticket?.advanceOrder && (
            <div className="bg-[#fffefa] border border-[#e5e4da] rounded-[17px] p-5 shadow-[0_5px_18px_rgba(35,47,39,0.025)] mt-4">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-heading font-extrabold text-[14px]">
                  Advance order {ticket.advanceOrder.orderNumber}
                </h3>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-extrabold ${
                    ticket.advanceOrder.destination === 'PICKUP'
                      ? 'bg-[#fae4dc] text-[#c45137]'
                      : 'bg-[#e5efe4] text-[#4e7654]'
                  }`}
                >
                  {ticket.advanceOrder.destination === 'PICKUP' ? 'Counter pickup' : 'After seating'}
                </span>
              </div>
              <p className="text-[11px] text-[#7c887e] mb-2">{ticket.advanceOrder.itemsSummary}</p>
              <div className="text-[10px] text-[#89938b]">
                Status: {ticket.advanceOrder.status}.{' '}
                {ticket.advanceOrder.destination === 'PICKUP'
                  ? 'Collect from counter when called.'
                  : 'Kitchen will prepare upon table assignment.'}
              </div>
            </div>
          )}

          {/* Advance Order CTA & Leave Queue */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="bg-[#fffefa] border border-[#e5e4da] rounded-[17px] p-5">
              <h3 className="font-heading font-extrabold text-[14px] mb-1">Order while you wait</h3>
              <p className="text-[11px] text-[#7c887e] mb-3">
                Choose dishes now. Select “prepare after seating” or “prepare now for counter pickup”.
              </p>
              <button
                onClick={() => setScreen('queue-order')}
                className="bg-[#ef6b4b] text-white px-4 py-2 rounded-[9px] text-[10px] font-extrabold shadow-[0_5px_14px_rgba(239,107,75,0.2)] hover:scale-105 transition-transform"
              >
                {ticket?.advanceOrder ? 'View advance order →' : 'Start advance order →'}
              </button>
            </div>

            <div className="bg-[#fffefa] border border-[#e5e4da] rounded-[17px] p-5">
              <h3 className="font-heading font-extrabold text-[14px] mb-1">Need to leave?</h3>
              <p className="text-[11px] text-[#7c887e] mb-3">
                You can release your place in the waitlist. The host will be notified.
              </p>
              <button
                disabled={leaveMutation.isPending}
                onClick={() => leaveMutation.mutate()}
                className="bg-[#f3f0e6] border border-[#e7e2d3] text-[#334139] px-4 py-2 rounded-[9px] text-[10px] font-extrabold hover:bg-[#e4dfd0] transition-colors"
              >
                Leave queue
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
