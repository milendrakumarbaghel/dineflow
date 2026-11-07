import { create } from 'zustand';
import confetti from 'canvas-confetti';

export interface CartItem {
  menuItemId: number;
  name: string;
  price: number;
  emoji?: string;
  qty: number;
  spiceLevel?: string;
  instructions?: string;
}

export type ScreenId =
  | 'guest-menu'
  | 'item-detail'
  | 'cart'
  | 'checkout'
  | 'order-tracking'
  | 'bill'
  | 'queue-join'
  | 'queue-status'
  | 'queue-order'
  | 'host-console'
  | 'floor-plan'
  | 'kitchen'
  | 'runner'
  | 'table-session'
  | 'overview'
  | 'menu-studio'
  | 'tables-qr'
  | 'orders'
  | 'team'
  | 'insights'
  | 'settings';

export const SCREEN_ROUTES: Record<ScreenId, string> = {
  'guest-menu': '/menu',
  'item-detail': '/item',
  'cart': '/cart',
  'checkout': '/checkout',
  'order-tracking': '/order-tracking',
  'bill': '/bill',
  'queue-join': '/waitlist/join',
  'queue-status': '/waitlist/status',
  'queue-order': '/waitlist/order',
  'host-console': '/host',
  'floor-plan': '/admin/floor-plan',
  'kitchen': '/kitchen',
  'runner': '/waiter',
  'table-session': '/admin/table-session',
  'overview': '/admin',
  'menu-studio': '/admin/menu',
  'tables-qr': '/admin/tables',
  'orders': '/admin/orders',
  'team': '/admin/team',
  'insights': '/admin/analytics',
  'settings': '/admin/settings',
};

export const ROUTE_TO_SCREEN: Record<string, ScreenId> = {
  '/menu': 'guest-menu',
  '/item': 'item-detail',
  '/cart': 'cart',
  '/checkout': 'checkout',
  '/order-tracking': 'order-tracking',
  '/bill': 'bill',
  '/waitlist/join': 'queue-join',
  '/waitlist/status': 'queue-status',
  '/waitlist/order': 'queue-order',
  '/host': 'host-console',
  '/admin/floor-plan': 'floor-plan',
  '/kitchen': 'kitchen',
  '/waiter': 'runner',
  '/runner': 'runner',
  '/admin/table-session': 'table-session',
  '/admin': 'overview',
  '/admin/overview': 'overview',
  '/admin/menu': 'menu-studio',
  '/admin/tables': 'tables-qr',
  '/admin/orders': 'orders',
  '/admin/team': 'team',
  '/admin/analytics': 'insights',
  '/admin/settings': 'settings',
};

let globalNavigate: ((path: string) => void) | null = null;

export const registerGlobalNavigate = (nav: ((path: string) => void) | null) => {
  globalNavigate = nav;
};

export interface ScreenMeta {
  title: string;
  description: string;
  address: string;
}

