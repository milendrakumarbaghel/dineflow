import React from 'react';
import { useDineFlowStore } from '../store/useDineFlowStore';
import { GuestHeader } from '../components/layout/GuestHeader';

export const Screen3Cart: React.FC = () => {
  const { cart, updateCartQty, removeFromCart, activeTableNumber, partySize, setScreen } =
    useDineFlowStore();

  const cartTotalCount = cart.reduce((acc, x) => acc + x.qty, 0);
  const subtotal = cart.reduce((acc, x) => acc + x.price * x.qty, 0);
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + tax;

  return (
    <div className="min-h-[760px] bg-[#fbfaf5] text-[#1d2925] flex flex-col justify-between">
      <div>
        <GuestHeader />

        <div className="p-4 md:p-8 max-w-[1050px] mx-auto">
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="text-[9px] tracking-[1.7px] uppercase font-extrabold text-[#879188]">
                YOUR SELECTION
              </div>
              <h1 className="font-heading font-extrabold text-[26px] md:text-[34px] tracking-tight my-1">
                Your cart
              </h1>
              <p className="text-[12px] text-[#7c887e]">
                Everything looks good? We'll send this to the kitchen for Table {activeTableNumber}.
              </p>
            </div>
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#f0eee4] text-[#66746a] border border-[#e9e5d8] text-[10px] font-extrabold">
              {cartTotalCount} items
            </span>
          </div>

          {cart.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
              {/* Items Card */}
              <div className="bg-[#fffefa] border border-[#e5e4da] rounded-[17px] p-5 shadow-[0_5px_18px_rgba(35,47,39,0.025)]">
                <div className="flex items-center justify-between pb-3 border-b border-[#eeeae0] mb-2">
                  <h3 className="font-heading font-extrabold text-[14px]">Order items</h3>
                  <button
                    onClick={() => setScreen('guest-menu')}
                    className="text-[10px] font-extrabold text-[#ef6b4b] hover:underline"
                  >
                    ＋ Add more
                  </button>
                </div>

                <div className="divide-y divide-[#efede4]">
                  {cart.map((item) => (
                    <div key={item.menuItemId} className="py-3 flex items-center gap-3">
                      <div className="w-[50px] h-[50px] rounded-[13px] bg-[#f3ead9] grid place-items-center text-[26px] flex-none">
                        {item.emoji || '🍽️'}
                      </div>

                      <div className="flex-1 min-w-0">
                        <strong className="block font-heading font-extrabold text-[11px] truncate">
                          {item.name}
                        </strong>
                        <div className="text-[9px] text-[#89938b]">
                          ₹{item.price.toLocaleString('en-IN')} each
                          {item.spiceLevel ? ` · ${item.spiceLevel}` : ''}
                        </div>

                        <div className="flex items-center gap-2 mt-2 bg-[#fbfaf5] border border-[#ddd8ca] rounded-full w-fit px-2 py-0.5">
                          <button
                            onClick={() => updateCartQty(item.menuItemId, -1)}
                            className="text-xs font-bold w-5 h-5 flex items-center justify-center text-[#5d6b60] hover:text-[#1d2925]"
                          >
                            −
                          </button>
                          <strong className="text-[10px] font-extrabold min-w-[14px] text-center">
                            {item.qty}
                          </strong>
                          <button
                            onClick={() => updateCartQty(item.menuItemId, 1)}
                            className="text-xs font-bold w-5 h-5 flex items-center justify-center text-[#5d6b60] hover:text-[#1d2925]"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="text-right flex-none">
                        <strong className="block font-heading font-extrabold text-[12px]">
                          ₹{(item.price * item.qty).toLocaleString('en-IN')}
                        </strong>
                        <button
                          onClick={() => removeFromCart(item.menuItemId)}
                          className="text-[9px] text-[#8a938b] hover:text-[#ef6b4b] mt-1 font-semibold"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary Card */}
              <div className="bg-[#fffefa] border border-[#e5e4da] rounded-[17px] p-5 shadow-[0_5px_18px_rgba(35,47,39,0.025)]">
                <h3 className="font-heading font-extrabold text-[14px] mb-3">Order summary</h3>

                <div className="flex items-center justify-between py-2 px-3 rounded-[10px] bg-[#f5f2e9] mb-4">
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold text-[#4e7654]">
                    ● Dine-in · Table {activeTableNumber}
                  </span>
                  <span className="text-[9px] text-[#89938b] font-medium">{partySize} guests</span>
                </div>

                <div className="space-y-2 text-[11px] text-[#748076]">
                  <div className="flex justify-between">
                    <span>Item subtotal</span>
                    <b className="text-[#1d2925]">₹{subtotal.toLocaleString('en-IN')}</b>
                  </div>
                  <div className="flex justify-between">
                    <span>Restaurant charges</span>
                    <b className="text-[#1d2925]">₹0</b>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxes (5% GST)</span>
                    <b className="text-[#1d2925]">₹{tax.toLocaleString('en-IN')}</b>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-[#eae6da] font-extrabold text-[14px] text-[#1d2925]">
                    <span>Total</span>
                    <span>₹{total.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-[10px] font-extrabold text-[#5d6b60] mb-1">
                    Order note
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Anything the kitchen should know?"
                    className="w-full border border-[#deded3] bg-[#fffefa] rounded-[10px] p-2 text-[11px] text-[#1d2925] focus:outline-none focus:ring-2 focus:ring-[#ef6b4b44]"
                  />
                </div>

                <button
                  onClick={() => setScreen('checkout')}
                  className="w-full mt-5 bg-[#ef6b4b] border border-[#ef6b4b] text-white py-2.5 rounded-[10px] text-[12px] font-extrabold shadow-[0_7px_16px_rgba(239,107,75,0.2)] hover:scale-101 active:scale-99 transition-transform"
                >
                  Continue to checkout →
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-[#fffefa] border border-[#e5e4da] rounded-[20px] p-12 text-center max-w-[500px] mx-auto shadow-sm">
              <div className="text-[50px] mb-3">🧺</div>
              <h2 className="font-heading font-extrabold text-[20px] mb-2 text-[#1d2925]">
                Your cart is waiting
              </h2>
              <p className="text-[12px] text-[#7c887e] mb-5">
                Add a few favourites from the menu to get started.
              </p>
              <button
                onClick={() => setScreen('guest-menu')}
                className="bg-[#ef6b4b] text-white px-5 py-2.5 rounded-[10px] text-[11px] font-extrabold shadow-[0_7px_16px_rgba(239,107,75,0.2)] hover:scale-105 transition-transform"
              >
                Explore menu
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
