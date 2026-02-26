import { createBrowserRouter, Navigate, Outlet } from 'react-router';
import AppLayout from '@/layouts/AppLayout';
import AuthLayout from '@/layouts/AuthLayout';
import authToken from '@/lib/auth-token';

export function lazyPage(importFn: () => Promise<{ default: React.ComponentType<any> }>) {
  return async () => {
    const Component = await importFn();
    return { Component: Component.default };
  };
}

function RequireAuth() {
  if (!authToken.isLogged()) return <Navigate to="/auth/login" replace />;
  return <Outlet />;
}

const router = createBrowserRouter([
  {
    path: '/auth',
    Component: AuthLayout,
    children: [
      {
        index: true,
        element: <Navigate to={'login'} />,
      },
      {
        path: 'login',
        lazy: lazyPage(() => import('@/pages/auth/LoginPage')),
      },
    ],
  },
  {
    path: '/',
    Component: AppLayout,
    children: [
      // Public: guests can view the dashboard
      {
        index: true,
        lazy: lazyPage(() => import('@/pages/dashboard/DashboardPage')),
      },
      // Protected: require login
      {
        Component: RequireAuth,
        children: [
          {
            path: 'master-food',
            lazy: lazyPage(() => import('@/pages/master-food/MasterFoodPage')),
          },
          {
            path: 'order',
            lazy: lazyPage(() => import('@/pages/order/ListOrderPage/ListOrderPage')),
          },
          {
            path: 'order/create',
            lazy: lazyPage(() => import('@/pages/order/CreateOrderPage/CreateOrderPage')),
          },
          {
            path: 'order/:id',
            lazy: lazyPage(() => import('@/pages/order/DetailOrderPage/DetailOrderPage')),
          },
          {
            path: 'profile',
            lazy: lazyPage(() => import('@/pages/profile/ProfilePage')),
          },
        ],
      },
    ],
  },
]);

export default router;
