import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '../api/client';
import { restaurantApi } from '../api/restaurant';
import { useDineFlowStore } from '../store/useDineFlowStore';
import { Modal } from '../components/shared/Modal';

export const Screen12TableSession: React.FC = () => {
  const { activeTableNumber, setScreen, showToast } = useDineFlowStore();
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: sessionData } = useQuery<any>({
    queryKey: ['tableSession', activeTableNumber],
    queryFn: () => apiRequest<any>(`/staff/tables/4/session`),
    refetchInterval: 4000,
  });

  const closeSessionMutation = useMutation({
    mutationFn: async () => restaurantApi.closeSession(4),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staffTables'] });
      setIsCloseModalOpen(false);
      showToast(`Table ${activeTableNumber} session closed. Sent for cleaning.`);
      setScreen('floor-plan');
    },
    onError: (err: any) => {
      showToast(err.message || 'Could not close session');
    },
  });

  return (
    <div className="p-4 md:p-8 max-w-[1200px] mx-auto min-h-[760px] bg-[#fbfaf5]">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="text-[9px] tracking-[1.7px] uppercase font-extrabold text-[#879188]">
            TABLE MANAGEMENT
          </div>
          <h1 className="font-heading font-extrabold text-[26px] md:text-[34px] tracking-tight my-1 text-[#1d2925]">
            Table {activeTableNumber} session
          </h1>
          <p className="text-[12px] text-[#7c887e]">
            A table session connects every guest and order for one customer visit.
          </p>
        </div>
        <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#fbe8e1] text-[#c45137] text-[10px] font-extrabold">
          OCCUPIED
        </span>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-[#fffefa] border border-[#e5e4da] rounded-[15px] p-4 shadow-sm">
          <span className="text-[9px] text-[#879188] font-bold block">Session ID</span>
          <b className="font-heading font-extrabold text-[20px] text-[#1d2925] block my-1">
            {sessionData?.sessionCode || 'SES-2084'}
          </b>
          <span className="text-[9px] text-[#879188]">Active dining visit</span>
        </div>

        <div className="bg-[#fffefa] border border-[#e5e4da] rounded-[15px] p-4 shadow-sm">
          <span className="text-[9px] text-[#879188] font-bold block">Guests seated</span>
          <b className="font-heading font-extrabold text-[24px] text-[#1d2925] block my-1">
            {sessionData?.guestCount || 3}
          </b>
          <span className="text-[9px] text-[#879188]">Head count</span>
        </div>

        <div className="bg-[#fffefa] border border-[#e5e4da] rounded-[15px] p-4 shadow-sm">
          <span className="text-[9px] text-[#879188] font-bold block">Session duration</span>
          <b className="font-heading font-extrabold text-[24px] text-[#1d2925] block my-1">
            {sessionData?.duration || '42m'}
          </b>
          <span className="text-[9px] text-[#879188]">Opened 7:08 PM</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
        {/* Orders in this session */}
        <div className="bg-[#fffefa] border border-[#e5e4da] rounded-[17px] p-5 shadow-[0_5px_18px_rgba(35,47,39,0.025)]">
          <h3 className="font-heading font-extrabold text-[14px] mb-3">Orders in this session</h3>

          <div className="divide-y divide-[#eeeae0] text-[11px]">
            {[
              { id: 'TF-1042', amount: '₹289', status: 'Completed', cat: 'Starters' },
              { id: 'TF-1045', amount: '₹219', status: 'Served', cat: 'Mains & Coolers' },
              { id: 'TF-1048', amount: '₹606', status: 'Preparing', cat: 'Beverages & Dessert' },
            ].map((o) => (
              <div key={o.id} className="py-3 flex items-center justify-between">
                <div>
                  <b className="block font-heading font-extrabold text-[11px] text-[#1d2925]">
                    {o.id}
                  </b>
                  <span className="text-[9px] text-[#89938b]">{o.cat}</span>
                </div>
                <div className="flex items-center gap-3">
                  <b className="font-heading text-[12px]">{o.amount}</b>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-extrabold ${
                      o.status === 'Completed' || o.status === 'Served'
                        ? 'bg-[#e5efe4] text-[#4e7654]'
                        : 'bg-[#fbf1d9] text-[#98722d]'
                    }`}
                  >
                    {o.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Session Controls */}
        <div className="bg-[#fffefa] border border-[#e5e4da] rounded-[17px] p-5 shadow-[0_5px_18px_rgba(35,47,39,0.025)]">
          <h3 className="font-heading font-extrabold text-[14px] mb-3">Session controls</h3>

          <div className="space-y-2 text-[11px] text-[#748076] mb-5">
            <div className="flex justify-between">
              <span>Table state</span>
              <b className="text-[#1d2925]">Occupied</b>
            </div>
            <div className="flex justify-between">
              <span>Bill settlement</span>
              <b className="text-[#98722d]">Partially paid</b>
            </div>
            <div className="flex justify-between">
              <span>Active orders</span>
              <b className="text-[#1d2925]">1 in kitchen</b>
            </div>
          </div>

          <div className="h-[1px] bg-[#eae6da] my-4" />

          <button
            onClick={() => setScreen('bill')}
            className="w-full bg-[#f3f0e6] border border-[#e7e2d3] text-[#334139] py-2.5 rounded-[10px] text-[11px] font-extrabold hover:bg-[#e4dfd0] transition-colors mb-2.5"
          >
            Review table bill →
          </button>

          <button
            onClick={() => setIsCloseModalOpen(true)}
            className="w-full bg-[#ef6b4b] text-white py-2.5 rounded-[10px] text-[11px] font-extrabold shadow-[0_7px_16px_rgba(239,107,75,0.2)] hover:scale-101 active:scale-99 transition-transform"
          >
            Close session &amp; send for cleaning
          </button>

          <p className="text-[9px] text-[#89938b] mt-3 leading-normal">
            Closing a session requires staff confirmation that guests have departed and all dues are settled.
          </p>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal
        title={`Close Table ${activeTableNumber} session?`}
        isOpen={isCloseModalOpen}
        onClose={() => setIsCloseModalOpen(false)}
        footer={
          <>
            <button
              onClick={() => setIsCloseModalOpen(false)}
              className="px-3.5 py-1.5 rounded-[9px] border border-[#e5e4da] text-[11px] font-extrabold text-[#7b8980]"
            >
              Keep open
            </button>
            <button
              disabled={closeSessionMutation.isPending}
              onClick={() => closeSessionMutation.mutate()}
              className="px-4 py-1.5 rounded-[9px] bg-[#ef6b4b] text-white text-[11px] font-extrabold shadow"
            >
              {closeSessionMutation.isPending ? 'Closing...' : 'Confirm close'}
            </button>
          </>
        }
      >
        <p>
          Confirm that all guests at Table {activeTableNumber} have finished dining and departed.
          The table will be moved to <strong>CLEANING</strong> status and queued for runner reset.
        </p>
      </Modal>
    </div>
  );
};
