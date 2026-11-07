import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { menuApi } from '../api/menu';
import { useDineFlowStore } from '../store/useDineFlowStore';
import { GuestHeader } from '../components/layout/GuestHeader';

export const Screen2DishDetails: React.FC = () => {
  const { selectedItemId, setScreen, addToCart } = useDineFlowStore();
  const [qty, setQty] = useState<number>(1);
  const [spiceLevel, setSpiceLevel] = useState<string>('Mild');
  const [extraDip, setExtraDip] = useState<boolean>(false);
  const [extraPortion, setExtraPortion] = useState<boolean>(false);
  const [instructions, setInstructions] = useState<string>('');

  const { data: menuItems = [] } = useQuery({
    queryKey: ['menuItems'],
    queryFn: () => menuApi.getPublicMenu('ember-and-olive'),
  });

  const dish = menuItems.find((x) => x.id === selectedItemId) || menuItems[0] || {
    id: 1,
    name: 'Smoky Paneer Tikka',
    description: 'Charred cottage cheese · mint yoghurt · pickled onion',
    price: 289,
    category: 'Starters',
    emoji: '🍢',
    tag: 'Chef favourite',
    available: true,
  };

  const extraCost = (extraDip ? 25 : 0) + (extraPortion ? 45 : 0);
  const unitPrice = Number(dish.price) + extraCost;
  const totalPrice = unitPrice * qty;

  const handleAddToCart = () => {
    let customNote = instructions ? instructions : '';
    if (extraDip) customNote += (customNote ? ', ' : '') + 'Extra dip';
    if (extraPortion) customNote += (customNote ? ', ' : '') + 'Extra portion';

    addToCart({
      menuItemId: dish.id,
      name: dish.name,
      price: unitPrice,
      emoji: dish.emoji,
      qty,
      spiceLevel,
      instructions: customNote,
    });
    setScreen('guest-menu');
  };

  return (
    <div className="min-h-[760px] bg-[#fbfaf5] text-[#1d2925] flex flex-col justify-between">
      <div>
        <GuestHeader />

        <div className="p-4 md:p-8 max-w-[1000px] mx-auto">
          <button
            onClick={() => setScreen('guest-menu')}
            className="text-[11px] font-extrabold text-[#7b8980] hover:text-[#1d2925] flex items-center gap-1 mb-4"
          >
            ← Back to menu
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-7 items-start">
            {/* Dish Art */}
            <div
              className="min-h-[220px] md:min-h-[340px] rounded-[22px] grid place-items-center relative overflow-hidden"
              style={{
                background: 'radial-gradient(circle at 50% 60%, #f6d8b8, #efe6d3 55%, #e8e3d6)',
              }}
            >
              <span className="text-[100px] md:text-[130px] animate-dish-hover drop-shadow-[0_15px_12px_#6b4d2c33]">
                {dish.emoji || '🍽️'}
              </span>

              <span className="absolute top-4 left-4 bg-[#fbf1d9] text-[#98722d] border border-[#f1e2bb] rounded-full px-3 py-1 text-[10px] font-extrabold">
                {dish.tag || 'Kitchen pick'}
              </span>
            </div>

            {/* Dish Controls */}
            <div>
              <div className="text-[9px] tracking-[1.7px] uppercase font-extrabold text-[#879188]">
                {dish.category} · CHEF'S SELECTION
              </div>
              <h1 className="font-heading font-extrabold text-[26px] md:text-[32px] tracking-tight text-[#1d2925] mt-1 mb-2">
                {dish.name}
              </h1>
              <p className="text-[12px] text-[#7c887e] leading-relaxed">
                {dish.description}. Prepared fresh after your order is accepted by the kitchen.
              </p>

              <div className="flex items-center gap-3 my-4">
                <strong className="font-heading font-extrabold text-[24px]">
                  ₹{Number(dish.price).toLocaleString('en-IN')}
                </strong>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#e5efe4] text-[#4e7654] border border-[#d6e5d4] text-[9px] font-extrabold">
                  Available
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#f0eee4] text-[#66746a] border border-[#e9e5d8] text-[9px] font-extrabold">
                  🌶 {spiceLevel}
                </span>
              </div>

              <div className="h-[1px] bg-[#ece9df] my-4" />

              {/* Spice Level */}
              <div>
                <label className="block text-[10px] font-extrabold text-[#5d6b60] mb-2">
                  Choose spice level
                </label>
                <div className="flex items-center gap-2">
                  {['Mild', 'Medium', 'Hot'].map((lvl) => (
                    <label
                      key={lvl}
                      onClick={() => setSpiceLevel(lvl)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-extrabold cursor-pointer border transition-colors ${
                        spiceLevel === lvl
                          ? 'bg-[#17221e] border-[#17221e] text-white'
                          : 'bg-[#f0eee4] border-[#e9e5d8] text-[#66746a] hover:bg-[#e4e0d4]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="spice"
                        checked={spiceLevel === lvl}
                        onChange={() => setSpiceLevel(lvl)}
                        className="hidden"
                      />
                      {lvl}
                    </label>
                  ))}
                </div>
              </div>

              {/* Add-ons */}
              <div className="mt-4">
                <label className="block text-[10px] font-extrabold text-[#5d6b60] mb-2">
                  Add extras
                </label>
                <div className="flex items-center gap-2 flex-wrap">
                  <label
                    onClick={() => setExtraDip(!extraDip)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-extrabold cursor-pointer border transition-colors ${
                      extraDip
                        ? 'bg-[#ef6b4b] border-[#ef6b4b] text-white'
                        : 'bg-[#f0eee4] border-[#e9e5d8] text-[#66746a] hover:bg-[#e4e0d4]'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={extraDip}
                      onChange={(e) => setExtraDip(e.target.checked)}
                      className="hidden"
                    />
                    Extra dip +₹25
                  </label>

                  <label
                    onClick={() => setExtraPortion(!extraPortion)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-extrabold cursor-pointer border transition-colors ${
                      extraPortion
                        ? 'bg-[#ef6b4b] border-[#ef6b4b] text-white'
                        : 'bg-[#f0eee4] border-[#e9e5d8] text-[#66746a] hover:bg-[#e4e0d4]'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={extraPortion}
                      onChange={(e) => setExtraPortion(e.target.checked)}
                      className="hidden"
                    />
                    Extra portion +₹45
                  </label>
                </div>
              </div>

              {/* Special Instructions */}
              <div className="mt-4">
                <label className="block text-[10px] font-extrabold text-[#5d6b60] mb-1.5">
                  Special cooking instructions
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Less spicy, dressing on the side..."
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  className="w-full border border-[#deded3] bg-[#fffefa] rounded-[10px] p-2.5 text-[11px] text-[#1d2925] focus:outline-none focus:ring-2 focus:ring-[#ef6b4b44]"
                />
              </div>

              {/* Quantity and Submit */}
              <div className="flex items-center justify-between gap-4 mt-6 pt-4 border-t border-[#ece9df]">
                <div className="flex items-center gap-2.5 bg-[#fffefa] border border-[#ddd8ca] rounded-full px-2 py-1">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="w-7 h-7 rounded-full bg-[#f3f0e6] hover:bg-[#e4dfd0] font-bold text-sm flex items-center justify-center text-[#1d2925]"
                  >
                    −
                  </button>
                  <strong className="min-w-[20px] text-center font-heading font-extrabold text-[12px]">
                    {qty}
                  </strong>
                  <button
                    onClick={() => setQty(qty + 1)}
                    className="w-7 h-7 rounded-full bg-[#f3f0e6] hover:bg-[#e4dfd0] font-bold text-sm flex items-center justify-center text-[#1d2925]"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-[#ef6b4b] border border-[#ef6b4b] text-white py-2.5 px-4 rounded-[10px] text-[12px] font-extrabold shadow-[0_7px_16px_rgba(239,107,75,0.2)] hover:scale-102 active:scale-98 transition-transform"
                >
                  Add to cart · ₹{totalPrice.toLocaleString('en-IN')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
