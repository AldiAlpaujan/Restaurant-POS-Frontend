import { AppShell, ScrollArea } from '@mantine/core';
import type { SideBarMenuItem } from './MenuItem';
import SideBarMenu from './MenuItem';
import SideBarHeader from './SideBarHeader';
import SideBarUser, { type SideBarUserProps } from './SideBarUser';

export interface AppBarProps extends SideBarUserProps {
  sideBarMenu: SideBarMenuItem[];
}

export default function AppSideBar(props: AppBarProps) {
  return (
    <div className="xs:w-[70%] border-app-shell-border sm:bg-sidebar absolute flex h-full w-[80%] flex-col overflow-clip border-r bg-white sm:w-full">
      <AppShell.Section className="mb-5">
        <SideBarHeader />
      </AppShell.Section>
      <AppShell.Section grow component={ScrollArea}>
        <SideBarMenu menus={props.sideBarMenu} />
      </AppShell.Section>
      <AppShell.Section>
        <SideBarUser
          isLoading={props.isLoading}
          userMenu={props.userMenu}
          onLogout={props.onLogout}
          userAvatar={props.userAvatar}
          userName={props.userName}
          userEmail={props.userEmail}
        />
      </AppShell.Section>
    </div>
  );
}
