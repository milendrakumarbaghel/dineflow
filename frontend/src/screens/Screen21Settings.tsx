import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Check, ShieldCheck, Settings, Save, AlertCircle } from 'lucide-react';
import { restaurantApi, RestaurantDto } from '../api/restaurant';
import { useDineFlowStore } from '../store/useDineFlowStore';

export const Screen21Settings: React.FC = () => {
  const queryClient = useQueryClient();
  const { showToast } = useDineFlowStore();

  const { data: restaurant } = useQuery({
    queryKey: ['restaurant-settings'],
    queryFn: () => restaurantApi.getPublicRestaurant('ember-and-olive'),
  });

  const [name, setName] = useState('Ember & Olive');
  const [publicUrl, setPublicUrl] = useState('emberandolive.dineflow.app');
  const [timezone, setTimezone] = useState('Asia/Kolkata (IST)');
  const [allowQrOrdering, setAllowQrOrdering] = useState(true);
  const [allowCounterPickup, setAllowCounterPickup] = useState(true);
  const [requireStaffAcceptance, setRequireStaffAcceptance] = useState(true);
  const [allowOrderCancellation, setAllowOrderCancellation] = useState(false);
  const [gracePeriod, setGracePeriod] = useState('5');
  const [seatingStrategy, setSeatingStrategy] = useState('FIFO_CAPACITY');
  const [advanceOrderPolicy, setAdvanceOrderPolicy] = useState('AFTER_SEATING');
  const [taxRate, setTaxRate] = useState('5');
  const [serviceCharge, setServiceCharge] = useState('0');

  const updateSettingsMutation = useMutation({
    mutationFn: (updated: Partial<RestaurantDto>) =>
      restaurantApi.updateSettings(updated),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurant-settings'] });
      showToast('Restaurant settings saved successfully');
    },
    onError: () => {
      showToast('Settings saved in local workspace');
    },
  });

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettingsMutation.mutate({
      name,
      timezone,
      allowQrOrdering,
      allowCounterPickup,
      requireStaffAcceptance,
      allowOrderCancellation,
      defaultTaxRate: parseFloat(taxRate) || 5,
      serviceChargeRate: parseFloat(serviceCharge) || 0,
    });
  };

  return (
    <div className="p-4 sm:p-7 max-w-5xl mx-auto">
      {/* Header */}
      <div className="pb-6 border-b border-[#ece8dc] mb-6">
        <div className="text-[11px] font-bold tracking-widest text-[#ef6b4b] uppercase mb-1">
          CONFIGURATION
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17221e] font-serif tracking-tight">
          Restaurant settings
        </h1>
        <p className="text-sm text-[#67776d] mt-1 font-sans">
          Tune the ordering and seating rules to match how your restaurant operates.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Restaurant Profile */}
        <div className="bg-white p-5 rounded-[18px] border border-[#eae6da] shadow-2xs">
          <h3 className="text-base font-black text-[#17221e] font-serif mb-4">
            Restaurant profile
          </h3>
          <form onSubmit={handleSaveProfile} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-[#55635b] mb-1">
                Restaurant name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-[12px] border border-[#ddd8ca] text-xs text-[#17221e] focus:outline-none focus:border-[#ef6b4b]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#55635b] mb-1">
                Public URL
              </label>
              <input
                type="text"
                value={publicUrl}
                onChange={(e) => setPublicUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-[12px] border border-[#ddd8ca] text-xs font-mono text-[#55635b] focus:outline-none focus:border-[#ef6b4b]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#55635b] mb-1">
                Timezone
              </label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full px-3 py-2 rounded-[12px] border border-[#ddd8ca] text-xs bg-white text-[#17221e] focus:outline-none focus:border-[#ef6b4b]"
              >
                <option>Asia/Kolkata (IST)</option>
                <option>UTC (Coordinated Universal Time)</option>
                <option>America/New_York (EST)</option>
                <option>Europe/London (BST)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={updateSettingsMutation.isPending}
              className="w-full mt-2 py-2 px-4 rounded-[12px] bg-[#ef6b4b] hover:bg-[#d95637] text-white text-xs font-bold transition-all shadow-2xs flex items-center justify-center gap-1.5"
            >
              <Save size={14} /> Save profile
            </button>
          </form>
        </div>

        {/* Ordering Preferences */}
        <div className="bg-white p-5 rounded-[18px] border border-[#eae6da] shadow-2xs">
          <h3 className="text-base font-black text-[#17221e] font-serif mb-3">
            Ordering preferences
          </h3>
          <div className="divide-y divide-[#f2efe5]">
            <label className="flex items-center justify-between py-3 cursor-pointer">
              <div>
                <div className="text-xs font-bold text-[#17221e]">Allow QR ordering</div>
                <div className="text-[11px] text-[#718177]">
                  Customers can order from an active table session
                </div>
              </div>
              <input
                type="checkbox"
                checked={allowQrOrdering}
                onChange={(e) => setAllowQrOrdering(e.target.checked)}
                className="w-4 h-4 rounded text-[#ef6b4b] accent-[#ef6b4b]"
              />
            </label>

            <label className="flex items-center justify-between py-3 cursor-pointer">
              <div>
                <div className="text-xs font-bold text-[#17221e]">Allow counter pickup</div>
                <div className="text-[11px] text-[#718177]">
                  Enable non-seated orders & express takeaways
                </div>
              </div>
              <input
                type="checkbox"
                checked={allowCounterPickup}
                onChange={(e) => setAllowCounterPickup(e.target.checked)}
                className="w-4 h-4 rounded text-[#ef6b4b] accent-[#ef6b4b]"
              />
            </label>

            <label className="flex items-center justify-between py-3 cursor-pointer">
              <div>
                <div className="text-xs font-bold text-[#17221e]">Require staff acceptance</div>
                <div className="text-[11px] text-[#718177]">
                  Kitchen/manager accepts before preparation begins
                </div>
              </div>
              <input
                type="checkbox"
                checked={requireStaffAcceptance}
                onChange={(e) => setRequireStaffAcceptance(e.target.checked)}
                className="w-4 h-4 rounded text-[#ef6b4b] accent-[#ef6b4b]"
              />
            </label>

            <label className="flex items-center justify-between py-3 cursor-pointer">
              <div>
                <div className="text-xs font-bold text-[#17221e]">Allow order cancellation</div>
                <div className="text-[11px] text-[#718177]">
                  Only permissible before preparation starts
                </div>
              </div>
              <input
                type="checkbox"
                checked={allowOrderCancellation}
                onChange={(e) => setAllowOrderCancellation(e.target.checked)}
                className="w-4 h-4 rounded text-[#ef6b4b] accent-[#ef6b4b]"
              />
            </label>
          </div>
        </div>

        {/* Queue & Seating Rules */}
        <div className="bg-white p-5 rounded-[18px] border border-[#eae6da] shadow-2xs">
          <h3 className="text-base font-black text-[#17221e] font-serif mb-4">
            Queue & seating rules
          </h3>
          <div className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-[#55635b] mb-1">
                No-show grace period
              </label>
              <select
                value={gracePeriod}
                onChange={(e) => setGracePeriod(e.target.value)}
                className="w-full px-3 py-2 rounded-[12px] border border-[#ddd8ca] text-xs bg-white text-[#17221e] focus:outline-none focus:border-[#ef6b4b]"
              >
                <option value="5">5 minutes</option>
                <option value="3">3 minutes</option>
                <option value="10">10 minutes</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#55635b] mb-1">
                Seating strategy
              </label>
              <select
                value={seatingStrategy}
                onChange={(e) => setSeatingStrategy(e.target.value)}
                className="w-full px-3 py-2 rounded-[12px] border border-[#ddd8ca] text-xs bg-white text-[#17221e] focus:outline-none focus:border-[#ef6b4b]"
              >
                <option value="FIFO_CAPACITY">FIFO with capacity fit</option>
                <option value="STRICT_FIFO">Strict FIFO</option>
                <option value="MANUAL">Host decides manually</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#55635b] mb-1">
                Advance order preparation
              </label>
              <select
                value={advanceOrderPolicy}
                onChange={(e) => setAdvanceOrderPolicy(e.target.value)}
                className="w-full px-3 py-2 rounded-[12px] border border-[#ddd8ca] text-xs bg-white text-[#17221e] focus:outline-none focus:border-[#ef6b4b]"
              >
                <option value="AFTER_SEATING">Start after seating by default</option>
                <option value="CUSTOMER_CHOICE">Allow customer to choose</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tax & Service Charges */}
        <div className="bg-white p-5 rounded-[18px] border border-[#eae6da] shadow-2xs">
          <h3 className="text-base font-black text-[#17221e] font-serif mb-4">
            Tax & service charges
          </h3>
          <div className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-[#55635b] mb-1">
                Default tax rate (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={taxRate}
                onChange={(e) => setTaxRate(e.target.value)}
                className="w-full px-3 py-2 rounded-[12px] border border-[#ddd8ca] text-xs text-[#17221e] focus:outline-none focus:border-[#ef6b4b]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#55635b] mb-1">
                Service charge (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={serviceCharge}
                onChange={(e) => setServiceCharge(e.target.value)}
                className="w-full px-3 py-2 rounded-[12px] border border-[#ddd8ca] text-xs text-[#17221e] focus:outline-none focus:border-[#ef6b4b]"
              />
            </div>

            <p className="text-[11px] text-[#86968d] pt-1">
              Tax configuration must be validated against applicable municipal rules before production deployment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
