import type { ReactNode } from 'react';
import { AppShell } from '@mantine/core';
import { useAppLayoutContext } from '@/stores/AppLayoutContext';
import AppSideBar, { type AppBarProps } from '../SideBar/AppSideBar';

interface AppWrapper extends AppBarProps {
  children: ReactNode;
}

export default function AppWrapper(props: AppWrapper) {
  const { mobileOpened, desktopOpened, showOverlay, toggleMobile } = useAppLayoutContext();

  return (
    <AppShell
      layout="alt"
      padding={0}
      header={{ height: 64, collapsed: false, offset: true }}
      navbar={{
        width: desktopOpened ? 300 : 80,
        breakpoint: 'sm',
        collapsed: { mobile: !mobileOpened },
      }}
    >
      <AppShell.Navbar withBorder={false} className="bg-transparent">
        <div className="relative h-full w-full">
          <div
            onClick={toggleMobile}
            className={`absolute h-full w-full ${showOverlay ? 'bg-black/50' : 'bg-transparent'} transition-all duration-300 ease-in-out`}
          />
          <AppSideBar {...props} />
        </div>
      </AppShell.Navbar>

      {props.children}
    </AppShell>
  );
}
