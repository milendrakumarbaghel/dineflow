import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Utensils, ShoppingBag, Clock, Receipt } from 'lucide-react';
import { useDineFlowStore } from '../../store/useDineFlowStore';

interface CustomerLayoutProps {
  children: React.ReactNode;
}

export const CustomerLayout: React.FC<CustomerLayoutProps> = ({ children }) => {
  const location = useLocation();
  const { cart, toastMessage } = useDineFlowStore();
  const totalCartQty = cart.reduce((acc, item) => acc + item.qty, 0);

  const navLinks = [
    { label: 'Menu', path: '/menu', icon: Utensils },
    { label: 'Cart', path: '/cart', icon: ShoppingBag, badge: totalCartQty > 0 ? totalCartQty : undefined },
    { label: 'Tracking', path: '/order-tracking', icon: Clock },
    { label: 'Bill', path: '/bill', icon: Receipt },
  ];

  return (
    <div className="min-h-screen bg-[#fbfaf5] text-[#17221e] flex flex-col font-sans pb-16 md:pb-0">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-20 md:bottom-6 right-6 z-50 bg-[#17221e] text-white px-4 py-2.5 rounded-[14px] shadow-xl border border-[#2d3b34] text-xs font-semibold flex items-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-[#ef6b4b] animate-ping" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Viewport */}
      <main className="flex-1 w-full max-w-5xl mx-auto">
        {children}
      </main>

      {/* Bottom Sticky Mobile Navigation Bar */}
      <nav className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#e8e4d8] py-2 px-6 flex items-center justify-around md:hidden shadow-lg">
        {navLinks.map((tab) => {
          const isActive = location.pathname === tab.path;
          const Icon = tab.icon;

          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={`flex flex-col items-center gap-1 transition-all relative ${
                isActive ? 'text-[#ef6b4b] font-bold' : 'text-[#7d8c82] hover:text-[#17221e]'
              }`}
            >
              <div className="relative">
                <Icon size={19} />
                {tab.badge && (
                  <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-[#ef6b4b] text-white text-[9px] font-black flex items-center justify-center">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] tracking-tight">{tab.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
