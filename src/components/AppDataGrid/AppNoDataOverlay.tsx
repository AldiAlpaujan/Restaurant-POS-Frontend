import { Button } from '@mantine/core';
import type { CustomNoRowsOverlayProps } from 'ag-grid-react';

export default function AppNoDataOverlay(
  props: CustomNoRowsOverlayProps & { error: boolean; onTryAgain: () => void }
) {
  if (props.error) {
    return (
      <div>
        <span className="mb-2 block leading-7">Failed to load data!</span>
        <Button onClick={props.onTryAgain}>Try Again</Button>
      </div>
    );
  }

  return (
    <div>
      <span className="icon-[lucide--file-search] mb-2.5 h-12 w-12"></span>
      <h4 className="text-foreground scroll-m-20 text-lg tracking-tight">Oops... Data Not Found</h4>
    </div>
  );
}
