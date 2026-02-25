import { useState } from 'react';
import { NavLink, Popover, Tooltip } from '@mantine/core';
import { Link } from 'react-router';
import useIsMobile from '@/hooks/useIsMobile';
import { useAppLayoutContext } from '@/stores/AppLayoutContext';
import type { SideBarMenuItem, SideBarSubMenuItem } from './MenuItem';

const MenuItem = ({
  item,
  active,
  activeMenu,
}: {
  item: SideBarMenuItem;
  active: boolean;
  activeMenu: string | null;
}) => {
  const isMobile = useIsMobile();
  const { desktopOpened, toggleMobile } = useAppLayoutContext();
  const [open, setOpen] = useState(false);

  return (
    <Popover
      opened={open}
      onChange={setOpen}
      disabled={isMobile || desktopOpened || !item.children}
      withArrow
      position="right-start"
      shadow="lg"
    >
      <Popover.Target>
        <Tooltip
          label={item.title}
          position="right"
          withArrow
          arrowSize={7}
          offset={10}
          disabled={desktopOpened}
          className="text-xs"
        >
          <NavLink
            data-collapsed={!isMobile && !desktopOpened}
            active={active}
            component={!item.children ? Link : undefined}
            to={item.url ?? ''}
            label={item.title}
            variant={item.children && desktopOpened ? 'subtle' : 'light'}
            leftSection={<item.icon size={20} />}
            className={`${!isMobile && !desktopOpened ? 'mb-1' : ''} hover:bg-primary-filled/10 hover:text-primary-filled rounded-sm py-2 data-[active=true]:font-medium`}
            classNames={{
              root: 'group data-[collapsed=true]:py-2.5 data-[collapsed=true]:w-11',
              section: 'group-data-[collapsed=true]:mr-0',
              label: 'group-data-[collapsed=true]:hidden',
              children: 'flex flex-col gap-1 px-4 relative',
            }}
            onClick={
              isMobile
                ? !item.children
                  ? toggleMobile
                  : undefined
                : desktopOpened
                  ? undefined
                  : () => setOpen(!open)
            }
          >
            {(isMobile && item.children) || (desktopOpened && item.children) ? (
              <>
                <div className="bg-gray-3 absolute ml-1.5 h-full w-px" />
                <SubMenuItem items={item.children!} activeMenu={activeMenu} />
              </>
            ) : null}
          </NavLink>
        </Tooltip>
      </Popover.Target>
      <Popover.Dropdown className="px-1 py-2">
        <SubMenuItem
          items={item.children!}
          activeMenu={activeMenu}
          onMenuClick={() => setOpen(false)}
        />
      </Popover.Dropdown>
    </Popover>
  );
};

const SubMenuItem = ({
  items,
  activeMenu,
  onMenuClick,
}: {
  items: SideBarSubMenuItem[];
  activeMenu: string | null;
  onMenuClick?: () => void;
}) => {
  const isMobile = useIsMobile();
  const { desktopOpened, toggleMobile } = useAppLayoutContext();
  return (
    <>
      {items.map((subMenu) => {
        const active = subMenu.title === activeMenu;
        return (
          <NavLink
            key={subMenu.title}
            active={active}
            variant="light"
            component={Link}
            to={subMenu.url ?? ''}
            label={subMenu.title}
            className="hover:bg-primary-filled/10 hover:text-primary-filled rounded-sm py-1.5 data-[active=true]:font-medium"
            classNames={{
              root: isMobile || desktopOpened ? 'mx-5 ' : '',
            }}
            onClick={isMobile ? toggleMobile : onMenuClick}
          />
        );
      })}
    </>
  );
};

export default MenuItem;
