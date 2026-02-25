/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useDisclosure } from '@mantine/hooks';

interface ProviderValue {
  mobileOpened: boolean;
  desktopOpened: boolean;
  showOverlay: boolean;

  toggleMobile: () => void;
  toggleDesktop: () => void;
  setShowOverlay: (value: boolean) => void;
}

const AppLayoutContext = createContext<ProviderValue | null>(null);
export const useAppLayoutContext = () => useContext(AppLayoutContext)!;
export default function AppLayoutProvider(props: { children: ReactNode }) {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(
    localStorage.getItem('desktopOpened') === 'true'
  );
  const [showOverlay, setShowOverlay] = useState(false);

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
      }}
    >
      {props.children}
    </AppLayoutContext.Provider>
  );
}
