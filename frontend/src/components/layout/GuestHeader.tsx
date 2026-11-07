import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BellRing,
  ShoppingBag,
  Users,
  ChevronDown,
  Sparkles,
  LayoutDashboard,
  ChefHat,
  ConciergeBell,
} from 'lucide-react';
import { useDineFlowStore } from '../../store/useDineFlowStore';
import { ordersApi } from '../../api/orders';

export const GuestHeader: React.FC = () => {
  const navigate = useNavigate();
  const { cart, activeTableNumber, partySize, showToast } = useDineFlowStore();
  const [isCallingServer, setIsCallingServer] = useState(false);
  const [showPortalMenu, setShowPortalMenu] = useState(false);

  const totalCartQty = cart.reduce((acc, item) => acc + item.qty, 0);

  const handleCallServer = async () => {
    setIsCallingServer(true);
    try {
      await ordersApi.callWaiterRequest(activeTableNumber, 'CALL_WAITER');
      showToast(`Server alerted for Table ${activeTableNumber}. Someone will be with you shortly.`);
    } catch {
      showToast(`Server alerted for Table ${activeTableNumber}`);
    } finally {
      setTimeout(() => setIsCallingServer(false), 2000);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#fffefa]/95 backdrop-blur-md border-b border-[#eae7dd] px-4 sm:px-6 md:px-8 py-3.5 flex items-center justify-between gap-2.5 shadow-2xs">
      {/* Brand & Table */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        <Link
          to="/menu"
          className="flex items-center gap-2 font-extrabold text-[15px] font-serif tracking-tight text-[#17221e]"
        >
          <span className="w-8 h-8 rounded-[10px] bg-[#17221e] text-white flex items-center justify-center text-sm shadow-xs font-bold">
            ✦
          </span>
          <span className="hidden sm:inline">EMBER &amp; OLIVE</span>
        </Link>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#eaf5ed] border border-[#c4e6cc] text-[#2d6840] text-xs font-bold">
          <span className="w-2 h-2 rounded-full bg-[#34784a] animate-pulse" />
          <span>Table {activeTableNumber}</span>
          <span className="text-[10px] text-[#4d7b5b] hidden md:inline">· {partySize} Guests</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Call Server */}
        <button
          onClick={handleCallServer}
          disabled={isCallingServer}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-[10px] bg-[#f3f0e6] hover:bg-[#e7e3d5] text-[#334139] text-xs font-bold transition-all border border-[#e4decb] active:scale-95"
          title="Call server to your table"
        >
          <BellRing
            size={13}
            className={isCallingServer ? 'animate-bounce text-[#ef6b4b]' : 'text-[#ef6b4b]'}
          />
          <span className="hidden sm:inline">Call Server</span>
        </button>

        {/* Waitlist */}
        <Link
          to="/waitlist/join"
          className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-[10px] bg-[#f3f0e6] hover:bg-[#e7e3d5] text-[#4d5c52] text-xs font-bold transition-all border border-[#e4decb]"
        >
          <Users size={13} />
          <span>Waitlist</span>
        </Link>

        {/* Cart */}
        <Link
          to="/cart"
          className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-[10px] bg-[#17221e] hover:bg-[#283830] text-white text-xs font-bold transition-all shadow-xs"
        >
          <ShoppingBag size={13} />
          <span>Cart</span>
          {totalCartQty > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-[#ef6b4b] text-white text-[10px] font-black">
              {totalCartQty}
            </span>
          )}
        </Link>

        {/* Switch Portal Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowPortalMenu(!showPortalMenu)}
            className="p-1.5 rounded-[10px] border border-[#e4decb] text-[#55635b] hover:bg-[#f3f0e6] transition-colors flex items-center gap-1"
            title="Switch Workspace Portal"
          >
            <ChevronDown size={14} />
          </button>

          {showPortalMenu && (
            <div className="absolute right-0 mt-2 w-52 bg-white rounded-[16px] shadow-xl border border-[#e5e1d5] p-2 z-50 text-xs">
              <div className="px-2.5 py-1.5 text-[10px] font-bold text-[#829288] uppercase tracking-wider border-b border-[#f0ece0] mb-1">
                Switch Portal
              </div>
              <Link
                to="/"
                onClick={() => setShowPortalMenu(false)}
                className="flex items-center gap-2 px-2.5 py-2 rounded-[8px] hover:bg-[#faf8f2] text-[#17221e] font-semibold"
              >
                <Sparkles size={14} className="text-[#ef6b4b]" />
                <span>DineFlow Hub</span>
              </Link>
              <Link
                to="/admin"
                onClick={() => setShowPortalMenu(false)}
                className="flex items-center gap-2 px-2.5 py-2 rounded-[8px] hover:bg-[#faf8f2] text-[#17221e] font-semibold"
              >
                <LayoutDashboard size={14} className="text-[#34784a]" />
                <span>Manager Workspace</span>
              </Link>
              <Link
                to="/kitchen"
                onClick={() => setShowPortalMenu(false)}
                className="flex items-center gap-2 px-2.5 py-2 rounded-[8px] hover:bg-[#faf8f2] text-[#17221e] font-semibold"
              >
                <ChefHat size={14} className="text-[#ef6b4b]" />
                <span>Kitchen KDS</span>
              </Link>
              <Link
                to="/waiter"
                onClick={() => setShowPortalMenu(false)}
                className="flex items-center gap-2 px-2.5 py-2 rounded-[8px] hover:bg-[#faf8f2] text-[#17221e] font-semibold"
              >
                <ConciergeBell size={14} className="text-[#b07d1b]" />
                <span>Waiter / Runner</span>
              </Link>
              <Link
                to="/host"
                onClick={() => setShowPortalMenu(false)}
                className="flex items-center gap-2 px-2.5 py-2 rounded-[8px] hover:bg-[#faf8f2] text-[#17221e] font-semibold"
              >
                <Users size={14} className="text-[#6d8b72]" />
                <span>Host Console</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
