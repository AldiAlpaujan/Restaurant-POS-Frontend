import { type ReactNode } from 'react';
import { Text } from '@mantine/core';
import { AgGridReact, type AgGridReactProps } from 'ag-grid-react';
import gridTheme from '@/themes/grid-theme';

export interface AppFormGridProps extends AgGridReactProps {
  title?: string;
  leftSection?: ReactNode;
}

export default function AppFormGrid(props: AppFormGridProps) {
  return (
    <div>
      {props.title && <Text className="mb-2 text-lg font-bold">{props.title}</Text>}
      {props.leftSection && (
        <div className="mb-4 flex items-center gap-2.5">{props.leftSection}</div>
      )}
      <div className={`ag-grid-with-border mb-4`}>
        <AgGridReact
          {...props}
          enableCellTextSelection
          theme={gridTheme}
          rowData={props.rowData}
          columnDefs={props.columnDefs}
          columnTypes={props.columnTypes}
          defaultColDef={{ suppressMovable: true }}
          animateRows={false}
          domLayout={'autoHeight'}
        />
      </div>
    </div>
  );
}
