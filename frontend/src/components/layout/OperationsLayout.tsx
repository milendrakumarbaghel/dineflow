import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ChefHat,
  ConciergeBell,
  Users,
  LayoutDashboard,
  Maximize2,
  ExternalLink,
  Flame,
  Volume2,
} from 'lucide-react';

interface OperationsLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export const OperationsLayout: React.FC<OperationsLayoutProps> = ({
  title,
  subtitle,
  children,
}) => {
  const location = useLocation();

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <div className="min-h-screen bg-[#141b18] text-[#fbfaf5] flex flex-col font-sans">
      {/* Top Operations Header Bar */}
      <header className="bg-[#1b2521] border-b border-[#2b3a34] px-4 md:px-7 py-3 flex items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-[10px] bg-[#ef6b4b] flex items-center justify-center text-white shadow-xs">
              <Flame size={18} className="fill-white" />
            </div>
            <div>
              <div className="font-serif font-black text-sm tracking-tight text-white flex items-center gap-2">
                <span>DineFlow</span>
                <span className="text-[10px] font-sans font-extrabold uppercase px-1.5 py-0.2 rounded bg-[#ef6b4b]/20 text-[#ef6b4b] border border-[#ef6b4b]/30">
                  {title}
                </span>
              </div>
              <div className="text-[10px] text-[#7d9085]">{subtitle}</div>
            </div>
          </Link>
        </div>

        {/* Station Navigation Switcher */}
        <div className="flex items-center gap-1.5 bg-[#141d19] p-1 rounded-[12px] border border-[#2b3a34]">
          <Link
            to="/kitchen"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[9px] text-xs font-bold transition-all ${
              location.pathname === '/kitchen'
                ? 'bg-[#ef6b4b] text-white shadow-xs'
                : 'text-[#8fa396] hover:text-white'
            }`}
          >
            <ChefHat size={14} />
            <span className="hidden sm:inline">Kitchen KDS</span>
          </Link>

          <Link
            to="/waiter"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[9px] text-xs font-bold transition-all ${
              location.pathname === '/waiter' || location.pathname === '/runner'
                ? 'bg-[#ef6b4b] text-white shadow-xs'
                : 'text-[#8fa396] hover:text-white'
            }`}
          >
            <ConciergeBell size={14} />
            <span className="hidden sm:inline">Runner</span>
          </Link>

          <Link
            to="/host"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[9px] text-xs font-bold transition-all ${
              location.pathname === '/host'
                ? 'bg-[#ef6b4b] text-white shadow-xs'
                : 'text-[#8fa396] hover:text-white'
            }`}
          >
            <Users size={14} />
            <span className="hidden sm:inline">Host</span>
          </Link>
        </div>

        {/* Utility Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-[10px] bg-[#141d19] hover:bg-[#23312a] text-[#8fa396] hover:text-white transition-colors border border-[#2b3a34]"
            title="Toggle Fullscreen Mode"
          >
            <Maximize2 size={14} />
          </button>

          <Link
            to="/admin"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] bg-[#23312a] hover:bg-[#2d4037] text-white text-xs font-bold transition-colors border border-[#374c41]"
          >
            <LayoutDashboard size={13} />
            <span className="hidden md:inline">Manager</span>
          </Link>

          <Link
            to="/"
            className="px-2.5 py-1.5 rounded-[10px] bg-[#ef6b4b] hover:bg-[#d95637] text-white text-xs font-bold transition-colors shadow-xs"
          >
            Hub
          </Link>
        </div>
      </header>

      {/* Main View */}
      <main className="flex-1 bg-[#fbfaf5] text-[#17221e]">
        {children}
      </main>
    </div>
  );
};
