import { Outlet, useNavigate } from 'react-router';
import AppWrapper from '@/components/AppLayout/Wrapper/AppWrapper';
import authToken from '@/lib/auth-token';
import client, { api } from '@/lib/http-client';
import AppLayoutProvider, { useAppLayoutContext } from '@/stores/AppLayoutContext';
import { sidebarMenu, userMenu } from './menu';

function AppLayoutInner() {
  const navigate = useNavigate();
  const isLogged = authToken.isLogged();
  const { profile, profileLoading } = useAppLayoutContext();

  async function onLogout() {
    try {
      await client().post(api.logout);
    } catch {
      // ignore — clear token regardless
    }
    authToken.clearToken();
    navigate('/auth/login');
  }

  const visibleMenu = isLogged ? sidebarMenu : sidebarMenu.filter((m) => m.url === '/');
  const visibleUserMenu = isLogged ? userMenu : [];

  return (
    <AppWrapper
      userMenu={visibleUserMenu}
      isLoading={profileLoading}
      userName={profile?.name ?? 'Guest'}
      userEmail={profile?.email ?? 'Tidak login'}
      sideBarMenu={visibleMenu}
      onLogout={isLogged ? onLogout : () => navigate('/auth/login')}
    >
      <Outlet />
    </AppWrapper>
  );
}

export default function AppLayout() {
  return (
    <AppLayoutProvider>
      <AppLayoutInner />
    </AppLayoutProvider>
  );
}
