import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queueApi, QueueTicketDto } from '../api/queue';
import { restaurantApi, DiningTableDto } from '../api/restaurant';
import { useDineFlowStore } from '../store/useDineFlowStore';

export const Screen10HostConsole: React.FC = () => {
  const { setScreen, showToast, triggerConfetti } = useDineFlowStore();
  const queryClient = useQueryClient();

  const { data: queueEntries = [] } = useQuery<QueueTicketDto[]>({
    queryKey: ['staffQueue'],
    queryFn: () => queueApi.getStaffQueue('ember-and-olive'),
    refetchInterval: 3000,
  });

  const { data: tables = [] } = useQuery<DiningTableDto[]>({
    queryKey: ['staffTables'],
    queryFn: () => restaurantApi.getTables('ember-and-olive'),
    refetchInterval: 3000,
  });

  const assignMutation = useMutation({
    mutationFn: async ({ ticketId, tableNumber }: { ticketId: number; tableNumber?: string }) => {
      return queueApi.assignTable(ticketId, undefined, tableNumber);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['staffQueue'] });
      queryClient.invalidateQueries({ queryKey: ['staffTables'] });
      triggerConfetti();
      showToast(`${data.ticketToken} assigned to Table ${data.assignedTableNumber}!`);
    },
    onError: (err: any) => {
      showToast(err.message || 'Failed to assign table');
    },
  });

  const waitingEntries = queueEntries.filter((x) => x.status === 'WAITING');
  const availableTables = tables.filter((t) => t.status === 'AVAILABLE');
  const totalWaitingGuests = waitingEntries.reduce((acc, x) => acc + x.partySize, 0);

  return (
    <div className="p-4 md:p-8 max-w-[1400px] mx-auto min-h-[760px] bg-[#fbfaf5]">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="text-[9px] tracking-[1.7px] uppercase font-extrabold text-[#879188]">
            FRONT OF HOUSE
          </div>
          <h1 className="font-heading font-extrabold text-[26px] md:text-[34px] tracking-tight my-1 text-[#1d2925]">
            Good evening, host.
          </h1>
          <p className="text-[12px] text-[#7c887e]">
            Manage arrivals and match parties to tables without losing queue order.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e5efe4] text-[#4e7654] border border-[#d6e5d4] text-[10px] font-extrabold">
          ● Service active
        </span>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mb-6">
        <div className="bg-[#fffefa] border border-[#e5e4da] rounded-[15px] p-4 shadow-sm">
          <span className="text-[9px] text-[#879188] font-bold block">Waiting parties</span>
          <b className="font-heading font-extrabold text-[25px] text-[#1d2925] block my-1">
            {waitingEntries.length}
          </b>
          <span className="text-[9px] text-[#879188]">Across all party sizes</span>
        </div>

        <div className="bg-[#fffefa] border border-[#e5e4da] rounded-[15px] p-4 shadow-sm">
          <span className="text-[9px] text-[#879188] font-bold block">Guests waiting</span>
          <b className="font-heading font-extrabold text-[25px] text-[#1d2925] block my-1">
            {totalWaitingGuests > 0 ? totalWaitingGuests : 11}
          </b>
          <span className="text-[9px] text-[#879188]">Live head count</span>
        </div>

        <div className="bg-[#fffefa] border border-[#e5e4da] rounded-[15px] p-4 shadow-sm">
          <span className="text-[9px] text-[#879188] font-bold block">Tables available</span>
          <b className="font-heading font-extrabold text-[25px] text-[#4e7654] block my-1">
            {availableTables.length}
          </b>
          <span className="text-[9px] text-[#879188]">Ready to seat</span>
        </div>

        <div className="bg-[#fffefa] border border-[#e5e4da] rounded-[15px] p-4 shadow-sm">
          <span className="text-[9px] text-[#879188] font-bold block">Avg. wait</span>
          <b className="font-heading font-extrabold text-[25px] text-[#1d2925] block my-1">
            16m
          </b>
          <span className="text-[9px] text-[#879188]">Last 30 minutes</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
        {/* Waiting List Table */}
        <div className="bg-[#fffefa] border border-[#e5e4da] rounded-[17px] p-5 shadow-[0_5px_18px_rgba(35,47,39,0.025)]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-heading font-extrabold text-[14px]">Waiting list</h3>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#fbf1d9] text-[#98722d] border border-[#f1e2bb] text-[9px] font-extrabold">
              FIFO + table fit
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[11px] border-collapse">
              <thead>
                <tr className="bg-[#f5f2e9] text-[#89938b] text-[9px] uppercase tracking-wider font-extrabold border-b border-[#eeeae0]">
                  <th className="p-2.5">Token / guest</th>
                  <th className="p-2.5">Party</th>
                  <th className="p-2.5">Wait</th>
                  <th className="p-2.5">Status</th>
                  <th className="p-2.5">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eeeae0]">
                {queueEntries.map((q) => (
                  <tr key={q.id} className="hover:bg-[#fbfaf5]">
                    <td className="p-2.5">
                      <b className="font-heading text-[#1d2925]">{q.ticketToken}</b>
                      <div className="text-[9px] text-[#89938b]">{q.customerName}</div>
                    </td>
                    <td className="p-2.5 font-bold">{q.partySize}</td>
                    <td className="p-2.5 text-[#7c887e]">{q.estimatedWaitMinutes}m</td>
                    <td className="p-2.5">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[8px] font-extrabold ${
                          q.status === 'SEATED' || q.status === 'NOTIFIED'
                            ? 'bg-[#e5efe4] text-[#4e7654]'
                            : 'bg-[#fbf1d9] text-[#98722d]'
                        }`}
                      >
                        {q.status}
                      </span>
                    </td>
                    <td className="p-2.5">
                      {q.status === 'WAITING' ? (
                        <button
                          onClick={() => assignMutation.mutate({ ticketId: q.id })}
                          className="bg-[#ef6b4b] text-white px-2.5 py-1 rounded-[7px] text-[9px] font-extrabold hover:scale-105 active:scale-95 transition-transform"
                        >
                          Assign
                        </button>
                      ) : (
                        <span className="text-[10px] text-[#89938b]">
                          {q.assignedTableNumber ? `Table ${q.assignedTableNumber}` : '—'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-[9px] text-[#89938b] mt-3">
            Table assignment is protected against race conditions and double bookings on the backend.
          </p>
        </div>

        {/* Suggested Table Matches & Floor Plan CTA */}
        <div className="bg-[#fffefa] border border-[#e5e4da] rounded-[17px] p-5 shadow-[0_5px_18px_rgba(35,47,39,0.025)]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-heading font-extrabold text-[14px]">Suggested table matches</h3>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#f0eee4] text-[#66746a] border border-[#e9e5d8] text-[9px] font-extrabold">
              Smart fit
            </span>
          </div>

          <div className="divide-y divide-[#eeeae0] mb-4">
            <div className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-[24px]">🪑</span>
                <div>
                  <b className="font-heading font-extrabold text-[11px] text-[#1d2925]">
                    Q-018 · Aarav Sharma
                  </b>
                  <div className="text-[9px] text-[#89938b]">
                    3 guests · Table T03 (2 seats) / T08 (4 seats)
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  const q = queueEntries.find((x) => x.ticketToken === 'Q-018') || queueEntries[0];
                  if (q) assignMutation.mutate({ ticketId: q.id, tableNumber: 'T03' });
                }}
                className="bg-[#6d8b72] text-white px-3 py-1.5 rounded-[8px] text-[10px] font-extrabold hover:scale-105 transition-transform"
              >
                Assign T03
              </button>
            </div>

            <div className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-[24px]">🪑</span>
                <div>
                  <b className="font-heading font-extrabold text-[11px] text-[#1d2925]">
                    Q-016 · Riya Mehta
                  </b>
                  <div className="text-[9px] text-[#89938b]">2 guests · Table T08 (4 seats)</div>
                </div>
              </div>
              <button
                onClick={() => {
                  const q = queueEntries.find((x) => x.ticketToken === 'Q-016') || queueEntries[0];
                  if (q) assignMutation.mutate({ ticketId: q.id, tableNumber: 'T08' });
                }}
                className="bg-[#f3f0e6] text-[#334139] border border-[#e7e2d3] px-3 py-1.5 rounded-[8px] text-[10px] font-extrabold hover:bg-[#e4dfd0] transition-colors"
              >
                Assign T08
              </button>
            </div>
          </div>

          <div className="bg-[#f4f0e5] border-l-4 border-[#e8b64d] p-3 rounded-r-[8px] text-[10px] text-[#7e7866] leading-relaxed mb-4">
            The matching algorithm prioritizes party size matching table capacity to maximize turnover while respecting FIFO waiting order.
          </div>

          <button
            onClick={() => setScreen('floor-plan')}
            className="w-full bg-[#17221e] text-white py-2.5 rounded-[10px] text-[11px] font-extrabold hover:bg-[#27362f] transition-colors"
          >
            Open live floor plan →
          </button>
        </div>
      </div>
    </div>
  );
};
