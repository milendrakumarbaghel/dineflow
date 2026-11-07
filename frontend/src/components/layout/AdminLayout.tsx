import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  MapPin,
  ClipboardList,
  UtensilsCrossed,
  QrCode,
  Users,
  BarChart3,
  Settings,
  ChefHat,
  ConciergeBell,
  Sparkles,
  Menu as MenuIcon,
  X,
  ExternalLink,
  ChevronRight,
  Flame,
  LogOut,
  Bell,
  Search,
} from 'lucide-react';
import { useDineFlowStore } from '../../store/useDineFlowStore';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toastMessage, showToast } = useDineFlowStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { label: 'Overview', path: '/admin', icon: LayoutDashboard },
    { label: 'Live Floor Plan', path: '/admin/floor-plan', icon: MapPin },
    { label: 'All Orders', path: '/admin/orders', icon: ClipboardList },
    { label: 'Menu Studio', path: '/admin/menu', icon: UtensilsCrossed },
    { label: 'Tables & QR', path: '/admin/tables', icon: QrCode },
    { label: 'Staff & Roles', path: '/admin/team', icon: Users },
    { label: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
    { label: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  const operationsLinks = [
    { label: 'Kitchen KDS', path: '/kitchen', icon: ChefHat },
    { label: 'Waiter / Runner', path: '/waiter', icon: ConciergeBell },
    { label: 'Host Console', path: '/host', icon: Users },
    { label: 'Guest QR Menu', path: '/menu', icon: ExternalLink },
  ];

  return (
    <div className="flex h-screen bg-[#fbfaf5] text-[#17221e] overflow-hidden font-sans">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 bg-[#17221e] text-white px-4 py-2.5 rounded-[14px] shadow-xl border border-[#2d3b34] text-xs font-semibold flex items-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-[#ef6b4b] animate-ping" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden backdrop-blur-xs"
        />
      )}

      {/* SaaS Admin Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#17221e] text-[#fbfaf5] flex flex-col border-r border-[#26352d] transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand */}
        <div className="p-5 border-b border-[#25352d] flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[10px] bg-[#ef6b4b] flex items-center justify-center text-white shadow-xs">
              <Flame size={18} className="fill-white" />
            </div>
            <div>
              <div className="font-serif font-black text-base tracking-tight text-white flex items-center gap-1.5">
                DineFlow
                <span className="text-[9px] font-sans font-extrabold uppercase px-1.5 py-0.2 rounded bg-[#25392f] text-[#6d8b72]">
                  PRO
                </span>
              </div>
              <div className="text-[10px] text-[#86968d] truncate">Ember & Olive</div>
            </div>
          </Link>

          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1 rounded-lg text-[#87968d] hover:bg-[#25352d] lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        {/* Sidebar Nav Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin">
          <div className="space-y-1">
            <div className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-[#708277]">
              Management
            </div>
            <div className="space-y-0.5 pt-1">
              {navItems.map((item) => {
                const isActive =
                  location.pathname === item.path ||
                  (item.path !== '/admin' && location.pathname.startsWith(item.path));
                const Icon = item.icon;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-[11px] text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-[#ef6b4b] text-white shadow-xs font-bold'
                        : 'text-[#bac7be] hover:bg-[#213129] hover:text-white'
                    }`}
                  >
                    <Icon size={16} className={isActive ? 'text-white' : 'text-[#7d9084]'} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="space-y-1">
            <div className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-[#708277]">
              Live Floor & Kitchen
            </div>
            <div className="space-y-0.5 pt-1">
              {operationsLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className="flex items-center justify-between px-3 py-2 rounded-[11px] text-xs font-medium text-[#9ab0a2] hover:bg-[#213129] hover:text-white transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon size={15} className="text-[#6d8b72]" />
                      <span>{item.label}</span>
                    </div>
                    <ChevronRight size={13} className="text-[#43594c]" />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* User Card & Logout */}
        <div className="p-3.5 border-t border-[#25352d] bg-[#121c18] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#ef6b4b] text-white font-black text-xs flex items-center justify-center">
              AR
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-white truncate">Ananya Rao</div>
              <div className="text-[10px] text-[#84948a] truncate">Restaurant Manager</div>
            </div>
          </div>

          <Link
            to="/"
            className="p-1.5 rounded-lg text-[#84948a] hover:text-white hover:bg-[#23332b] transition-colors"
            title="Exit to DineFlow Portal Hub"
          >
            <LogOut size={15} />
          </Link>
        </div>
      </aside>

      {/* Main Admin Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-[#eae6da] px-5 py-3 shrink-0 flex items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-1.5 rounded-lg border border-[#e4decb] text-[#55635b] lg:hidden hover:bg-[#fbfaf5]"
            >
              <MenuIcon size={18} />
            </button>
            <div>
              <div className="text-xs font-bold text-[#829288] uppercase tracking-wide">
                Ember &amp; Olive · Management Workspace
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#eaf5ed] text-[#34784a] border border-[#c4e6cc]">
              <span className="w-2 h-2 rounded-full bg-[#34784a] animate-pulse" />
              All Systems Operational
            </span>

            <Link
              to="/menu"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] bg-[#f3f0e6] hover:bg-[#e7e3d5] text-[#3e4c43] text-xs font-bold transition-all border border-[#e5e1d5]"
            >
              <ExternalLink size={13} />
              <span>Preview Menu</span>
            </Link>

            <Link
              to="/"
              className="px-3 py-1.5 rounded-[10px] bg-[#17221e] hover:bg-[#293a32] text-white text-xs font-bold transition-all shadow-2xs"
            >
              Hub
            </Link>
          </div>
        </header>

        {/* Content Viewport */}
        <main className="flex-1 overflow-y-auto bg-[#fbfaf5]">
          {children}
        </main>
      </div>
    </div>
  );
};
