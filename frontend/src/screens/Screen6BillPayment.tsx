import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { billingApi, BillDto } from '../api/billing';
import { useDineFlowStore } from '../store/useDineFlowStore';
import { GuestHeader } from '../components/layout/GuestHeader';

export const Screen6BillPayment: React.FC = () => {
  const { activeTableNumber, partySize, showToast, triggerConfetti } = useDineFlowStore();
  const [splitCount, setSplitCount] = useState<number>(1);
  const queryClient = useQueryClient();

  const { data: bill, isLoading } = useQuery<BillDto>({
    queryKey: ['tableBill', activeTableNumber],
    queryFn: () => billingApi.getTableBill(activeTableNumber),
  });

  const payMutation = useMutation({
    mutationFn: async () => {
      if (!bill?.id) return;
      return billingApi.payBill(bill.id, {
        splitCount,
        paymentMethod: 'UPI',
        amount: shareAmount,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tableBill', activeTableNumber] });
      triggerConfetti();
      showToast('Payment successful! Thank you for dining with us.');
    },
    onError: (err: any) => {
      showToast(err.message || 'Payment failed');
    },
  });

  const totalDue = bill?.totalDue || 679;
  const shareAmount = Math.ceil(totalDue / splitCount);

  return (
    <div className="min-h-[760px] bg-[#fbfaf5] text-[#1d2925] flex flex-col justify-between">
      <div>
        <GuestHeader />

        <div className="p-4 md:p-8 max-w-[850px] mx-auto">
          <div className="text-[9px] tracking-[1.7px] uppercase font-extrabold text-[#879188]">
            TABLE {activeTableNumber} · VISIT SUMMARY
          </div>
          <h1 className="font-heading font-extrabold text-[26px] md:text-[34px] tracking-tight my-1">
            Your table bill
          </h1>
          <p className="text-[12px] text-[#7c887e] mb-6">
            All orders placed during this table session appear on one unified bill.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
            {/* Bill Statement Card */}
            <div className="bg-[#fffefa] border border-[#e5e4da] rounded-[17px] p-5 shadow-[0_5px_18px_rgba(35,47,39,0.025)]">
              <div className="flex items-center justify-between pb-2">
                <h3 className="font-heading font-extrabold text-[15px]">
                  {bill?.billNumber || 'Bill #B-2048'}
                </h3>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-extrabold ${
                    bill?.status === 'PAID'
                      ? 'bg-[#e5efe4] text-[#4e7654]'
                      : 'bg-[#fbf1d9] text-[#98722d]'
                  }`}
                >
                  {bill?.status || 'Unpaid'}
                </span>
              </div>
              <p className="text-[9px] text-[#89938b] mb-4">
                Session opened 7:08 PM · {bill?.guestCount || partySize} guests
              </p>

              <div className="divide-y divide-[#eeeae0] text-[11px]">
                {bill?.items && bill.items.length > 0 ? (
                  bill.items.map((item, idx) => (
                    <div key={idx} className="py-2.5 flex justify-between">
                      <span className="text-[#33423b]">
                        {item.quantity} × {item.itemName}
                      </span>
                      <b className="font-heading text-[#1d2925]">
                        ₹{item.totalAmount?.toLocaleString('en-IN')}
                      </b>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="py-2.5 flex justify-between">
                      <span>1 × Smoky Paneer Tikka</span>
                      <b>₹289</b>
                    </div>
                    <div className="py-2.5 flex justify-between">
                      <span>1 × Ghee Roast Dosa</span>
                      <b>₹219</b>
                    </div>
                    <div className="py-2.5 flex justify-between">
                      <span>1 × Mint Lime Cooler</span>
                      <b>₹139</b>
                    </div>
                  </>
                )}
              </div>

              <div className="h-[1px] bg-[#eae6da] my-3.5" />

              <div className="space-y-1.5 text-[11px] text-[#748076]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <b>₹{bill?.subtotal?.toLocaleString('en-IN') || '647'}</b>
                </div>
                <div className="flex justify-between">
                  <span>Taxes (5% GST)</span>
                  <b>₹{bill?.taxAmount?.toLocaleString('en-IN') || '32'}</b>
                </div>
                <div className="flex justify-between pt-2 border-t border-[#eae6da] font-extrabold text-[15px] text-[#1d2925]">
                  <span>Total due</span>
                  <span>₹{totalDue.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Payment & Split Card */}
            <div className="bg-[#fffefa] border border-[#e5e4da] rounded-[17px] p-5 shadow-[0_5px_18px_rgba(35,47,39,0.025)]">
              <h3 className="font-heading font-extrabold text-[14px] mb-1">Choose how to pay</h3>
              <p className="text-[11px] text-[#7c887e] mb-4">
                Split the bill equally or pay the full amount.
              </p>

              <div className="mb-4">
                <label className="block text-[10px] font-extrabold text-[#5d6b60] mb-1">
                  Split between
                </label>
                <select
                  value={splitCount}
                  onChange={(e) => setSplitCount(Number(e.target.value))}
                  className="w-full border border-[#deded3] bg-[#fffefa] rounded-[10px] p-2.5 text-[11px] text-[#1d2925] focus:outline-none focus:ring-2 focus:ring-[#ef6b4b44]"
                >
                  <option value={1}>Pay full bill (1 person)</option>
                  <option value={2}>Split between 2 people</option>
                  <option value={3}>Split between 3 people</option>
                  <option value={4}>Split between 4 people</option>
                </select>
              </div>

              <div className="rounded-[18px] p-5 text-white bg-gradient-to-br from-[#1c2a23] to-[#30463a] shadow-md my-4">
                <div className="text-[9px] text-[#c5d2c6] tracking-widest font-extrabold">
                  YOUR SHARE
                </div>
                <div className="font-heading font-extrabold text-[36px] tracking-tight text-[#ffc36d] my-1">
                  ₹{shareAmount.toLocaleString('en-IN')}
                </div>
                <div className="text-[10px] text-[#c5d2c6]">
                  UPI · Debit/Credit Card · Netbanking
                </div>
              </div>

              <button
                disabled={payMutation.isPending || bill?.status === 'PAID'}
                onClick={() => payMutation.mutate()}
                className="w-full bg-[#ef6b4b] border border-[#ef6b4b] text-white py-3 rounded-[10px] text-[12px] font-extrabold shadow-[0_7px_16px_rgba(239,107,75,0.2)] hover:scale-101 active:scale-99 transition-transform disabled:opacity-50"
              >
                {bill?.status === 'PAID'
                  ? 'Bill Paid ✓'
                  : payMutation.isPending
                  ? 'Processing payment...'
                  : `Pay your share · ₹${shareAmount.toLocaleString('en-IN')}`}
              </button>

              <p className="text-[9px] text-[#8a938b] text-center mt-2.5">
                Payment adapter ready. Instant digital receipt issued after settlement.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