export const SCREEN_METAS: Record<ScreenId, ScreenMeta> = {
  'guest-menu': {
    title: 'Guest QR menu',
    description: 'Scan → browse → order → enjoy. Customer experience for a seated guest.',
    address: 'emberandolive.dineflow.app/menu/T04',
  },
  'item-detail': {
    title: 'Dish details',
    description: 'Explore a menu item, choose customizations, and add it to the cart.',
    address: 'emberandolive.dineflow.app/item/smoky-paneer-tikka',
  },
  'cart': {
    title: 'Cart & checkout',
    description: 'Review quantities, order type, notes, and payment preference.',
    address: 'emberandolive.dineflow.app/cart',
  },
  'checkout': {
    title: 'Confirm order',
    description: 'Confirm guest details and payment preference before the order reaches the kitchen.',
    address: 'emberandolive.dineflow.app/checkout',
  },
  'order-tracking': {
    title: 'Live order tracking',
    description: 'A clear order timeline with kitchen progress and table delivery.',
    address: 'emberandolive.dineflow.app/orders/TF-1048',
  },
  'bill': {
    title: 'Bill & payment',
    description: 'Review the table bill, split the amount, and complete payment.',
    address: 'emberandolive.dineflow.app/table/T04/bill',
  },
  'queue-join': {
    title: 'Join the queue',
    description: 'A guest without a table can join the digital waitlist at the entrance.',
    address: 'emberandolive.dineflow.app/waitlist/join',
  },
  'queue-status': {
    title: 'Queue ticket',
    description: 'Live queue position, estimated wait, and advance-order options.',
    address: 'emberandolive.dineflow.app/waitlist/Q-018',
  },
  'queue-order': {
    title: 'Advance order',
    description: 'Build an order while waiting and choose when the kitchen should prepare it.',
    address: 'emberandolive.dineflow.app/waitlist/Q-018/order',
  },
  'host-console': {
    title: 'Host console',
    description: 'Manage walk-ins, party size, table matching, and no-shows.',
    address: 'staff.dineflow.app/host',
  },
  'floor-plan': {
    title: 'Live floor plan',
    description: 'Visual table availability, cleaning status, and active sessions.',
    address: 'staff.dineflow.app/floor',
  },
  'kitchen': {
    title: 'Kitchen display',
    description: 'Kitchen-first order board with clear preparation states.',
    address: 'kitchen.dineflow.app/display',
  },
  'runner': {
    title: 'Waiter / runner',
    description: 'Ready orders, table destinations, and service confirmation.',
    address: 'staff.dineflow.app/runner',
  },
  'table-session': {
    title: 'Table session',
    description: 'A visit-level view connecting guests, multiple orders, and billing.',
    address: 'staff.dineflow.app/tables/T04/session',
  },
  'overview': {
    title: 'Owner overview',
    description: 'A real-time snapshot of sales, orders, occupancy, and service.',
    address: 'manage.dineflow.app/overview',
  },
  'menu-studio': {
    title: 'Menu studio',
    description: 'Create dishes, manage categories, prices, modifiers, and availability.',
    address: 'manage.dineflow.app/menu',
  },
  'tables-qr': {
    title: 'Tables & QR codes',
    description: 'Configure seating, table capacity, and table-specific QR identities.',
    address: 'manage.dineflow.app/tables',
  },
  'orders': {
    title: 'All orders',
    description: 'Search, filter, inspect, and manage every restaurant order.',
    address: 'manage.dineflow.app/orders',
  },
  'team': {
    title: 'Staff & roles',
    description: 'Invite team members and assign least-privilege access.',
    address: 'manage.dineflow.app/team',
  },
  'insights': {
    title: 'Analytics',
    description: 'Understand revenue, popular dishes, prep times, and table turns.',
    address: 'manage.dineflow.app/insights',
  },
  'settings': {
    title: 'Restaurant settings',
    description: 'Configure service modes, taxes, notifications, and policies.',
    address: 'manage.dineflow.app/settings',
  },
};

interface DineFlowState {
  currentScreen: ScreenId;
  device: 'desktop' | 'mobile';
  selectedItemId: number;
  detailQty: number;
  cart: CartItem[];
  activeOrderNumber: string;
  activeTableNumber: string;
  activeSessionId: number;
  queueToken: string;
  queueName: string;
  partySize: number;
  queueCart: CartItem[];
  queueMode: 'after-seat' | 'counter-now';
  toastMessage: string | null;

  setScreen: (screen: ScreenId) => void;
  setDevice: (device: 'desktop' | 'mobile') => void;
  setSelectedItem: (id: number) => void;
  setDetailQty: (qty: number) => void;
  addToCart: (item: CartItem) => void;
  updateCartQty: (menuItemId: number, delta: number) => void;
  removeFromCart: (menuItemId: number) => void;
  clearCart: () => void;
  setActiveOrderNumber: (orderNumber: string) => void;
  setActiveTableNumber: (tableNumber: string) => void;
  setQueueToken: (token: string) => void;
  setQueueName: (name: string) => void;
  setPartySize: (size: number) => void;
  addToQueueCart: (item: CartItem) => void;
  updateQueueCartQty: (menuItemId: number, delta: number) => void;
  setQueueMode: (mode: 'after-seat' | 'counter-now') => void;
  showToast: (msg: string) => void;
  triggerConfetti: () => void;
  resetAll: () => void;
}

