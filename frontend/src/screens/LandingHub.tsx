import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Flame,
  Smartphone,
  Users,
  ChefHat,
  ConciergeBell,
  LayoutDashboard,
  Clock,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Database,
  Layers,
  Sparkles,
} from 'lucide-react';

export const LandingHub: React.FC = () => {
  const portals = [
    {
      title: 'Customer QR Ordering',
      badge: 'Guest Portal',
      badgeColor: 'bg-[#ffece8] text-[#ef6b4b] border-[#fcd5cd]',
      icon: Smartphone,
      path: '/menu',
      description:
        'Experience what a customer sees scanning the QR code at Table T04. Browse dishes, customize options, order, track live progress, and split the bill.',
      features: ['Digital Menu with 3D Plate', 'Customizations & Spice Levels', 'Live Order Timeline', 'Multi-Way Bill Splitting'],
      cta: 'Launch Guest App',
      highlight: true,
    },
    {
      title: 'Digital Waitlist & Queue',
      badge: 'Walk-in Portal',
      badgeColor: 'bg-[#fdf6e6] text-[#b07d1b] border-[#fae8b8]',
      icon: Users,
      path: '/waitlist/join',
      description:
        'Walk-in guests check into the digital waitlist, monitor their live queue ticket, and build advance pre-orders while waiting for a table.',
      features: ['Self-Serve Queue Check-in', 'Live ETA & Queue Position', 'Advance Pre-Ordering', 'Table Ready Notifications'],
      cta: 'Join Digital Waitlist',
    },
    {
      title: 'Kitchen Display (KDS)',
      badge: 'Kitchen Station',
      badgeColor: 'bg-[#ffece8] text-[#ef6b4b] border-[#fcd5cd]',
      icon: ChefHat,
      path: '/kitchen',
      description:
        'Kitchen-first order monitor for chefs and line cooks. Order age timers, station ticket routing, and one-click preparation progression.',
      features: ['High-Visibility Dark Display', 'Order Age Countdown', 'One-Click Prep Transitions', 'WebSocket STOMP Sync'],
      cta: 'Open Kitchen KDS',
    },
    {
      title: 'Waiter & Runner Console',
      badge: 'Floor Team',
      badgeColor: 'bg-[#eaf5ed] text-[#34784a] border-[#c4e6cc]',
      icon: ConciergeBell,
      path: '/waiter',
      description:
        'Tablet-optimized interface for servers and runners to dispatch ready food to tables and handle real-time customer service requests.',
      features: ['Ready Food Dispatch Board', 'Table Service Requests', 'Delivery Confirmation', 'Table Reset Alerts'],
      cta: 'Open Waiter Board',
    },
    {
      title: 'Host & Seating Console',
      badge: 'Front of House',
      badgeColor: 'bg-[#f3f0e6] text-[#55635b] border-[#ded9ca]',
      icon: Clock,
      path: '/host',
      description:
        'Front-of-house podium for hosts. Match waiting parties with available tables, manage capacity, handle no-shows, and seat guests.',
      features: ['Party Size Matching', 'Estimated Wait Times', 'Manual & FIFO Seating', 'Table Occupancy Sync'],
      cta: 'Open Host Console',
    },
    {
      title: 'Manager & Owner Workspace',
      badge: 'Management SaaS',
      badgeColor: 'bg-[#e8f0fe] text-[#1a73e8] border-[#c2dbfe]',
      icon: LayoutDashboard,
      path: '/admin',
      description:
        'Full operational suite for restaurant owners and managers. Sales pulse, 3D floor plan, menu studio with 86ing, ZXing QR generation, staff access control, and analytics.',
      features: ['Executive Dashboard & Pulse', '3D Floor Plan Seating', 'Menu Studio & Pricing', 'Cryptographic QR Code Generator'],
      cta: 'Enter Admin Workspace',
      highlight: true,
    },
  ];

  const demoAccounts = [
    { role: 'Owner', name: 'Vikram Mehta', email: 'owner@emberandolive.com', pass: 'Password123!' },
    { role: 'Manager', name: 'Ananya Rao', email: 'ananya@emberandolive.com', pass: 'Password123!' },
    { role: 'Kitchen', name: 'Dev Patel', email: 'dev@emberandolive.com', pass: 'Password123!' },
    { role: 'Waiter', name: 'Meera Singh', email: 'meera@emberandolive.com', pass: 'Password123!' },
    { role: 'Host', name: 'Kabir Joshi', email: 'kabir@emberandolive.com', pass: 'Password123!' },
    { role: 'Cashier', name: 'Rohan Das', email: 'rohan@emberandolive.com', pass: 'Password123!' },
  ];

  return (
    <div className="min-h-screen bg-[#fbfaf5] text-[#17221e] font-sans">
      {/* Top Navigation */}
      <header className="border-b border-[#eae6da] bg-white/90 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[12px] bg-[#ef6b4b] flex items-center justify-center text-white shadow-md">
            <Flame size={22} className="fill-white" />
          </div>
          <div>
            <div className="font-serif font-black text-xl tracking-tight text-[#17221e] flex items-center gap-2">
              DineFlow
              <span className="text-[10px] font-sans font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#eaf5ed] text-[#34784a] border border-[#c4e6cc]">
                Live Stack
              </span>
            </div>
            <div className="text-xs text-[#7d8c82]">
              Ember &amp; Olive · Artisan Kitchen Demo
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin"
            className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-[12px] bg-[#f3f0e6] hover:bg-[#e7e3d5] text-[#38473e] text-xs font-bold transition-all border border-[#ded9ca]"
          >
            <LayoutDashboard size={14} />
            <span>Admin Workspace</span>
          </Link>
          <Link
            to="/menu"
            className="flex items-center gap-1.5 px-4 py-2 rounded-[12px] bg-[#ef6b4b] hover:bg-[#d95637] text-white text-xs font-bold transition-all shadow-sm active:scale-95"
          >
            <Smartphone size={14} />
            <span>Customer QR App</span>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 py-12 md:py-16 max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f3f0e6] border border-[#ded9ca] text-[#4d5c52] text-xs font-bold mb-4">
            <Sparkles size={14} className="text-[#ef6b4b]" />
            Production Full-Stack Restaurant Operating System
          </span>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black font-serif tracking-tight text-[#17221e] leading-[1.1] max-w-3xl mx-auto">
            Scan. Order. Dine.{' '}
            <span className="text-[#ef6b4b] underline decoration-[#fcd5cd] decoration-wavy decoration-2">
              No Waiting Confusion.
            </span>
          </h1>
          <p className="mt-4 text-sm sm:text-base text-[#6d7d73] max-w-2xl mx-auto leading-relaxed">
            DineFlow is an enterprise restaurant platform that replaces printed menus, streamlines kitchen
            orchestration, handles walk-in waitlists, and provides multi-role operations for hosts, servers,
            cooks, and managers.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
            <Link
              to="/menu"
              className="px-6 py-3 rounded-[14px] bg-[#ef6b4b] hover:bg-[#d95637] text-white font-bold text-sm shadow-md transition-all active:scale-95 flex items-center gap-2"
            >
              <Smartphone size={16} />
              <span>Experience Table T04 QR Menu</span>
            </Link>
            <Link
              to="/admin"
              className="px-6 py-3 rounded-[14px] bg-[#17221e] hover:bg-[#283830] text-white font-bold text-sm shadow-md transition-all active:scale-95 flex items-center gap-2"
            >
              <LayoutDashboard size={16} />
              <span>Explore Manager Workspace</span>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Portals Grid */}
      <section className="px-6 py-8 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8 pb-3 border-b border-[#eae6da]">
          <div>
            <div className="text-[11px] font-bold text-[#ef6b4b] uppercase tracking-widest">
              ROLE-BASED PORTALS
            </div>
            <h2 className="text-2xl font-black font-serif text-[#17221e] mt-0.5">
              Select an Application Experience
            </h2>
          </div>
          <span className="text-xs text-[#7a8a80]">6 Dedicated Workspaces</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {portals.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.title}
                className={`bg-white rounded-[20px] p-6 border transition-all flex flex-col justify-between ${
                  p.highlight
                    ? 'border-[#ef6b4b]/30 shadow-md ring-2 ring-[#ef6b4b]/10'
                    : 'border-[#eae6da] shadow-2xs hover:shadow-md'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-[14px] bg-[#faf8f2] border border-[#eee9db] flex items-center justify-center text-[#17221e]">
                      <Icon size={24} className={p.highlight ? 'text-[#ef6b4b]' : 'text-[#2e3e35]'} />
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${p.badgeColor}`}
                    >
                      {p.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-black font-serif text-[#17221e] mb-2">
                    {p.title}
                  </h3>
                  <p className="text-xs text-[#6e7e74] leading-relaxed mb-4">
                    {p.description}
                  </p>

                  <ul className="space-y-1.5 mb-6">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-[11px] text-[#4d5c52]">
                        <CheckCircle2 size={13} className="text-[#6d8b72] shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  to={p.path}
                  className={`w-full py-2.5 px-4 rounded-[12px] text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 shadow-2xs active:scale-95 ${
                    p.highlight
                      ? 'bg-[#ef6b4b] hover:bg-[#d95637] text-white'
                      : 'bg-[#17221e] hover:bg-[#283830] text-white'
                  }`}
                >
                  <span>{p.cta}</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* Demo Accounts Reference */}
      <section className="px-6 py-12 max-w-5xl mx-auto">
        <div className="bg-[#fffefa] border border-[#eae6da] rounded-[22px] p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#f0ece0]">
            <div>
              <div className="text-[11px] font-bold text-[#829288] uppercase tracking-wider">
                SECURITY & ROLE-BASED ACCESS
              </div>
              <h3 className="text-xl font-black font-serif text-[#17221e] mt-0.5">
                Pre-Seeded Demo Staff Accounts
              </h3>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#f3f0e6] text-xs font-bold text-[#44534a]">
              Password: Password123!
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 mt-5">
            {demoAccounts.map((acc) => (
              <div
                key={acc.email}
                className="p-3.5 bg-[#faf8f2] rounded-[14px] border border-[#eae5d8] text-xs"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-[#17221e]">{acc.name}</span>
                  <span className="px-2 py-0.2 rounded bg-[#f3f0e6] text-[10px] font-black text-[#ef6b4b]">
                    {acc.role}
                  </span>
                </div>
                <div className="text-[11px] text-[#718177] font-mono truncate">
                  {acc.email}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#eae6da] bg-white px-6 py-6 text-center text-xs text-[#829288]">
        <div className="font-bold text-[#17221e] font-serif">
          DineFlow · Next-Generation Restaurant Operating System
        </div>
        <p className="mt-1 text-[11px]">
          Java 21 / 25 Spring Boot 3.5 API · PostgreSQL 16 · Spring WebSocket STOMP · React 19 + TypeScript
        </p>
      </footer>
    </div>
  );
};
