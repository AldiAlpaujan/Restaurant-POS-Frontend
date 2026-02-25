import type { CustomCellRendererProps } from 'ag-grid-react';

export default function AppLoadingCell(props: {
  loading: boolean;
  cellParams: CustomCellRendererProps;
  resolvers: (() => void)[];
}) {
  const { loading, cellParams, resolvers } = props;
  if (loading === false) {
    return cellParams.value;
  }
  return new Promise((resolve) => {
    resolvers.push(() => resolve(''));
  }).then(() => console.info(cellParams.value));
}
