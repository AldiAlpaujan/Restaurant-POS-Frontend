import { Outlet, useNavigate } from "react-router";
import AppWrapper from "@/components/AppLayout/Wrapper/AppWrapper";
import AppLayoutProvider from "@/stores/AppLayoutContext";
import { sidebarMenu, userMenu } from "./menu";

export default function AppLayout() {
  const navigate = useNavigate();
  return (
    <AppLayoutProvider>
      <AppWrapper
        userMenu={userMenu}
        isLoading={false}
        userAvatar="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-8.png"
        userName={"Harriette Spoonlicker"}
        userEmail={"hspoonlicker@outlook.com"}
        sideBarMenu={sidebarMenu}
        onLogout={() => navigate("/auth/login")}
      >
        <Outlet />
      </AppWrapper>
    </AppLayoutProvider>
  );
}
