import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { TrendingUp, TrendingDown, Clock, Utensils, Calendar } from 'lucide-react';
import { analyticsApi, AnalyticsDashboardDto } from '../api/analytics';

export const Screen20Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('today');

  const { data: analytics, isLoading } = useQuery({
    queryKey: ['analytics-dashboard', timeRange],
    queryFn: () => analyticsApi.getAnalytics('ember-and-olive', timeRange),
  });

  const hourlyData = analytics?.hourlySales?.length
    ? analytics.hourlySales
    : [
        { hourLabel: '12p', salesInThousands: 28, totalAmount: 28000 },
        { hourLabel: '1p', salesInThousands: 42, totalAmount: 42000 },
        { hourLabel: '2p', salesInThousands: 30, totalAmount: 30000 },
        { hourLabel: '3p', salesInThousands: 18, totalAmount: 18000 },
        { hourLabel: '4p', salesInThousands: 13, totalAmount: 13000 },
        { hourLabel: '5p', salesInThousands: 22, totalAmount: 22000 },
        { hourLabel: '6p', salesInThousands: 48, totalAmount: 48000 },
        { hourLabel: '7p', salesInThousands: 82, totalAmount: 82000 },
        { hourLabel: '8p', salesInThousands: 69, totalAmount: 69000 },
        { hourLabel: '9p', salesInThousands: 43, totalAmount: 43000 },
      ];

  const popularDishes = analytics?.popularDishes?.length
    ? analytics.popularDishes
    : [
        { name: 'Dum Veg Biryani', emoji: '🍛', ordersCount: 42, percentage: 88 },
        { name: 'Ghee Roast Dosa', emoji: '🥞', ordersCount: 36, percentage: 72 },
        { name: 'Smoky Paneer Tikka', emoji: '🍢', ordersCount: 29, percentage: 58 },
        { name: 'Cold Brew Float', emoji: '🥤', ordersCount: 21, percentage: 42 },
      ];

  return (
    <div className="p-4 sm:p-7 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#ece8dc]">
        <div>
          <div className="text-[11px] font-bold tracking-widest text-[#ef6b4b] uppercase mb-1">
            BUSINESS INTELLIGENCE
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17221e] font-serif tracking-tight">
            Know what moves.
          </h1>
          <p className="text-sm text-[#67776d] mt-1 font-sans">
            Operational signals to help improve service and menu performance.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Calendar size={15} className="text-[#84948a]" />
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3.5 py-1.5 rounded-[12px] bg-white border border-[#ddd8ca] text-xs font-semibold text-[#17221e] focus:outline-none focus:border-[#ef6b4b]"
          >
            <option value="today">Today</option>
            <option value="week">Last 7 days</option>
            <option value="month">This month</option>
          </select>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 my-6">
        <div className="bg-white p-4.5 rounded-[18px] border border-[#ece8dc] shadow-2xs">
          <div className="text-[11px] font-semibold text-[#829288] uppercase tracking-wide">
            Gross sales
          </div>
          <div className="text-2xl font-black text-[#17221e] mt-1">
            ₹{analytics?.grossSales ? analytics.grossSales.toLocaleString('en-IN') : '28,420'}
          </div>
          <div className="flex items-center gap-1 text-xs text-[#34784a] font-semibold mt-1">
            <TrendingUp size={13} />
            <span>12.8% vs yesterday</span>
          </div>
        </div>

        <div className="bg-white p-4.5 rounded-[18px] border border-[#ece8dc] shadow-2xs">
          <div className="text-[11px] font-semibold text-[#829288] uppercase tracking-wide">
            Avg. order value
          </div>
          <div className="text-2xl font-black text-[#17221e] mt-1">
            ₹{analytics?.avgOrderValue ? Math.round(analytics.avgOrderValue) : '486'}
          </div>
          <div className="flex items-center gap-1 text-xs text-[#34784a] font-semibold mt-1">
            <TrendingUp size={13} />
            <span>4.2% lift</span>
          </div>
        </div>

        <div className="bg-white p-4.5 rounded-[18px] border border-[#ece8dc] shadow-2xs">
          <div className="text-[11px] font-semibold text-[#829288] uppercase tracking-wide">
            Avg. prep time
          </div>
          <div className="text-2xl font-black text-[#17221e] mt-1">
            {analytics?.avgPrepTimeMinutes || 14}m
          </div>
          <div className="flex items-center gap-1 text-xs text-[#34784a] font-semibold mt-1">
            <Clock size={13} />
            <span>2 min faster</span>
          </div>
        </div>

        <div className="bg-white p-4.5 rounded-[18px] border border-[#ece8dc] shadow-2xs">
          <div className="text-[11px] font-semibold text-[#829288] uppercase tracking-wide">
            Table turn time
          </div>
          <div className="text-2xl font-black text-[#17221e] mt-1">
            {analytics?.tableTurnoverMinutes || 54}m
          </div>
          <div className="flex items-center gap-1 text-xs text-[#34784a] font-semibold mt-1">
            <Utensils size={13} />
            <span>6 min faster</span>
          </div>
        </div>
      </div>

      {/* Main Charts & Visuals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Hourly Sales Chart */}
        <div className="bg-white p-5 rounded-[18px] border border-[#eae6da] shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-black text-[#17221e] font-serif">Hourly sales</h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#f3f0e6] text-[#4d5c52]">
              ₹ thousands
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0ede4" />
                <XAxis
                  dataKey="hourLabel"
                  tick={{ fontSize: 11, fill: '#7a8980' }}
                  axisLine={{ stroke: '#e4dfd2' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#7a8980' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(val: any) => [`₹${val}k`, 'Sales']}
                  contentStyle={{
                    backgroundColor: '#17221e',
                    borderRadius: '10px',
                    color: '#fff',
                    border: 'none',
                    fontSize: '12px',
                  }}
                  itemStyle={{ color: '#ef6b4b' }}
                />
                <Bar
                  dataKey="salesInThousands"
                  fill="#ef6b4b"
                  radius={[6, 6, 0, 0]}
                  animationDuration={1000}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Popular Dishes */}
        <div className="bg-white p-5 rounded-[18px] border border-[#eae6da] shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-black text-[#17221e] font-serif">Popular dishes</h3>
            <span className="text-xs text-[#829288]">By orders volume</span>
          </div>

          <div className="space-y-4 pt-1">
            {popularDishes.map((dish) => (
              <div key={dish.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-bold text-[#17221e]">
                    <span>{dish.emoji || '🍽️'}</span>
                    <span>{dish.name}</span>
                  </div>
                  <span className="text-[#728378] font-mono">{dish.ordersCount} orders</span>
                </div>
                <div className="w-full bg-[#f3f0e6] h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#ef6b4b] h-full rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${Math.min(100, dish.percentage)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
