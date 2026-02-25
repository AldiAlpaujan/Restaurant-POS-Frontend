import {
  IconLayoutDashboard,
  IconToolsKitchen2,
  IconClipboardList,
  IconUser,
} from '@tabler/icons-react';
import type { SideBarMenuItem } from '@/components/AppLayout/SideBar/MenuItem';
import type { SideBarUserMenu } from '@/components/AppLayout/SideBar/SideBarUser';

export const sidebarMenu: SideBarMenuItem[] = [
  { title: 'Dashboard', url: '/', icon: IconLayoutDashboard },
  { title: 'Master Food', url: '/master-food', icon: IconToolsKitchen2 },
  { title: 'Order', url: '/order', icon: IconClipboardList },
];

export const userMenu: SideBarUserMenu[] = [
  {
    title: 'Profile',
    url: '/profile',
    icon: IconUser,
  },
];
