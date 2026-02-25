import { Breadcrumbs } from '@mantine/core';
import { IconChevronRight, IconDots } from '@tabler/icons-react';
import { Link } from 'react-router';
import { Fragment } from 'react/jsx-runtime';
import useIsMobile from '@/hooks/useIsMobile';

export interface AppBreadcrumbsProps {
  items: AppBreadcrumbsItem[];
}

export interface AppBreadcrumbsItem {
  title: string;
  link?: string | null;
  ellipsis?: boolean;
}

export default function AppBreadcrumb(props: AppBreadcrumbsProps) {
  const isMobile = useIsMobile();

  function getBreadcrumbItems(): AppBreadcrumbsItem[] {
    const length = props.items.length;
    if (isMobile) {
      if (length > 2) {
        return [
          props.items[0],
          { ...props.items[length - 2], ellipsis: true },
          props.items[length - 1],
        ];
      } else {
        return props.items;
      }
    } else {
      if (length > 3) {
        return [
          props.items[0],
          { ...props.items[length - 3], ellipsis: true },
          props.items[length - 2],
          props.items[length - 1],
        ];
      } else {
        return props.items;
      }
    }
  }

  return (
    <Breadcrumbs separator={<IconChevronRight stroke={2} className="size-4" />}>
      {getBreadcrumbItems().map((item, index) => {
        return (
          <Fragment key={index}>
            {item.ellipsis ? (
              <Link to={item.link!}>
                <span
                  data-slot="breadcrumb-ellipsis"
                  role="presentation"
                  aria-hidden="true"
                  className={'text-gray-text flex size-9 items-center justify-center'}
                >
                  <IconDots stroke={2} className="size-4" />
                </span>
              </Link>
            ) : item.link ? (
              <Link to={item.link} className="text-gray-text text-sm">
                {item.title}
              </Link>
            ) : (
              <span
                data-slot="breadcrumb-page"
                role="link"
                aria-disabled="true"
                aria-current="page"
                className={'text-sm font-medium'}
              >
                {item.title}
              </span>
            )}
          </Fragment>
        );
      })}
    </Breadcrumbs>
  );
}
