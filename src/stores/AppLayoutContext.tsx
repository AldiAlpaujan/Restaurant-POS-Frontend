/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useDisclosure } from '@mantine/hooks';
import authToken from '@/lib/auth-token';
import client, { api } from '@/lib/http-client';

export type AppProfile = {
  name: string;
  email: string;
  role: string;
  created_at: string;
};

interface ProviderValue {
  mobileOpened: boolean;
  desktopOpened: boolean;
  showOverlay: boolean;

  toggleMobile: () => void;
  toggleDesktop: () => void;
  setShowOverlay: (value: boolean) => void;

  profile: AppProfile | null;
  profileLoading: boolean;
}

const AppLayoutContext = createContext<ProviderValue | null>(null);
export const useAppLayoutContext = () => useContext(AppLayoutContext)!;

export default function AppLayoutProvider(props: { children: ReactNode }) {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(
    localStorage.getItem('desktopOpened') === 'true'
  );
  const [showOverlay, setShowOverlay] = useState(false);

  const isLogged = authToken.isLogged();
  const [profile, setProfile] = useState<AppProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(isLogged);

  useEffect(() => {
    if (!isLogged) return;
    client()
      .get<{ data: AppProfile }>(api.profile)
      .then((res) => setProfile(res.data?.data ?? (res.data as unknown as AppProfile)))
      .catch(() => null)
      .finally(() => setProfileLoading(false));
  }, []);

  const toggleMobileOverride = () => {
    if (showOverlay) {
      setShowOverlay(false);
      setTimeout(() => {
        toggleMobile();
      }, 200);
    } else {
      toggleMobile();
    }
  };

  useEffect(() => {
    if (mobileOpened) {
      setTimeout(() => {
        setShowOverlay(true);
      }, 100);
    }
  }, [mobileOpened]);

  useEffect(() => {
    localStorage.setItem('desktopOpened', desktopOpened.toString());
  }, [desktopOpened]);

  return (
    <AppLayoutContext.Provider
      value={{
        mobileOpened,
        desktopOpened,
        showOverlay,

        toggleMobile: toggleMobileOverride,
        toggleDesktop,
        setShowOverlay,

        profile,
        profileLoading,
      }}
    >
      {props.children}
    </AppLayoutContext.Provider>
  );
}