import { useState } from 'react';
import {
  Avatar,
  Divider,
  Group,
  NavLink,
  Popover,
  Skeleton,
  Text,
  UnstyledButton,
} from '@mantine/core';
import { IconChevronRight, IconLogout, type TablerIcon } from '@tabler/icons-react';
import { Link } from 'react-router';
import useIsMobile from '@/hooks/useIsMobile';
import { useAppLayoutContext } from '@/stores/AppLayoutContext';

export interface SideBarUserProps extends UserCardProps {
  userMenu: SideBarUserMenu[];
  onLogout: () => void;
}

export interface SideBarUserMenu {
  title: string;
  url: string;
  icon: TablerIcon;
}

interface UserCardProps {
  userAvatar?: string;
  userName: string;
  userEmail: string;
  isLoading: boolean;
}

export default function SideBarUser(props: SideBarUserProps) {
  const [opened, setOpened] = useState(false);
  return (
    <Popover width={230} position="right-start" shadow="lg" opened={opened} onChange={setOpened}>
      <Popover.Target>
        <ButtonTrigger
          userAvatar={props.userAvatar}
          userName={props.userName}
          userEmail={props.userEmail}
          isLoading={props.isLoading}
          onClick={() => setOpened((o) => !o)}
        />
      </Popover.Target>
      <Popover.Dropdown className="p-0">
        <UserCard
          asButton={false}
          userAvatar={props.userAvatar}
          userName={props.userName}
          userEmail={props.userEmail}
          isLoading={props.isLoading}
        />
        <Divider />
        <div className="p-1">
          {props.userMenu.map((item) => {
            return (
              <NavLink
                component={Link}
                to={item.url}
                key={item.title}
                label={item.title}
                color="blue"
                leftSection={<item.icon size={16} />}
                className="hover:bg-primary-filled/10 hover:text-primary-filled rounded-sm px-2 py-1 data-[active=true]:font-medium"
                classNames={{ children: 'flex flex-col gap-1 px-4' }}
                onClick={() => setOpened(false)}
              />
            );
          })}
        </div>
        <Divider />
        <div className="p-1">
          <NavLink
            label={'Log out'}
            color="red"
            leftSection={<IconLogout size={16} />}
            className="hover:bg-red-6/10 hover:text-red-6 text-red-6 rounded-sm px-2 py-1 data-[active=true]:font-medium"
            onClick={props.onLogout}
          />
        </div>
      </Popover.Dropdown>
    </Popover>
  );
}

const ButtonTrigger = (props: UserCardProps & { onClick: () => void }) => {
  const isMobile = useIsMobile();
  const { desktopOpened } = useAppLayoutContext();

  return (
    <UnstyledButton
      data-collapsed={!isMobile && !desktopOpened}
      {...props}
      className={
        'hover:bg-primary-filled/10 h-fit w-full py-1 pl-1 pr-4 data-[collapsed=true]:py-4 data-[collapsed=true]:pr-0'
      }
    >
      <Group>
        <div className="flex-1">
          <UserCard
            asButton
            userAvatar={props.userAvatar}
            userName={props.userName}
            userEmail={props.userEmail}
            isLoading={props.isLoading}
          />
        </div>
        {(isMobile || desktopOpened) && <IconChevronRight size={14} stroke={1.5} />}
      </Group>
    </UnstyledButton>
  );
};

const UserCard = (props: UserCardProps & { asButton: boolean }) => {
  const isMobile = useIsMobile();
  const { desktopOpened } = useAppLayoutContext();
  const isNotCollapsed = !props.asButton || isMobile || desktopOpened;

  if (props.isLoading) {
    return (
      <div className="flex h-fit items-center gap-2 p-3">
        <Skeleton height={40} width={40} radius="sm" />
        <div className="flex-1">
          <Skeleton height={14} radius="2" />
          <Skeleton height={12} mt={6} radius="2" width={'70%'} />
        </div>
      </div>
    );
  }

  return (
    <div
      data-collapsed={!isNotCollapsed}
      className="flex gap-2 p-3 data-[collapsed=true]:justify-center data-[collapsed=true]:p-0"
    >
      <Avatar src={props.userAvatar} name={props.userName} radius="sm" className="bg-gray-6/10" />
      {isNotCollapsed && (
        <div className="flex-1">
          <Text size="sm" fw={500} mb={2}>
            {props.userName}
          </Text>
          <Text c="dimmed" size="xs">
            {props.userEmail}
          </Text>
        </div>
      )}
    </div>
  );
};
