import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { analyticsApi, AnalyticsDashboardDto } from '../api/analytics';
import { ordersApi, OrderResponseDto } from '../api/orders';
import { useDineFlowStore } from '../store/useDineFlowStore';
import { FloorScene3D } from '../components/shared/FloorScene3D';

export const Screen15OwnerOverview: React.FC = () => {
  const { setScreen } = useDineFlowStore();

  const { data: analytics } = useQuery<AnalyticsDashboardDto>({
    queryKey: ['ownerAnalytics'],
    queryFn: () => analyticsApi.getAnalytics('ember-and-olive', 'today'),
    refetchInterval: 5000,
  });

  const { data: orders = [] } = useQuery<OrderResponseDto[]>({
    queryKey: ['allOrders'],
    queryFn: () => ordersApi.getAllOrders('ember-and-olive'),
    refetchInterval: 5000,
  });

  const placedCount = orders.filter((o) => o.status === 'PLACED').length;
  const prepCount = orders.filter((o) => o.status === 'PREPARING' || o.status === 'ACCEPTED').length;
  const readyCount = orders.filter((o) => o.status === 'READY').length;

  return (
    <div className="p-4 md:p-8 max-w-[1400px] mx-auto min-h-[760px] bg-[#fbfaf5]">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="text-[9px] tracking-[1.7px] uppercase font-extrabold text-[#879188]">
            OWNER WORKSPACE · LIVE OPERATIONS
          </div>
          <h1 className="font-heading font-extrabold text-[26px] md:text-[34px] tracking-tight my-1 text-[#1d2925]">
            The evening is looking good.
          </h1>
          <p className="text-[12px] text-[#7c887e]">
            Here's what's happening across Ember &amp; Olive right now.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e5efe4] text-[#4e7654] border border-[#d6e5d4] text-[10px] font-extrabold">
          ● All systems operational
        </span>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mb-6">
        <div className="bg-[#fffefa] border border-[#e5e4da] rounded-[15px] p-4 shadow-sm">
          <span className="text-[9px] text-[#879188] font-bold block">Today's revenue</span>
          <b className="font-heading font-extrabold text-[25px] text-[#1d2925] block my-1">
            ₹28.4k
          </b>
          <span className="text-[9px] text-[#5b8a61] font-bold">↑ 12.8% vs yesterday</span>
        </div>

        <div className="bg-[#fffefa] border border-[#e5e4da] rounded-[15px] p-4 shadow-sm">
          <span className="text-[9px] text-[#879188] font-bold block">Orders today</span>
          <b className="font-heading font-extrabold text-[25px] text-[#1d2925] block my-1">
            {analytics?.totalOrders || orders.length + 42}
          </b>
          <span className="text-[9px] text-[#879188]">Across dine-in &amp; pickup</span>
        </div>

        <div className="bg-[#fffefa] border border-[#e5e4da] rounded-[15px] p-4 shadow-sm">
          <span className="text-[9px] text-[#879188] font-bold block">Table occupancy</span>
          <b className="font-heading font-extrabold text-[25px] text-[#1d2925] block my-1">
            {analytics?.occupancyPercentage || 63}%
          </b>
          <span className="text-[9px] text-[#879188]">5 of 8 tables occupied</span>
        </div>

        <div className="bg-[#fffefa] border border-[#e5e4da] rounded-[15px] p-4 shadow-sm">
          <span className="text-[9px] text-[#879188] font-bold block">Queue wait</span>
          <b className="font-heading font-extrabold text-[25px] text-[#1d2925] block my-1">
            16m
          </b>
          <span className="text-[9px] text-[#879188]">4 parties waiting</span>
        </div>
      </div>

      {/* Main 2-column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
        {/* Restaurant at a glance */}
        <div className="bg-[#fffefa] border border-[#e5e4da] rounded-[17px] p-5 shadow-[0_5px_18px_rgba(35,47,39,0.025)]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-heading font-extrabold text-[14px]">Restaurant at a glance</h3>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#f0eee4] text-[#66746a] text-[9px] font-extrabold">
              3D floor view
            </span>
          </div>

          <FloorScene3D onTableClick={() => setScreen('floor-plan')} />

          <button
            onClick={() => setScreen('floor-plan')}
            className="w-full mt-3.5 bg-[#17221e] text-white py-2.5 rounded-[10px] text-[11px] font-extrabold hover:bg-[#27362f] transition-colors"
          >
            Manage floor plan →
          </button>
        </div>

        {/* Order pulse */}
        <div className="bg-[#fffefa] border border-[#e5e4da] rounded-[17px] p-5 shadow-[0_5px_18px_rgba(35,47,39,0.025)]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-heading font-extrabold text-[14px]">Order pulse</h3>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#fae4dc] text-[#c45137] text-[9px] font-extrabold">
              Live sample
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 my-3">
            <div className="bg-[#fbfaf5] border border-[#e5e4da] rounded-[12px] p-3 text-center">
              <span className="text-[9px] text-[#879188] font-bold">New</span>
              <b className="font-heading font-extrabold text-[22px] block text-[#1d2925]">
                {placedCount}
              </b>
            </div>
            <div className="bg-[#fbfaf5] border border-[#e5e4da] rounded-[12px] p-3 text-center">
              <span className="text-[9px] text-[#879188] font-bold">Preparing</span>
              <b className="font-heading font-extrabold text-[22px] block text-[#ef6b4b]">
                {prepCount}
              </b>
            </div>
            <div className="bg-[#fbfaf5] border border-[#e5e4da] rounded-[12px] p-3 text-center">
              <span className="text-[9px] text-[#879188] font-bold">Ready</span>
              <b className="font-heading font-extrabold text-[22px] block text-[#4e7654]">
                {readyCount}
              </b>
            </div>
            <div className="bg-[#fbfaf5] border border-[#e5e4da] rounded-[12px] p-3 text-center">
              <span className="text-[9px] text-[#879188] font-bold">Served today</span>
              <b className="font-heading font-extrabold text-[22px] block text-[#1d2925]">
                38
              </b>
            </div>
          </div>

          <div className="h-[1px] bg-[#eae6da] my-4" />

          <button
            onClick={() => setScreen('kitchen')}
            className="w-full bg-[#ef6b4b] text-white py-2.5 rounded-[10px] text-[11px] font-extrabold shadow-[0_7px_16px_rgba(239,107,75,0.2)] hover:scale-101 active:scale-99 transition-transform"
          >
            Open kitchen display →
          </button>
        </div>
      </div>

      {/* 3 Quick Cards at the bottom */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
        <div className="bg-[#fffefa] border border-[#e5e4da] rounded-[17px] p-4 shadow-sm">
          <div className="text-[9px] uppercase tracking-wider font-extrabold text-[#879188]">
            TOP PERFORMER
          </div>
          <div className="flex items-center gap-3 my-2">
            <span className="text-[30px]">🍛</span>
            <div>
              <b className="font-heading font-extrabold text-[12px] text-[#1d2925]">
                Dum Veg Biryani
              </b>
              <div className="text-[9px] text-[#89938b]">42 orders sold today</div>
            </div>
          </div>
        </div>

        <div className="bg-[#fffefa] border border-[#e5e4da] rounded-[17px] p-4 shadow-sm">
          <div className="text-[9px] uppercase tracking-wider font-extrabold text-[#879188]">
            SERVICE ALERT
          </div>
          <h3 className="font-heading font-extrabold text-[14px] text-[#1d2925] my-1">
            2 tables need cleaning
          </h3>
          <p className="text-[10px] text-[#89938b]">Assign a runner to reset seats for next guests.</p>
        </div>

        <div className="bg-[#fffefa] border border-[#e5e4da] rounded-[17px] p-4 shadow-sm flex flex-col justify-between">
          <div>
            <div className="text-[9px] uppercase tracking-wider font-extrabold text-[#879188]">
              QUICK ACTION
            </div>
            <h3 className="font-heading font-extrabold text-[14px] text-[#1d2925] my-1">
              Update tonight's menu
            </h3>
          </div>
          <button
            onClick={() => setScreen('menu-studio')}
            className="w-fit bg-[#f3f0e6] border border-[#e7e2d3] text-[#334139] px-3 py-1.5 rounded-[8px] text-[10px] font-extrabold hover:bg-[#e4dfd0] transition-colors"
          >
            Open menu studio →
          </button>
        </div>
      </div>
    </div>
  );
};
