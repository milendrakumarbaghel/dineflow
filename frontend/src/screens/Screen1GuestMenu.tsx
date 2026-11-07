import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { menuApi, MenuItemDto } from '../api/menu';
import { useDineFlowStore } from '../store/useDineFlowStore';
import { GuestHeader } from '../components/layout/GuestHeader';
import { HeroPlate } from '../components/shared/HeroPlate';
import { FoodCard } from '../components/shared/FoodCard';

export const Screen1GuestMenu: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const { cart, activeTableNumber, setScreen } = useDineFlowStore();

  const { data: menuItems = [], isLoading } = useQuery({
    queryKey: ['menuItems'],
    queryFn: () => menuApi.getPublicMenu('ember-and-olive'),
  });

  const categories = ['All', 'Starters', 'Mains', 'Healthy', 'Drinks', 'Desserts'];

  const filteredItems = menuItems.filter((item) => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const cartTotalCount = cart.reduce((acc, x) => acc + x.qty, 0);
  const cartTotalPrice = cart.reduce((acc, x) => acc + x.price * x.qty, 0);

  return (
    <div className="min-h-[760px] bg-[#fbfaf5] text-[#1d2925] flex flex-col justify-between">
      <div>
        <GuestHeader />

        {/* Hero Section */}
        <section
          className="grid grid-cols-1 md:grid-cols-[1.05fr_0.95fr] items-center gap-5 px-6 md:px-8 py-6 md:py-7 border-b border-[#eae7dd]"
          style={{
            background:
              'radial-gradient(circle at 85% 30%, #f7e7cb 0, transparent 38%), linear-gradient(115deg, #f8f4e8, #fffefa)',
          }}
        >
          <div className="relative z-2">
            <div className="text-[9px] tracking-[1.7px] uppercase font-extrabold text-[#879188]">
              A GOOD MEAL, A BETTER MOMENT
            </div>
            <h1 className="font-heading font-extrabold text-[28px] md:text-[36px] leading-[1.1] tracking-tight my-2">
              Made fresh.
              <br />
              <span className="text-[#ef6b4b]">Served with care.</span>
            </h1>
            <p className="text-[12px] text-[#7c887e] leading-relaxed max-w-[400px]">
              Explore our kitchen's favourites, make it yours, and we'll bring it right to your table.
            </p>

            <div className="flex items-center gap-2 flex-wrap mt-3.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#e5efe4] text-[#4e7654] border border-[#d6e5d4] text-[9px] font-extrabold">
                ● Open now
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#f0eee4] text-[#66746a] border border-[#e9e5d8] text-[9px] font-extrabold">
                Table {activeTableNumber} · 3 guests
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#fbf1d9] text-[#98722d] border border-[#f1e2bb] text-[9px] font-extrabold">
                Average prep 18 min
              </span>
            </div>
          </div>

          <HeroPlate />
        </section>

        {/* Menu Section */}
        <section className="p-4 md:p-7">
          <div className="flex items-center justify-between mb-3.5">
            <div>
              <div className="text-[9px] tracking-[1.7px] uppercase font-extrabold text-[#879188]">
                THE MENU
              </div>
              <h2 className="font-heading font-extrabold text-[21px] tracking-tight text-[#1d2925]">
                Find your flavour
              </h2>
            </div>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#f0eee4] text-[#66746a] border border-[#e9e5d8] text-[9px] font-extrabold">
              {menuItems.length} dishes · Live catalog
            </span>
          </div>

          {/* Filters & Search */}
          <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedCategory(c)}
                  className={`border rounded-full px-3.5 py-1.5 text-[10px] font-extrabold whitespace-nowrap transition-colors ${
                    selectedCategory === c
                      ? 'bg-[#17221e] border-[#17221e] text-white'
                      : 'bg-[#fffefa] border-[#e4e0d4] text-[#758076] hover:bg-[#f3f0e6]'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-[220px]">
              <input
                type="text"
                placeholder="⌕ Search dishes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border border-[#deded3] bg-[#fffefa] rounded-[10px] px-3 py-2 text-[11px] text-[#1d2925] focus:outline-none focus:ring-2 focus:ring-[#ef6b4b44]"
              />
            </div>
          </div>

          {/* Menu Grid */}
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="h-44 bg-[#f0efe8] rounded-[17px] animate-pulse" />
              ))}
            </div>
          ) : filteredItems.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {filteredItems.map((item) => (
                <FoodCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="bg-[#fffefa] border border-[#e5e4da] rounded-[17px] p-8 text-center text-[#879188] text-[12px]">
              No dishes match your selection. Try clearing the search.
            </div>
          )}
        </section>
      </div>

      {/* Sticky Cart Summary */}
      {cartTotalCount > 0 && (
        <div className="sticky bottom-2.5 z-10 mx-auto mb-3 w-[min(92%,520px)] bg-[#17221e] text-white rounded-[15px] p-3.5 flex items-center justify-between shadow-[0_14px_35px_rgba(20,35,29,0.25)] animate-cart-pulse">
          <div>
            <strong className="font-heading font-extrabold text-[12px]">
              {cartTotalCount} {cartTotalCount === 1 ? 'item' : 'items'}
            </strong>
            <div className="text-[9px] text-[#c2cec4] mt-0.5">
              Your table · {activeTableNumber}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <strong className="font-heading font-extrabold text-[14px]">
              ₹{cartTotalPrice.toLocaleString('en-IN')}
            </strong>
            <button
              onClick={() => setScreen('cart')}
              className="bg-[#ef6b4b] border border-[#ef6b4b] text-white px-3.5 py-2 rounded-[10px] text-[11px] font-extrabold shadow-[0_7px_16px_rgba(239,107,75,0.2)] hover:scale-105 active:scale-95 transition-transform"
            >
              View cart →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
