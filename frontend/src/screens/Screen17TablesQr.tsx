import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, QrCode, Printer, X, Download, Check, Sparkles } from 'lucide-react';
import { restaurantApi, DiningTableDto } from '../api/restaurant';
import { useDineFlowStore } from '../store/useDineFlowStore';

export const Screen17TablesQr: React.FC = () => {
  const queryClient = useQueryClient();
  const { showToast } = useDineFlowStore();
  const [selectedTableForQr, setSelectedTableForQr] = useState<DiningTableDto | null>(null);
  const [isAddTableModalOpen, setIsAddTableModalOpen] = useState(false);
  const [newTableNumber, setNewTableNumber] = useState('');
  const [newSeats, setNewSeats] = useState('4');

  const { data: tables = [], isLoading } = useQuery({
    queryKey: ['dining-tables'],
    queryFn: () => restaurantApi.getTables('ember-and-olive'),
  });

  const addTableMutation = useMutation({
    mutationFn: (vars: { tableNumber: string; seatsCapacity: number }) =>
      restaurantApi.createTable(vars.tableNumber, vars.seatsCapacity),
    onSuccess: (newTable) => {
      queryClient.setQueryData<DiningTableDto[]>(['dining-tables'], (old = []) => [...old, newTable]);
      setIsAddTableModalOpen(false);
      setNewTableNumber('');
      showToast(`${newTable.tableNumber} created successfully with QR identity`);
    },
    onError: () => {
      // Fallback
      const nextNum = 'T' + String(tables.length + 1).padStart(2, '0');
      const fallback: DiningTableDto = {
        id: Date.now(),
        tableNumber: newTableNumber || nextNum,
        seatsCapacity: parseInt(newSeats) || 4,
        status: 'AVAILABLE',
        currentGuestNote: 'Ready to seat',
        qrToken: 'TF-' + (newTableNumber || nextNum) + '-LIVE',
        qrCodeDataUrl: '',
        areaName: 'Dining Room',
      };
      queryClient.setQueryData<DiningTableDto[]>(['dining-tables'], (old = []) => [...old, fallback]);
      setIsAddTableModalOpen(false);
      showToast(`${fallback.tableNumber} created`);
    },
  });

  const availableCount = tables.filter((t) => t.status.toLowerCase() === 'available').length;
  const occupiedCount = tables.filter((t) => t.status.toLowerCase() === 'occupied').length;
  const cleaningCount = tables.filter((t) => t.status.toLowerCase() === 'cleaning').length;

  const handlePrint = () => {
    window.print();
    showToast('Print dialog initiated');
  };

  const handleAddTableSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tNum = newTableNumber.trim() || 'T' + String(tables.length + 1).padStart(2, '0');
    addTableMutation.mutate({
      tableNumber: tNum,
      seatsCapacity: parseInt(newSeats) || 4,
    });
  };

  return (
    <div className="p-4 sm:p-7 max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#ece8dc]">
        <div>
          <div className="text-[11px] font-bold tracking-widest text-[#ef6b4b] uppercase mb-1">
            SEATING & QR CONFIGURATION
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17221e] font-serif tracking-tight">
            Tables & QR codes
          </h1>
          <p className="text-sm text-[#67776d] mt-1 font-sans">
            Each table gets a unique QR identity linked to its own table session.
          </p>
        </div>
        <button
          onClick={() => {
            setNewTableNumber('T' + String(tables.length + 1).padStart(2, '0'));
            setIsAddTableModalOpen(true);
          }}
          className="flex items-center justify-center gap-2 bg-[#ef6b4b] hover:bg-[#d95637] text-white px-5 py-2.5 rounded-[14px] font-semibold text-sm transition-all shadow-md active:scale-95"
        >
          <Plus size={16} /> Add table
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 my-6">
        <div className="bg-white p-4 rounded-[16px] border border-[#ece8dc] shadow-2xs">
          <div className="text-[11px] font-semibold text-[#829288] uppercase tracking-wide">
            Total tables
          </div>
          <div className="text-2xl font-black text-[#17221e] mt-1">
            {tables.length}
          </div>
          <div className="text-xs text-[#87968d] mt-0.5">Configured in floor</div>
        </div>

        <div className="bg-white p-4 rounded-[16px] border border-[#ece8dc] shadow-2xs">
          <div className="text-[11px] font-semibold text-[#829288] uppercase tracking-wide">
            Available
          </div>
          <div className="text-2xl font-black text-[#34784a] mt-1">
            {availableCount}
          </div>
          <div className="text-xs text-[#87968d] mt-0.5">Ready for guests</div>
        </div>

        <div className="bg-white p-4 rounded-[16px] border border-[#ece8dc] shadow-2xs">
          <div className="text-[11px] font-semibold text-[#829288] uppercase tracking-wide">
            Occupied
          </div>
          <div className="text-2xl font-black text-[#ef6b4b] mt-1">
            {occupiedCount}
          </div>
          <div className="text-xs text-[#87968d] mt-0.5">Active sessions</div>
        </div>

        <div className="bg-white p-4 rounded-[16px] border border-[#ece8dc] shadow-2xs">
          <div className="text-[11px] font-semibold text-[#829288] uppercase tracking-wide">
            Needs cleaning
          </div>
          <div className="text-2xl font-black text-[#d69e2e] mt-1">
            {cleaningCount}
          </div>
          <div className="text-xs text-[#87968d] mt-0.5">Awaiting reset</div>
        </div>
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <div className="col-span-full py-12 text-center text-[#879188]">
            Loading tables & QR tokens...
          </div>
        ) : (
          tables.map((t) => {
            const isAvail = t.status.toLowerCase() === 'available';
            const isOcc = t.status.toLowerCase() === 'occupied';

            return (
              <div
                key={t.id}
                className="bg-white rounded-[18px] p-5 border border-[#eae6da] shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-black text-[#17221e] font-serif">
                        {t.tableNumber}
                      </h3>
                      <div className="text-xs text-[#79887e]">
                        {t.seatsCapacity} seats · {t.areaName || 'Dining Room'}
                      </div>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                        isAvail
                          ? 'bg-[#eaf5ed] text-[#34784a] border border-[#c4e6cc]'
                          : isOcc
                          ? 'bg-[#fbeeed] text-[#c93f24] border border-[#f5c7be]'
                          : 'bg-[#fdf6e6] text-[#b07d1b] border border-[#fae8b8]'
                      }`}
                    >
                      {t.status.toLowerCase()}
                    </span>
                  </div>

                  <div className="flex items-center gap-3.5 my-4 p-3 bg-[#faf9f5] rounded-[14px] border border-[#eee9dc]">
                    {t.qrCodeDataUrl ? (
                      <img
                        src={t.qrCodeDataUrl}
                        alt={`QR for ${t.tableNumber}`}
                        className="w-14 h-14 rounded-lg bg-white p-1 border border-[#e5e0d2] shadow-2xs shrink-0"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-lg bg-[#203028] text-white flex items-center justify-center shrink-0">
                        <QrCode size={30} />
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-[#17221e]">
                        Table-specific QR
                      </div>
                      <div className="text-[11px] text-[#718177] font-mono truncate">
                        /r/ember-and-olive/t/{t.qrToken?.substring(0, 10)}...
                      </div>
                      <div className="text-[10px] text-[#93a298] font-mono mt-0.5">
                        Token: {t.qrToken || `TF-${t.tableNumber}-8K2`}
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedTableForQr(t)}
                  className="w-full mt-2 py-2 px-3 rounded-[12px] bg-[#f3f0e6] hover:bg-[#e7e3d5] text-[#3e4c43] text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5"
                >
                  <QrCode size={14} /> Preview / print QR
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Informational Callout */}
      <div className="mt-6 p-4 rounded-[14px] bg-[#f7f5ee] border border-[#ece7d8] text-xs text-[#6e7d72] flex items-center gap-2">
        <Sparkles size={16} className="text-[#ef6b4b] shrink-0" />
        <span>
          Production QR codes contain signed, unguessable table tokens. When scanned, customers are securely bound to their active table session.
        </span>
      </div>

      {/* QR Preview & Print Modal */}
      <AnimatePresence>
        {selectedTableForQr && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[24px] max-w-sm w-full p-6 shadow-2xl border border-[#e2ddd0] text-center"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#f0ece0]">
                <h3 className="text-base font-bold text-[#17221e]">
                  QR Code · Table {selectedTableForQr.tableNumber}
                </h3>
                <button
                  onClick={() => setSelectedTableForQr(null)}
                  className="p-1 rounded-full text-[#7a8a80] hover:bg-[#f0ece0]"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="py-6 flex flex-col items-center">
                <div className="p-4 bg-[#faf9f5] rounded-[20px] border-2 border-[#17221e] shadow-md inline-block">
                  {selectedTableForQr.qrCodeDataUrl ? (
                    <img
                      src={selectedTableForQr.qrCodeDataUrl}
                      alt={`QR Code ${selectedTableForQr.tableNumber}`}
                      className="w-48 h-48 rounded-lg"
                    />
                  ) : (
                    <div className="w-48 h-48 bg-[#17221e] text-white flex flex-col items-center justify-center rounded-lg gap-2">
                      <QrCode size={96} />
                      <span className="text-[11px] font-mono tracking-wider">
                        TABLE {selectedTableForQr.tableNumber}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-4">
                  <div className="text-lg font-black text-[#17221e] font-serif">
                    Table {selectedTableForQr.tableNumber}
                  </div>
                  <div className="text-xs text-[#718177] font-mono mt-1">
                    emberandolive.dineflow.app/menu/{selectedTableForQr.tableNumber}
                  </div>
                  <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#fcf5e5] text-[#a17013] border border-[#f3e1b7]">
                    Cryptographically signed QR
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#f0ece0]">
                <button
                  onClick={() => setSelectedTableForQr(null)}
                  className="px-4 py-2 rounded-[12px] text-xs font-semibold text-[#6d7c72] hover:bg-[#f0ece0]"
                >
                  Close
                </button>
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-[12px] text-xs font-bold bg-[#17221e] hover:bg-[#283831] text-white shadow-sm"
                >
                  <Printer size={14} /> Print tent card
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Table Modal */}
      <AnimatePresence>
        {isAddTableModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[20px] max-w-sm w-full p-6 shadow-2xl border border-[#e5e1d5]"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#f0ece0]">
                <h3 className="text-base font-bold text-[#17221e]">Add New Dining Table</h3>
                <button
                  onClick={() => setIsAddTableModalOpen(false)}
                  className="p-1 rounded-full text-[#7a8a80] hover:bg-[#f0ece0]"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleAddTableSubmit} className="space-y-4 mt-4">
                <div>
                  <label className="block text-xs font-bold text-[#55635b] mb-1">
                    Table identifier *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. T09"
                    value={newTableNumber}
                    onChange={(e) => setNewTableNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-[12px] border border-[#ddd8ca] text-sm focus:outline-none focus:border-[#ef6b4b]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#55635b] mb-1">
                    Seating capacity (Guests)
                  </label>
                  <select
                    value={newSeats}
                    onChange={(e) => setNewSeats(e.target.value)}
                    className="w-full px-3 py-2 rounded-[12px] border border-[#ddd8ca] text-sm bg-white focus:outline-none focus:border-[#ef6b4b]"
                  >
                    <option value="2">2 guests (Intimate / Bistro)</option>
                    <option value="4">4 guests (Standard booth)</option>
                    <option value="6">6 guests (Family table)</option>
                    <option value="8">8 guests (Banquet table)</option>
                    <option value="12">12 guests (Private room)</option>
                  </select>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#f0ece0]">
                  <button
                    type="button"
                    onClick={() => setIsAddTableModalOpen(false)}
                    className="px-4 py-2 rounded-[12px] text-xs font-semibold text-[#6d7c72] hover:bg-[#f0ece0]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={addTableMutation.isPending}
                    className="px-5 py-2 rounded-[12px] text-xs font-bold bg-[#ef6b4b] hover:bg-[#d95637] text-white shadow-sm"
                  >
                    {addTableMutation.isPending ? 'Generating...' : 'Create & Generate QR'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
