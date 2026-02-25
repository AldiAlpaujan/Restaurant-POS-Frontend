import { ActionIcon, Divider } from '@mantine/core';
import useIsMobile from '@/hooks/useIsMobile';
import { useAppLayoutContext } from '@/stores/AppLayoutContext';
import AppBreadcrumb, { type AppBreadcrumbsItem } from './AppBreadcrumb';

export default function AppHeader(props: { breadcrumbs: AppBreadcrumbsItem[] }) {
  const isMobile = useIsMobile();
  const { toggleMobile, toggleDesktop } = useAppLayoutContext();
  return (
    <div className="flex h-full items-center gap-2 px-4">
      <ActionIcon
        variant="transparent"
        color="gray"
        aria-label="Toggle navigation"
        onClick={isMobile ? toggleMobile : toggleDesktop}
      >
        <span className="icon-[proicons--panel-left-open] size-6" />
      </ActionIcon>
      <Divider size="xs" orientation="vertical" className="my-5" />
      <AppBreadcrumb items={props.breadcrumbs} />
    </div>
  );
}
