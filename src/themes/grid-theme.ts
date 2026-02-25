import { themeQuartz } from 'ag-grid-community';

const gridTheme = themeQuartz.withParams({
  accentColor: 'var(--color-primary-filled)',
  fontFamily: 'var(--mantine-font-family)',
  headerVerticalPaddingScale: 0.8,
  rowVerticalPaddingScale: 1,
  columnBorder: true,
  rowBorder: true,
});

export default gridTheme;
