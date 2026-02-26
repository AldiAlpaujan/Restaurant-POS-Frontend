import { type ReactNode } from 'react';
import { ActionIcon } from '@mantine/core';
import { IconFilter, IconRefresh } from '@tabler/icons-react';
import { type ColDef } from 'ag-grid-community';
import { AgGridReact, type AgGridReactProps } from 'ag-grid-react';
import useIsMobile from '@/hooks/useIsMobile';
import { useMatchWidth } from '@/hooks/useMatchWidth';
import gridTheme from '@/themes/grid-theme';
import AppSearchFilter from '../Shared/AppSearchFilter';
import type { AppGridFooterProps } from './AppGridFooter';
import AppGridFooter from './AppGridFooter';

export interface AppDataGridSettings {
  showHeader?: boolean;
  showSearch?: boolean;
  showFilter?: boolean;
  withBorder?: boolean;

  leftAction?: ReactNode;
  rightAction?: ReactNode;
}

export interface AppDataGridProps extends AgGridReactProps {
  settings: AppDataGridSettings & {
    hasFilter: boolean;

    onRefresh: () => void;
    onSearch: (value: string) => void;
    onFilter: () => void;
  } & AppGridFooterProps;
}

export default function AppDataGrid(props: AppDataGridProps) {
  const { settings, ...gridOption } = props;
  const isMatch = useMatchWidth(1000);
  const isMobile = useIsMobile();

  const isAllFlex = gridOption.defaultColDef?.flex !== undefined;
  const newOption: AgGridReactProps = {
    ...gridOption,
    columnDefs: gridOption.columnDefs!.map((col) => {
      const isColDef = (col: object): col is ColDef => {
        return 'field' in col || 'valueGetter' in col || 'headerName' in col;
      };
      if (isColDef(col)) {
        const isAction = col.headerName === 'Aksi';
        return {
          ...col,
          pinned: !isAction ? col.pinned : isMobile ? false : col.pinned,
          flex: col.flex !== undefined ? (isMatch ? 0 : col.flex) : undefined,
        };
      }
      return col;
    }),
    defaultColDef: {
      ...gridOption.defaultColDef,
      flex: isAllFlex ? (isMatch ? 0 : gridOption.defaultColDef?.flex) : undefined,
    },
  };
  return (
    <div
      data-withBorder={settings.withBorder}
      className="flex h-full w-full flex-col gap-0 overflow-clip data-[withBorder='true']:rounded-md data-[withBorder='true']:border data-[withBorder='true']:border-[#d1d5db]"
    >
      {settings.showHeader === true && (
        <div className="xs:flex-row xs:items-center xs:justify-between flex h-fit w-full flex-col gap-2.5 bg-transparent p-3">
          <div className="xs:flex-row xs:items-center flex flex-col items-stretch gap-2.5">
            {settings.leftAction}
          </div>
          <div className="flex items-center justify-center gap-2.5">
            {settings.showSearch === true && <AppSearchFilter onChange={settings.onSearch} />}
            <ActionIcon variant="light" size={'lg'} onClick={settings.onRefresh}>
              <IconRefresh size={20} />
            </ActionIcon>
            {settings.showFilter && (
              <div className="relative h-fit">
                <ActionIcon variant="light" size={'lg'} onClick={settings.onFilter}>
                  <IconFilter size={20} />
                </ActionIcon>
                {settings.hasFilter && (
                  <div className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full bg-red-500" />
                )}
              </div>
            )}
            {settings.rightAction}
          </div>
        </div>
      )}
      <div className="flex-1">
        <AgGridReact
          animateRows={false}
          theme={gridTheme.withParams({
            wrapperBorder: settings.showHeader,
            wrapperBorderRadius: 0,
          })}
          {...newOption}
          defaultColDef={{ suppressMovable: true }}
        />
      </div>
      {props.pagination && <AppGridFooter {...settings} />}
    </div>
  );
}