export const useDineFlowStore = create<DineFlowState>((set, get) => ({
  currentScreen: 'guest-menu',
  device: 'desktop',
  selectedItemId: 1, // Smoky Paneer Tikka
  detailQty: 1,
  cart: [],
  activeOrderNumber: 'TF-1048',
  activeTableNumber: 'T04',
  activeSessionId: 1,
  queueToken: 'Q-018',
  queueName: 'Aarav Sharma',
  partySize: 3,
  queueCart: [],
  queueMode: 'after-seat',
  toastMessage: null,

  setScreen: (screen) => {
    set({ currentScreen: screen });
    const targetRoute = SCREEN_ROUTES[screen];
    if (targetRoute && globalNavigate) {
      globalNavigate(targetRoute);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  setDevice: (device) => set({ device }),

  setSelectedItem: (id) => set({ selectedItemId: id, detailQty: 1 }),

  setDetailQty: (qty) => set({ detailQty: Math.max(1, qty) }),

  addToCart: (newItem) => {
    const current = get().cart;
    const existing = current.find((x) => x.menuItemId === newItem.menuItemId);
    let updated: CartItem[];
    if (existing) {
      updated = current.map((x) =>
        x.menuItemId === newItem.menuItemId ? { ...x, qty: x.qty + newItem.qty } : x
      );
    } else {
      updated = [...current, newItem];
    }
    set({ cart: updated });
    get().showToast('Added to your table order');
  },

  updateCartQty: (menuItemId, delta) => {
    const current = get().cart;
    const updated = current
      .map((x) => (x.menuItemId === menuItemId ? { ...x, qty: x.qty + delta } : x))
      .filter((x) => x.qty > 0);
    set({ cart: updated });
  },

  removeFromCart: (menuItemId) => {
    set({ cart: get().cart.filter((x) => x.menuItemId !== menuItemId) });
    get().showToast('Item removed');
  },

  clearCart: () => set({ cart: [] }),

  setActiveOrderNumber: (orderNumber) => set({ activeOrderNumber: orderNumber }),

  setActiveTableNumber: (tableNumber) => set({ activeTableNumber: tableNumber }),

  setQueueToken: (token) => set({ queueToken: token }),

  setQueueName: (name) => set({ queueName: name }),

  setPartySize: (size) => set({ partySize: Math.max(1, Math.min(12, size)) }),

  addToQueueCart: (newItem) => {
    const current = get().queueCart;
    const existing = current.find((x) => x.menuItemId === newItem.menuItemId);
    let updated: CartItem[];
    if (existing) {
      updated = current.map((x) =>
        x.menuItemId === newItem.menuItemId ? { ...x, qty: x.qty + newItem.qty } : x
      );
    } else {
      updated = [...current, newItem];
    }
    set({ queueCart: updated });
    get().showToast('Added to advance order');
  },

  updateQueueCartQty: (menuItemId, delta) => {
    const current = get().queueCart;
    const updated = current
      .map((x) => (x.menuItemId === menuItemId ? { ...x, qty: x.qty + delta } : x))
      .filter((x) => x.qty > 0);
    set({ queueCart: updated });
  },

  setQueueMode: (mode) => set({ queueMode: mode }),

  showToast: (msg) => {
    set({ toastMessage: msg });
    setTimeout(() => {
      if (get().toastMessage === msg) {
        set({ toastMessage: null });
      }
    }, 3000);
  },

  triggerConfetti: () => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#ef6b4b', '#e8b64d', '#6d8b72', '#17221e'],
      });
    } catch {
      // ignore
    }
  },

  resetAll: () => {
    set({
      currentScreen: 'guest-menu',
      device: 'desktop',
      selectedItemId: 1,
      detailQty: 1,
      cart: [],
      activeOrderNumber: 'TF-1048',
      activeTableNumber: 'T04',
      queueToken: 'Q-018',
      queueName: 'Aarav Sharma',
      partySize: 3,
      queueCart: [],
      queueMode: 'after-seat',
      toastMessage: 'Prototype reset to sample data',
    });
  },
}));
