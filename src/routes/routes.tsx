import { createBrowserRouter, Navigate } from "react-router";
import AppLayout from "@/layouts/AppLayout";
import AuthLayout from "@/layouts/AuthLayout";

export function lazyPage(
  importFn: () => Promise<{ default: React.ComponentType<any> }>,
) {
  return async () => {
    const Component = await importFn();
    return { Component: Component.default };
  };
}

const router = createBrowserRouter([
  {
    path: "/auth",
    Component: AuthLayout,
    children: [
      {
        index: true,
        element: <Navigate to={"login"} />,
      },
      {
        path: "login",
        lazy: lazyPage(() => import("@/pages/auth/LoginPage")),
      },
    ],
  },
  {
    path: "/",
    Component: AppLayout,
    children: [
      {
        index: true,
        lazy: lazyPage(() => import("@/pages/dashboard/DashboardPage")),
      },
      {
        path: "master-food",
        lazy: lazyPage(() => import("@/pages/master-food/MasterFoodPage")),
      },
      {
        path: "order",
        lazy: lazyPage(() => import("@/pages/order/ListOrderPage")),
      },
      {
        path: "/order/create",
        lazy: lazyPage(() => import("@/pages/order/CreateOrderPage")),
      },
      {
        path: "/order/:id",
        lazy: lazyPage(() => import("@/pages/order/DetailOrderPage")),
      },
      {
        path: "profile",
        lazy: lazyPage(() => import("@/pages/profile/ProfilePage")),
      },
    ],
  },
]);

export default router;
