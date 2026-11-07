import React, { useEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  useDineFlowStore,
  registerGlobalNavigate,
  ROUTE_TO_SCREEN,
} from './store/useDineFlowStore';

// Layouts
import { CustomerLayout } from './components/layout/CustomerLayout';
import { AdminLayout } from './components/layout/AdminLayout';
import { OperationsLayout } from './components/layout/OperationsLayout';

// Landing Hub
import { LandingHub } from './screens/LandingHub';

// All 21 Project Screens
import { Screen1GuestMenu } from './screens/Screen1GuestMenu';
import { Screen2DishDetails } from './screens/Screen2DishDetails';
import { Screen3Cart } from './screens/Screen3Cart';
import { Screen4Checkout } from './screens/Screen4Checkout';
import { Screen5OrderTracking } from './screens/Screen5OrderTracking';
import { Screen6BillPayment } from './screens/Screen6BillPayment';
import { Screen7QueueJoin } from './screens/Screen7QueueJoin';
import { Screen8QueueStatus } from './screens/Screen8QueueStatus';
import { Screen9AdvanceOrder } from './screens/Screen9AdvanceOrder';
import { Screen10HostConsole } from './screens/Screen10HostConsole';
import { Screen11LiveFloorPlan } from './screens/Screen11LiveFloorPlan';
import { Screen12TableSession } from './screens/Screen12TableSession';
import { Screen13KitchenDisplay } from './screens/Screen13KitchenDisplay';
import { Screen14WaiterRunner } from './screens/Screen14WaiterRunner';
import { Screen15OwnerOverview } from './screens/Screen15OwnerOverview';
import { Screen16MenuStudio } from './screens/Screen16MenuStudio';
import { Screen17TablesQr } from './screens/Screen17TablesQr';
import { Screen18AllOrders } from './screens/Screen18AllOrders';
import { Screen19StaffRoles } from './screens/Screen19StaffRoles';
import { Screen20Analytics } from './screens/Screen20Analytics';
import { Screen21Settings } from './screens/Screen21Settings';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5000,
    },
  },
});

// Synchronizes router navigation with store actions
const RouterSync: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    registerGlobalNavigate((path: string) => {
      navigate(path);
    });
    return () => registerGlobalNavigate(null);
  }, [navigate]);

  return null;
};

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <RouterSync />
        <Routes>
          {/* Landing Portal Hub */}
          <Route path="/" element={<LandingHub />} />

          {/* Customer Ordering Portal */}
          <Route
            path="/menu"
            element={
              <CustomerLayout>
                <Screen1GuestMenu />
              </CustomerLayout>
            }
          />
          <Route
            path="/r/:slug/t/:qrToken"
            element={
              <CustomerLayout>
                <Screen1GuestMenu />
              </CustomerLayout>
            }
          />
          <Route
            path="/table/:tableNumber"
            element={
              <CustomerLayout>
                <Screen1GuestMenu />
              </CustomerLayout>
            }
          />
          <Route
            path="/item"
            element={
              <CustomerLayout>
                <Screen2DishDetails />
              </CustomerLayout>
            }
          />
          <Route
            path="/item/:dishId"
            element={
              <CustomerLayout>
                <Screen2DishDetails />
              </CustomerLayout>
            }
          />
          <Route
            path="/cart"
            element={
              <CustomerLayout>
                <Screen3Cart />
              </CustomerLayout>
            }
          />
          <Route
            path="/checkout"
            element={
              <CustomerLayout>
                <Screen4Checkout />
              </CustomerLayout>
            }
          />
          <Route
            path="/order-tracking"
            element={
              <CustomerLayout>
                <Screen5OrderTracking />
              </CustomerLayout>
            }
          />
          <Route
            path="/orders/:orderNumber"
            element={
              <CustomerLayout>
                <Screen5OrderTracking />
              </CustomerLayout>
            }
          />
          <Route
            path="/bill"
            element={
              <CustomerLayout>
                <Screen6BillPayment />
              </CustomerLayout>
            }
          />
          <Route
            path="/table/:tableNumber/bill"
            element={
              <CustomerLayout>
                <Screen6BillPayment />
              </CustomerLayout>
            }
          />

          {/* Customer Waitlist Portal */}
          <Route
            path="/waitlist"
            element={
              <CustomerLayout>
                <Screen7QueueJoin />
              </CustomerLayout>
            }
          />
          <Route
            path="/waitlist/join"
            element={
              <CustomerLayout>
                <Screen7QueueJoin />
              </CustomerLayout>
            }
          />
          <Route
            path="/waitlist/status"
            element={
              <CustomerLayout>
                <Screen8QueueStatus />
              </CustomerLayout>
            }
          />
          <Route
            path="/waitlist/:ticketToken"
            element={
              <CustomerLayout>
                <Screen8QueueStatus />
              </CustomerLayout>
            }
          />
          <Route
            path="/waitlist/order"
            element={
              <CustomerLayout>
                <Screen9AdvanceOrder />
              </CustomerLayout>
            }
          />
          <Route
            path="/waitlist/:ticketToken/order"
            element={
              <CustomerLayout>
                <Screen9AdvanceOrder />
              </CustomerLayout>
            }
          />

          {/* Kitchen Display System (KDS) */}
          <Route
            path="/kitchen"
            element={
              <OperationsLayout
                title="Kitchen KDS"
                subtitle="Live Preparation & Order Routing Station"
              >
                <Screen13KitchenDisplay />
              </OperationsLayout>
            }
          />
          <Route
            path="/kds"
            element={
              <OperationsLayout
                title="Kitchen KDS"
                subtitle="Live Preparation & Order Routing Station"
              >
                <Screen13KitchenDisplay />
              </OperationsLayout>
            }
          />

          {/* Waiter & Service Runner Board */}
          <Route
            path="/waiter"
            element={
              <OperationsLayout
                title="Waiter / Runner"
                subtitle="Ready Order Dispatch & Table Service Alerts"
              >
                <Screen14WaiterRunner />
              </OperationsLayout>
            }
          />
          <Route
            path="/runner"
            element={
              <OperationsLayout
                title="Waiter / Runner"
                subtitle="Ready Order Dispatch & Table Service Alerts"
              >
                <Screen14WaiterRunner />
              </OperationsLayout>
            }
          />

          {/* Host Front of House Console */}
          <Route
            path="/host"
            element={
              <OperationsLayout
                title="Host Desk"
                subtitle="Waitlist Queue & Table Seating Management"
              >
                <Screen10HostConsole />
              </OperationsLayout>
            }
          />

          {/* Restaurant Management SaaS Portal */}
          <Route
            path="/admin"
            element={
              <AdminLayout>
                <Screen15OwnerOverview />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/overview"
            element={
              <AdminLayout>
                <Screen15OwnerOverview />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/floor-plan"
            element={
              <AdminLayout>
                <Screen11LiveFloorPlan />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/table-session"
            element={
              <AdminLayout>
                <Screen12TableSession />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/table-session/:tableId"
            element={
              <AdminLayout>
                <Screen12TableSession />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/menu"
            element={
              <AdminLayout>
                <Screen16MenuStudio />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/tables"
            element={
              <AdminLayout>
                <Screen17TablesQr />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <AdminLayout>
                <Screen18AllOrders />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/team"
            element={
              <AdminLayout>
                <Screen19StaffRoles />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/analytics"
            element={
              <AdminLayout>
                <Screen20Analytics />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <AdminLayout>
                <Screen21Settings />
              </AdminLayout>
            }
          />

          {/* Fallback to Hub */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
