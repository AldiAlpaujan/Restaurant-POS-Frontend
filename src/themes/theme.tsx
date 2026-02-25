import {
  ActionIcon,
  Button,
  Checkbox,
  createTheme,
  NumberInput,
  Paper,
  TextInput,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { IconCalendarWeek } from "@tabler/icons-react";
import variantColorResolver from "./variant-color-resolver";

const theme = createTheme({
  fontFamily: "Lexend, sans-serif, system-ui",
  primaryColor: "blue",
  defaultRadius: "md",
  colors: {},
  breakpoints: {
    xs: "28rem",
    sm: "40rem",
    md: "48rem",
    lg: "64rem",
    xl: "80rem",
    "2xl": "96rem",
  },
  radius: {
    xs: "0.25rem",
    sm: "0.375rem",
    md: "0.5rem",
    lg: "0.625rem",
    xl: "0.875rem",
  },
  variantColorResolver: variantColorResolver,
  components: {
    Button: Button.extend({
      classNames: {
        root: "transition-all duration-200 ease-in-out data-[variant='danger']:bg-red-6 data-[variant='danger']:hover:bg-red-7",
        label: "font-medium",
      },
    }),
    ActionIcon: ActionIcon.extend({
      classNames: {
        root: "transition-all duration-200 ease-in-out data-[variant='danger']:bg-red-6 data-[variant='danger']:hover:bg-red-7",
        icon: "w-[65%] h-[65%]",
      },
    }),
    Paper: Paper.extend({
      defaultProps: {
        shadow: "xs",
      },
    }),
    TextInput: TextInput.extend({
      classNames: {
        error: "mt-1 ml-1",
      },
    }),
    NumberInput: NumberInput.extend({
      defaultProps: {
        hideControls: true,
      },
    }),
    DateInput: DateInput.extend({
      defaultProps: {
        rightSection: (
          <IconCalendarWeek size={22} stroke={1.6} className="text-gray-5" />
        ),
        valueFormat: "YYYY-MM-DD",
        type: "date",
      },
      classNames: {
        input: "text-sm",
        error: "mt-1 ml-1",
      },
    }),
    Checkbox: Checkbox.extend({
      defaultProps: {
        radius: "sm",
      },
      classNames: {
        label: "p-0 pl-2",
      },
    }),
  },
});

export default theme;
