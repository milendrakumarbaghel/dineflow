import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { menuApi } from '../api/menu';
import { queueApi } from '../api/queue';
import { useDineFlowStore } from '../store/useDineFlowStore';

export const Screen9AdvanceOrder: React.FC = () => {
  const {
    queueToken,
    queueCart,
    addToQueueCart,
    updateQueueCartQty,
    queueMode,
    setQueueMode,
    setScreen,
    showToast,
    triggerConfetti,
  } = useDineFlowStore();

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const { data: menuItems = [] } = useQuery({
    queryKey: ['menuItems'],
    queryFn: () => menuApi.getPublicMenu('ember-and-olive'),
  });

  const subtotal = queueCart.reduce((acc, x) => acc + x.price * x.qty, 0);

  const handleConfirmAdvanceOrder = async () => {
    if (queueCart.length === 0) {
      showToast('Add at least one dish first');
      return;
    }

    setIsSubmitting(true);
    try {
      await queueApi.placeAdvanceOrder(queueToken, {
        mode: queueMode,
        items: queueCart.map((i) => ({
          menuItemId: i.menuItemId,
          quantity: i.qty,
        })),
      });

      triggerConfetti();
      showToast('Advance order confirmed!');
      setScreen('queue-status');
    } catch (err: any) {
      showToast(err.message || 'Failed to submit advance order');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[760px] bg-[#fbfaf5] text-[#1d2925] flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-2.5 px-6 py-4 border-b border-[#eae7dd] bg-[#fffefa]">
          <div className="flex items-center gap-2.5 font-extrabold text-[15px] font-heading tracking-tight">
            <span className="w-8 h-8 rounded-[11px] bg-[#17221e] text-white grid place-items-center text-sm">
              ✦
            </span>
            EMBER &amp; OLIVE
          </div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#fbf1d9] text-[#98722d] border border-[#f1e2bb] text-[9px] font-extrabold">
            TOKEN {queueToken}
          </span>
        </div>

        <div className="p-4 md:p-8 max-w-[1050px] mx-auto">
          <button
            onClick={() => setScreen('queue-status')}
            className="text-[11px] font-extrabold text-[#7b8980] hover:text-[#1d2925] flex items-center gap-1 mb-3"
          >
            ← Back to queue ticket
          </button>

          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="text-[9px] tracking-[1.7px] uppercase font-extrabold text-[#879188]">
                ORDER AHEAD · SKIP THE WAIT AT THE TABLE
              </div>
              <h1 className="font-heading font-extrabold text-[26px] md:text-[34px] tracking-tight my-1">
                Your table is next.
                <br />
                <span className="text-[#ef6b4b]">Let's get your order ready.</span>
              </h1>
              <p className="text-[12px] text-[#7c887e]">
                Choose your dishes now, then decide when the kitchen should prepare them.
              </p>
            </div>
            <div className="hidden md:block text-[60px] animate-dish-hover">🍱</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
            {/* Step 1 & Step 2 */}
            <div className="space-y-4">
              {/* Timing Modes */}
              <div className="bg-[#fffefa] border border-[#e5e4da] rounded-[17px] p-5 shadow-[0_5px_18px_rgba(35,47,39,0.025)]">
                <h3 className="font-heading font-extrabold text-[14px] mb-3">
                  1 · Choose preparation timing
                </h3>

                <div className="space-y-2.5">
                  <div
                    onClick={() => setQueueMode('after-seat')}
                    className={`p-3.5 rounded-[13px] border-2 cursor-pointer transition-all ${
                      queueMode === 'after-seat'
                        ? 'border-[#6d8b72] bg-[#f2f7f3]'
                        : 'border-[#e5e4da] bg-[#fffefa] hover:bg-[#fbfaf5]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <b className="font-heading font-extrabold text-[12px] text-[#1d2925]">
                        Prepare after seating
                      </b>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-extrabold ${
                          queueMode === 'after-seat'
                            ? 'bg-[#dcebdd] text-[#47764f]'
                            : 'bg-[#eeeae0] text-[#7c887e]'
                        }`}
                      >
                        {queueMode === 'after-seat' ? 'Selected' : 'Choose'}
                      </span>
                    </div>
                    <p className="text-[10px] text-[#748076] mt-1 leading-normal">
                      Kitchen starts after the host assigns your table. Best for hot, freshly served food.
                    </p>
                  </div>

                  <div
                    onClick={() => setQueueMode('counter-now')}
                    className={`p-3.5 rounded-[13px] border-2 cursor-pointer transition-all ${
                      queueMode === 'counter-now'
                        ? 'border-[#ef6b4b] bg-[#fae4dc]'
                        : 'border-[#e5e4da] bg-[#fffefa] hover:bg-[#fbfaf5]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <b className="font-heading font-extrabold text-[12px] text-[#1d2925]">
                        Prepare now · counter pickup
                      </b>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-extrabold ${
                          queueMode === 'counter-now'
                            ? 'bg-[#ef6b4b] text-white'
                            : 'bg-[#eeeae0] text-[#7c887e]'
                        }`}
                      >
                        {queueMode === 'counter-now' ? 'Selected' : 'Choose'}
                      </span>
                    </div>
                    <p className="text-[10px] text-[#748076] mt-1 leading-normal">
                      Kitchen starts immediately. Collect your order at the counter when it is ready.
                    </p>
                  </div>
                </div>
              </div>

              {/* Advance Order Cart */}
              <div className="bg-[#fffefa] border border-[#e5e4da] rounded-[17px] p-5 shadow-[0_5px_18px_rgba(35,47,39,0.025)]">
                <h3 className="font-heading font-extrabold text-[14px] mb-3">
                  2 · Your advance order items
                </h3>

                {queueCart.length > 0 ? (
                  <div className="divide-y divide-[#eeeae0]">
                    {queueCart.map((item) => (
                      <div key={item.menuItemId} className="py-2.5 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className="text-[22px]">{item.emoji || '🍽️'}</span>
                          <div>
                            <b className="block font-heading font-extrabold text-[11px]">
                              {item.name}
                            </b>
                            <span className="text-[9px] text-[#89938b]">
                              ₹{item.price.toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 bg-[#fbfaf5] border border-[#ddd8ca] rounded-full px-2 py-0.5">
                          <button
                            onClick={() => updateQueueCartQty(item.menuItemId, -1)}
                            className="text-xs font-bold w-5 h-5 flex items-center justify-center text-[#5d6b60]"
                          >
                            −
                          </button>
                          <strong className="text-[10px] font-extrabold">{item.qty}</strong>
                          <button
                            onClick={() => updateQueueCartQty(item.menuItemId, 1)}
                            className="text-xs font-bold w-5 h-5 flex items-center justify-center text-[#5d6b60]"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}

                    <div className="pt-3 flex justify-between font-extrabold text-[13px] text-[#1d2925]">
                      <span>Subtotal</span>
                      <span>₹{subtotal.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-[11px] text-[#89938b] py-3 text-center">
                    No items selected yet. Tap '+' on any dish to add.
                  </p>
                )}

                <button
                  disabled={isSubmitting || queueCart.length === 0}
                  onClick={handleConfirmAdvanceOrder}
                  className="w-full mt-4 bg-[#ef6b4b] border border-[#ef6b4b] text-white py-2.5 rounded-[10px] text-[11px] font-extrabold shadow-[0_7px_16px_rgba(239,107,75,0.2)] hover:scale-101 active:scale-99 transition-transform disabled:opacity-50"
                >
                  {isSubmitting
                    ? 'Submitting order...'
                    : `Confirm advance order · ₹${subtotal.toLocaleString('en-IN')}`}
                </button>
              </div>
            </div>

            {/* Step 3: Menu Picker */}
            <div className="bg-[#fffefa] border border-[#e5e4da] rounded-[17px] p-5 shadow-[0_5px_18px_rgba(35,47,39,0.025)]">
              <h3 className="font-heading font-extrabold text-[14px] mb-3">
                3 · Choose from the menu
              </h3>

              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                {menuItems
                  .filter((x) => x.available)
                  .map((item) => (
                    <div
                      key={item.id}
                      className="p-2.5 rounded-[12px] border border-[#efede4] bg-[#fbfaf5] flex items-center justify-between hover:bg-[#f3f0e6] transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-[26px]">{item.emoji || '🍽️'}</span>
                        <div>
                          <b className="block font-heading font-extrabold text-[11px] text-[#1d2925]">
                            {item.name}
                          </b>
                          <span className="text-[9px] text-[#89938b]">
                            ₹{item.price.toLocaleString('en-IN')} · {item.category}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() =>
                          addToQueueCart({
                            menuItemId: item.id,
                            name: item.name,
                            price: item.price,
                            emoji: item.emoji,
                            qty: 1,
                          })
                        }
                        className="w-7 h-7 rounded-full bg-[#ef6b4b] text-white font-bold flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
                      >
                        +
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
