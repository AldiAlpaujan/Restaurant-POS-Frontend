import { type ReactNode } from 'react';
import { AppShell, Button } from '@mantine/core';
import { IconBan } from '@tabler/icons-react';
import { Link } from 'react-router';
import type { AppBreadcrumbsItem } from '@/components/AppLayout/Header/AppBreadcrumb';
import AppHeader from '@/components/AppLayout/Header/AppHeader';

interface AppPageProps {
  title?: string;
  hasAccess?: boolean;
  breadcrumbs: AppBreadcrumbsItem[];
  children: ReactNode;
}

export default function AppPage(props: AppPageProps) {
  return (
    <>
      {props.title && <title>{props.title}</title>}

      <AppShell.Header>
        <AppHeader breadcrumbs={props.breadcrumbs} />
      </AppShell.Header>

      <AppShell.Main className="h-dvh">
        {props.hasAccess ? (
          <div className="h-full w-full">{props.children}</div>
        ) : (
          <NotGuaranteedSection />
        )}
      </AppShell.Main>
    </>
  );
}

const NotGuaranteedSection = () => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4">
      <IconBan className="size-12 text-red-500" />
      <div className="flex flex-col items-center">
        <p className="text-center text-lg font-bold">Access Denied!</p>
        <p className="text-gray-text text-center">
          You do not have permission to access this page.
        </p>
      </div>
      <Button>
        <Link to={'/'}>Home</Link>
      </Button>
    </div>
  );
};
