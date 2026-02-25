import { type TablerIcon } from '@tabler/icons-react';
import useActiveMenu from '@/hooks/useActiveMenu';
import useIsMobile from '@/hooks/useIsMobile';
import { useAppLayoutContext } from '@/stores/AppLayoutContext';
import MenuItem from './SideBarMenuItem';

export interface SideBarMenuItem {
  title: string;
  url: string;
  icon: TablerIcon;
  roles?: string[];
  feature?: string;
  features?: string[];
  children?: SideBarSubMenuItem[];
}

export interface SideBarSubMenuItem {
  title: string;
  url: string;
  roles?: string[];
  feature?: string;
}

export default function SideBarMenu({ menus }: { menus: SideBarMenuItem[] }) {
  const isMobile = useIsMobile();
  const activeMenu = useActiveMenu(menus);
  const { desktopOpened } = useAppLayoutContext();

  return (
    <div
      data-collapsed={!isMobile && !desktopOpened}
      className="flex flex-col gap-1 px-4 data-[collapsed=true]:gap-0"
    >
      {menus.map((item) => {
        let active = activeMenu === item.title;
        const menu = menus.find((elm) => elm.title === activeMenu);
        if (!menu && item.children) {
          const menu = item.children.find((elm) => elm.title === activeMenu);
          active = activeMenu === menu?.title;
        }
        return <MenuItem key={item.title} item={item} active={active} activeMenu={activeMenu} />;
      })}
    </div>
  );
}
