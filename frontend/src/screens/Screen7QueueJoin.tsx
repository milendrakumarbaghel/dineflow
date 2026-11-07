import React, { useState } from 'react';
import { queueApi } from '../api/queue';
import { useDineFlowStore } from '../store/useDineFlowStore';

export const Screen7QueueJoin: React.FC = () => {
  const {
    queueName,
    setQueueName,
    partySize,
    setPartySize,
    setQueueToken,
    setScreen,
    showToast,
    triggerConfetti,
  } = useDineFlowStore();

  const [phone, setPhone] = useState<string>('+91 98765 43210');
  const [preference, setPreference] = useState<string>('ANY');
  const [notifyConsent, setNotifyConsent] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleJoin = async () => {
    if (!queueName.trim()) {
      showToast('Please enter your name');
      return;
    }

    setIsSubmitting(true);
    try {
      const ticket = await queueApi.joinQueue({
        restaurantSlug: 'ember-and-olive',
        customerName: queueName,
        customerPhone: phone,
        partySize,
        seatingPreference: preference,
      });

      setQueueToken(ticket.ticketToken);
      triggerConfetti();
      showToast(`Joined queue! Your ticket is ${ticket.ticketToken}`);
      setScreen('queue-status');
    } catch (err: any) {
      showToast(err.message || 'Failed to join queue');
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
            WALK-IN QUEUE
          </span>
        </div>

        <div className="p-4 md:p-8 max-w-[850px] mx-auto">
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="text-[9px] tracking-[1.7px] uppercase font-extrabold text-[#879188]">
                WELCOME · WALK-INS
              </div>
              <h1 className="font-heading font-extrabold text-[26px] md:text-[34px] tracking-tight my-1">
                A table is on its way.
              </h1>
              <p className="text-[12px] text-[#7c887e]">
                Join the live waitlist, explore the menu, and we'll let you know when your table is ready.
              </p>
            </div>
            <div className="hidden md:block text-[60px] animate-dish-hover">🪑</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
            {/* Join Form */}
            <div className="bg-[#fffefa] border border-[#e5e4da] rounded-[17px] p-5 shadow-[0_5px_18px_rgba(35,47,39,0.025)]">
              <h3 className="font-heading font-extrabold text-[14px] mb-3">
                Join the waiting list
              </h3>

              <div className="space-y-3.5">
                <div>
                  <label className="block text-[10px] font-extrabold text-[#5d6b60] mb-1">
                    Your name
                  </label>
                  <input
                    type="text"
                    value={queueName}
                    onChange={(e) => setQueueName(e.target.value)}
                    placeholder="Full name"
                    className="w-full border border-[#deded3] bg-[#fffefa] rounded-[10px] p-2.5 text-[11px] text-[#1d2925] focus:outline-none focus:ring-2 focus:ring-[#ef6b4b44]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold text-[#5d6b60] mb-1">
                    Mobile number
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="10-digit mobile number"
                    className="w-full border border-[#deded3] bg-[#fffefa] rounded-[10px] p-2.5 text-[11px] text-[#1d2925] focus:outline-none focus:ring-2 focus:ring-[#ef6b4b44]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold text-[#5d6b60] mb-1">
                    Number of guests
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2.5 bg-[#fbfaf5] border border-[#ddd8ca] rounded-full px-2.5 py-1">
                      <button
                        onClick={() => setPartySize(partySize - 1)}
                        className="w-6 h-6 rounded-full bg-[#f3f0e6] hover:bg-[#e4dfd0] font-bold text-xs flex items-center justify-center text-[#1d2925]"
                      >
                        −
                      </button>
                      <strong className="min-w-[16px] text-center font-heading font-extrabold text-[12px]">
                        {partySize}
                      </strong>
                      <button
                        onClick={() => setPartySize(partySize + 1)}
                        className="w-6 h-6 rounded-full bg-[#f3f0e6] hover:bg-[#e4dfd0] font-bold text-xs flex items-center justify-center text-[#1d2925]"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-[10px] text-[#89938b]">People in your party</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold text-[#5d6b60] mb-1">
                    Seating preference
                  </label>
                  <select
                    value={preference}
                    onChange={(e) => setPreference(e.target.value)}
                    className="w-full border border-[#deded3] bg-[#fffefa] rounded-[10px] p-2.5 text-[11px] text-[#1d2925] focus:outline-none focus:ring-2 focus:ring-[#ef6b4b44]"
                  >
                    <option value="ANY">Any available table</option>
                    <option value="INDOOR">Indoor seating</option>
                    <option value="OUTDOOR">Outdoor patio</option>
                    <option value="ACCESSIBLE">Accessible seating</option>
                  </select>
                </div>

                <label className="flex items-center gap-2 text-[10px] text-[#778379] cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={notifyConsent}
                    onChange={(e) => setNotifyConsent(e.target.checked)}
                    className="accent-[#ef6b4b]"
                  />
                  Notify me via SMS/screen when a table is ready
                </label>

                <button
                  disabled={isSubmitting}
                  onClick={handleJoin}
                  className="w-full bg-[#ef6b4b] border border-[#ef6b4b] text-white py-3 rounded-[10px] text-[12px] font-extrabold shadow-[0_7px_16px_rgba(239,107,75,0.2)] hover:scale-101 active:scale-99 transition-transform disabled:opacity-50 mt-2"
                >
                  {isSubmitting ? 'Joining...' : 'Join waitlist →'}
                </button>
              </div>
            </div>

            {/* Restaurant Status Card */}
            <div className="bg-[#f4f0e5] border border-[#e5dfcf] rounded-[17px] p-5">
              <div className="text-[9px] tracking-[1.7px] uppercase font-extrabold text-[#879188]">
                LIVE RESTAURANT STATUS
              </div>
              <h2 className="font-heading font-extrabold text-[20px] text-[#1d2925] my-1">
                Busy, but moving.
              </h2>
              <p className="text-[11px] text-[#7c887e] leading-relaxed">
                We seat parties as tables become available. Your place in line may adjust to match the right table size.
              </p>

              <div className="grid grid-cols-2 gap-3 my-4">
                <div className="bg-[#fffefa] border border-[#e5e4da] rounded-[15px] p-3.5">
                  <span className="text-[9px] text-[#879188] block">Parties waiting</span>
                  <b className="font-heading font-extrabold text-[24px] block my-0.5 text-[#1d2925]">
                    4
                  </b>
                  <span className="text-[9px] text-[#879188]">Updated live</span>
                </div>

                <div className="bg-[#fffefa] border border-[#e5e4da] rounded-[15px] p-3.5">
                  <span className="text-[9px] text-[#879188] block">Typical wait</span>
                  <b className="font-heading font-extrabold text-[24px] block my-0.5 text-[#1d2925]">
                    15–20
                  </b>
                  <span className="text-[9px] text-[#879188]">Minutes</span>
                </div>
              </div>

              <div className="h-[1px] bg-[#e5dfcf] my-4" />

              <h3 className="font-heading font-extrabold text-[13px] mb-1">While you wait</h3>
              <p className="text-[11px] text-[#7c887e] leading-relaxed mb-3">
                Browse the menu and choose what you'd like. Select “prepare after seating” or “prepare now for counter pickup” before confirming.
              </p>

              <button
                onClick={() => setScreen('guest-menu')}
                className="bg-[#17221e] text-white px-4 py-2 rounded-[9px] text-[10px] font-extrabold hover:bg-[#27362f] transition-colors"
              >
                Explore menu →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
