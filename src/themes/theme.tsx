import {
  ActionIcon,
  Button,
  Checkbox,
  createTheme,
  FileInput,
  NumberInput,
  Paper,
  TextInput,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { IconCalendarWeek, IconFileText } from '@tabler/icons-react';
import variantColorResolver from './variant-color-resolver';

const theme = createTheme({
  fontFamily: 'Lexend, Times New Roma, sans-serif, system-ui',
  primaryColor: 'blue',
  defaultRadius: 'md',
  colors: {},
  breakpoints: {
    xs: '28rem', // 448px
    sm: '40rem', // 640px
    md: '48rem', // 768px
    lg: '64rem', // 1024px
    xl: '80rem', // 1280px
    '2xl': '96rem', // 1536px
  },
  radius: {
    xs: '0.25rem', // 4px
    sm: '0.375rem', // 6px
    md: '0.5rem', // 8px
    lg: '0.625rem', // 10px
    xl: '0.875rem', // 14px
  },
  variantColorResolver: variantColorResolver,
  components: {
    Button: Button.extend({
      classNames: {
        root: "transition-all duration-200 ease-in-out data-[variant='danger']:bg-red-6 data-[variant='danger']:hover:bg-red-7",
        label: 'font-medium',
      },
      vars: (_, props) => {
        if (props.size === 'compact-xs') {
          return {
            root: {
              '--button-radius': 'var(--mantine-radius-sm)',
              '--button-fz': '10px',
            },
          };
        }

        return { root: {} };
      },
    }),
    ActionIcon: ActionIcon.extend({
      classNames: {
        root: "transition-all duration-200 ease-in-out data-[variant='danger']:bg-red-6 data-[variant='danger']:hover:bg-red-7",
        icon: 'w-[65%] h-[65%]',
      },
    }),
    Paper: Paper.extend({
      defaultProps: {
        shadow: 'xs',
      },
    }),
    TextInput: TextInput.extend({
      classNames: {
        error: 'mt-1 ml-1',
      },
    }),
    NumberInput: NumberInput.extend({
      defaultProps: {
        hideControls: true,
      },
    }),
    FileInput: FileInput.extend({
      defaultProps: {
        rightSection: <IconFileText size={22} stroke={1.6} className="text-gray-5" />,
      },
    }),
    DateInput: DateInput.extend({
      defaultProps: {
        rightSection: <IconCalendarWeek size={22} stroke={1.6} className="text-gray-5" />,
        valueFormat: 'YYYY-MM-DD',
        type: 'date',
      },
      classNames: {
        input: 'text-sm',
        error: 'mt-1 ml-1',
      },
    }),
    Checkbox: Checkbox.extend({
      defaultProps: {
        radius: 'sm',
      },
      classNames: {
        label: 'p-0 pl-2',
      },
    }),
  },
});

export default theme;
