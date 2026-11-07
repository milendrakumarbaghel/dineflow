import React, { useState } from 'react';
import { ordersApi } from '../api/orders';
import { useDineFlowStore } from '../store/useDineFlowStore';
import { GuestHeader } from '../components/layout/GuestHeader';

export const Screen4Checkout: React.FC = () => {
  const {
    cart,
    activeTableNumber,
    partySize,
    clearCart,
    setActiveOrderNumber,
    setScreen,
    showToast,
    triggerConfetti,
  } = useDineFlowStore();

  const [guestName, setGuestName] = useState<string>('Aarav Sharma');
  const [guestPhone, setGuestPhone] = useState<string>('+91 98765 43210');
  const [paymentMode, setPaymentMode] = useState<string>('UPI');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const subtotal = cart.reduce((acc, x) => acc + x.price * x.qty, 0);
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + tax;

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      showToast('Your cart is empty');
      return;
    }

    setIsSubmitting(true);
    try {
      const order = await ordersApi.placeOrder({
        restaurantSlug: 'ember-and-olive',
        destination: activeTableNumber,
        orderType: 'DINE_IN',
        customerName: guestName,
        customerPhone: guestPhone,
        paymentMode,
        items: cart.map((i) => ({
          menuItemId: i.menuItemId,
          quantity: i.qty,
          spiceLevel: i.spiceLevel,
          instructions: i.instructions,
        })),
      });

      setActiveOrderNumber(order.orderNumber);
      clearCart();
      triggerConfetti();
      showToast('Order placed successfully! Sent to kitchen.');
      setScreen('order-tracking');
    } catch (err: any) {
      showToast(err.message || 'Failed to place order');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[760px] bg-[#fbfaf5] text-[#1d2925] flex flex-col justify-between">
      <div>
        <GuestHeader />

        <div className="p-4 md:p-8 max-w-[950px] mx-auto">
          <button
            onClick={() => setScreen('cart')}
            className="text-[11px] font-extrabold text-[#7b8980] hover:text-[#1d2925] flex items-center gap-1 mb-3"
          >
            ← Back to cart
          </button>

          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="text-[9px] tracking-[1.7px] uppercase font-extrabold text-[#879188]">
                ALMOST THERE
              </div>
              <h1 className="font-heading font-extrabold text-[26px] md:text-[34px] tracking-tight my-1">
                Confirm your order
              </h1>
              <p className="text-[12px] text-[#7c887e]">
                Review how you'd like to pay. Your order goes to the kitchen after confirmation.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e5efe4] text-[#4e7654] border border-[#d6e5d4] text-[10px] font-extrabold">
              ● Table {activeTableNumber} active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
            {/* Destination & Preferences */}
            <div className="bg-[#fffefa] border border-[#e5e4da] rounded-[17px] p-5 shadow-[0_5px_18px_rgba(35,47,39,0.025)]">
              <h3 className="font-heading font-extrabold text-[14px] mb-3">Order destination</h3>

              <div className="flex items-center gap-3 p-3 rounded-[12px] bg-[#f5f2e9] mb-4">
                <span className="text-[26px]">🪑</span>
                <div>
                  <strong className="block font-heading font-extrabold text-[12px]">
                    Table {activeTableNumber}
                  </strong>
                  <div className="text-[9px] text-[#89938b]">Dine-in · {partySize} guests</div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] font-extrabold text-[#5d6b60] mb-1">
                    Who is placing this order?
                  </label>
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full border border-[#deded3] bg-[#fffefa] rounded-[10px] p-2.5 text-[11px] text-[#1d2925] focus:outline-none focus:ring-2 focus:ring-[#ef6b4b44]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold text-[#5d6b60] mb-1">
                    Mobile number (optional)
                  </label>
                  <input
                    type="text"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    className="w-full border border-[#deded3] bg-[#fffefa] rounded-[10px] p-2.5 text-[11px] text-[#1d2925] focus:outline-none focus:ring-2 focus:ring-[#ef6b4b44]"
                  />
                </div>
              </div>

              <div className="h-[1px] bg-[#ece9df] my-4" />

              <h3 className="font-heading font-extrabold text-[14px] mb-2.5">
                Payment preference
              </h3>

              <div className="space-y-2">
                {[
                  { id: 'UPI', label: 'UPI / Digital Payment' },
                  { id: 'Pay at table', label: 'Pay at table (card or cash)' },
                  { id: 'Cash at counter', label: 'Cash at counter' },
                ].map((mode) => (
                  <label
                    key={mode.id}
                    onClick={() => setPaymentMode(mode.id)}
                    className={`flex items-center gap-3 p-3 rounded-[12px] border cursor-pointer transition-all ${
                      paymentMode === mode.id
                        ? 'bg-[#fae4dc] border-[#ef6b4b] text-[#1d2925]'
                        : 'bg-[#fffefa] border-[#e5e4da] text-[#748076] hover:bg-[#fbfaf5]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymode"
                      checked={paymentMode === mode.id}
                      onChange={() => setPaymentMode(mode.id)}
                      className="accent-[#ef6b4b]"
                    />
                    <span className="text-[11px] font-extrabold">{mode.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Summary & Place */}
            <div className="bg-[#fffefa] border border-[#e5e4da] rounded-[17px] p-5 shadow-[0_5px_18px_rgba(35,47,39,0.025)]">
              <h3 className="font-heading font-extrabold text-[14px] mb-3">Order summary</h3>

              <div className="divide-y divide-[#efede4] mb-3">
                {cart.map((item) => (
                  <div key={item.menuItemId} className="py-2 flex justify-between text-[11px]">
                    <span className="text-[#33423b]">
                      {item.qty} × {item.name}
                    </span>
                    <b className="font-heading text-[#1d2925]">
                      ₹{(item.price * item.qty).toLocaleString('en-IN')}
                    </b>
                  </div>
                ))}
              </div>

              <div className="h-[1px] bg-[#eae6da] my-3" />

              <div className="space-y-1.5 text-[11px] text-[#748076]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <b>₹{subtotal.toLocaleString('en-IN')}</b>
                </div>
                <div className="flex justify-between">
                  <span>Tax estimate (5%)</span>
                  <b>₹{tax.toLocaleString('en-IN')}</b>
                </div>
                <div className="flex justify-between pt-2 border-t border-[#eae6da] font-extrabold text-[15px] text-[#1d2925]">
                  <span>Payable</span>
                  <span>₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="bg-[#f5f0e3] border-l-4 border-[#e8b64d] p-3 rounded-r-[8px] my-4 text-[10px] text-[#7d765f] leading-relaxed">
                Orders are sent directly to the kitchen display. You can track real-time progress right on your phone.
              </div>

              <button
                disabled={isSubmitting || cart.length === 0}
                onClick={handlePlaceOrder}
                className="w-full bg-[#ef6b4b] border border-[#ef6b4b] text-white py-3 rounded-[10px] text-[12px] font-extrabold shadow-[0_7px_16px_rgba(239,107,75,0.2)] hover:scale-101 active:scale-99 transition-transform disabled:opacity-50"
              >
                {isSubmitting ? 'Placing order...' : `Place order · ₹${total.toLocaleString('en-IN')}`}
              </button>

              <p className="text-[9px] text-[#8a938b] text-center mt-2.5">
                By placing the order, you agree to the restaurant's ordering and cancellation policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
