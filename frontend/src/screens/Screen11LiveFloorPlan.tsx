import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { restaurantApi, DiningTableDto } from '../api/restaurant';
import { useDineFlowStore } from '../store/useDineFlowStore';
import { FloorScene3D } from '../components/shared/FloorScene3D';

export const Screen11LiveFloorPlan: React.FC = () => {
  const { setActiveTableNumber, setScreen, showToast } = useDineFlowStore();
  const [selectedTableId, setSelectedTableId] = useState<number | null>(4); // default T04
  const queryClient = useQueryClient();

  const { data: tables = [] } = useQuery<DiningTableDto[]>({
    queryKey: ['staffTables'],
    queryFn: () => restaurantApi.getTables('ember-and-olive'),
    refetchInterval: 3000,
  });

  const selectedTable = tables.find((t) => t.id === selectedTableId) || tables[0];

  const statusMutation = useMutation({
    mutationFn: async ({ tableId, status }: { tableId: number; status: string }) => {
      return restaurantApi.updateTableStatus(tableId, status);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['staffTables'] });
      showToast(`${data.tableNumber} is now ${data.status}`);
    },
    onError: (err: any) => {
      showToast(err.message || 'Status update failed');
    },
  });

  const getTableColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'AVAILABLE':
        return 'linear-gradient(145deg, #d9c9a6, #f6ecd5)';
      case 'OCCUPIED':
        return 'linear-gradient(145deg, #e7a17f, #f4c1a7)';
      case 'CLEANING':
        return 'linear-gradient(145deg, #a5b7a1, #d5e0d0)';
      case 'RESERVED':
        return 'linear-gradient(145deg, #e7c56d, #f5e3a9)';
      default:
        return '#f3f0e6';
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-[1400px] mx-auto min-h-[760px] bg-[#fbfaf5]">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="text-[9px] tracking-[1.7px] uppercase font-extrabold text-[#879188]">
            SEATING OPERATIONS
          </div>
          <h1 className="font-heading font-extrabold text-[26px] md:text-[34px] tracking-tight my-1 text-[#1d2925]">
            Live floor plan
          </h1>
          <p className="text-[12px] text-[#7c887e]">
            Select a table to inspect its session or update its service state.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#e5efe4] text-[#4e7654] text-[9px] font-extrabold">
            ● Available
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#fbe8e1] text-[#c45137] text-[9px] font-extrabold">
            ● Occupied
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#fbf1d9] text-[#98722d] text-[9px] font-extrabold">
            ● Reserved
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
        {/* Floor Wrap Grid */}
        <div className="bg-[#f4f0e6] border border-[#e5dfcf] rounded-[19px] p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-extrabold text-[14px]">
              Dining room · {tables.length} tables
            </h3>
            <span className="text-[10px] text-[#89938b]">Live floor status</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {tables.map((table) => {
              const isSelected = selectedTable?.id === table.id;
              return (
                <div
                  key={table.id}
                  onClick={() => {
                    setSelectedTableId(table.id);
                    setActiveTableNumber(table.tableNumber);
                  }}
                  className={`bg-[#fffefa] border rounded-[15px] min-h-[115px] p-3 text-center transition-all cursor-pointer hover:-translate-y-1 hover:shadow-md ${
                    isSelected
                      ? 'border-[#ef6b4b] ring-2 ring-[#ef6b4b33]'
                      : 'border-[#ded9ca]'
                  }`}
                >
                  <div
                    className="w-11 h-11 rounded-full mx-auto mb-2 border-[5px] border-white shadow-[0_5px_9px_#6b5a3825] grid place-items-center text-[10px] font-black text-[#5c675d]"
                    style={{ background: getTableColor(table.status) }}
                  >
                    {table.tableNumber}
                  </div>
                  <strong className="block font-heading font-extrabold text-[11px] text-[#1d2925]">
                    {table.seatsCapacity} seats
                  </strong>
                  <small className="block text-[8px] font-extrabold uppercase tracking-wider text-[#89938b] mt-1">
                    {table.status}
                  </small>
                  <small className="block text-[8px] text-[#748076] truncate">
                    {table.currentGuestNote || '—'}
                  </small>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3D Isometric Preview */}
        <FloorScene3D
          onTableClick={(num) => {
            const match = tables.find((t) => t.tableNumber === num);
            if (match) {
              setSelectedTableId(match.id);
              setActiveTableNumber(match.tableNumber);
            }
          }}
        />
      </div>

      {/* Selected Table Detail Inspector */}
      {selectedTable && (
        <div className="bg-[#fffefa] border border-[#e5e4da] rounded-[17px] p-5 shadow-[0_5px_18px_rgba(35,47,39,0.025)] mt-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-extrabold text-[16px]">
                  Table {selectedTable.tableNumber}
                </h3>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#f0eee4] text-[9px] font-extrabold">
                  {selectedTable.seatsCapacity} seats · Dining Room
                </span>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-extrabold ${
                    selectedTable.status === 'AVAILABLE'
                      ? 'bg-[#e5efe4] text-[#4e7654]'
                      : selectedTable.status === 'OCCUPIED'
                      ? 'bg-[#fbe8e1] text-[#c45137]'
                      : 'bg-[#fbf1d9] text-[#98722d]'
                  }`}
                >
                  {selectedTable.status}
                </span>
              </div>
              <p className="text-[11px] text-[#7c887e] mt-1">
                {selectedTable.currentGuestNote || 'No special guest note'}
              </p>
            </div>

            {/* Action buttons depending on state */}
            <div className="flex items-center gap-2 flex-wrap">
              {selectedTable.status === 'AVAILABLE' && (
                <button
                  onClick={() =>
                    statusMutation.mutate({ tableId: selectedTable.id, status: 'OCCUPIED' })
                  }
                  className="bg-[#ef6b4b] text-white px-3.5 py-2 rounded-[9px] text-[10px] font-extrabold hover:scale-105 transition-transform"
                >
                  Seat guests
                </button>
              )}

              {selectedTable.status === 'OCCUPIED' && (
                <>
                  <button
                    onClick={() => {
                      setActiveTableNumber(selectedTable.tableNumber);
                      setScreen('table-session');
                    }}
                    className="bg-[#17221e] text-white px-3.5 py-2 rounded-[9px] text-[10px] font-extrabold hover:bg-[#27362f] transition-colors"
                  >
                    View active session →
                  </button>
                  <button
                    onClick={() =>
                      statusMutation.mutate({ tableId: selectedTable.id, status: 'CLEANING' })
                    }
                    className="bg-[#f3f0e6] border border-[#e7e2d3] text-[#334139] px-3.5 py-2 rounded-[9px] text-[10px] font-extrabold hover:bg-[#e4dfd0] transition-colors"
                  >
                    Mark needs cleaning
                  </button>
                </>
              )}

              {selectedTable.status === 'CLEANING' && (
                <button
                  onClick={() =>
                    statusMutation.mutate({ tableId: selectedTable.id, status: 'AVAILABLE' })
                  }
                  className="bg-[#6d8b72] text-white px-3.5 py-2 rounded-[9px] text-[10px] font-extrabold hover:scale-105 transition-transform"
                >
                  Mark reset &amp; available
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
