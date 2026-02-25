import { type ActionIconVariant, type ButtonVariant } from '@mantine/core';

type ExtendedButtonVariant = ButtonVariant | 'filter-cancel';

type ExtendedActionIconVariant =
  | ActionIconVariant
  | 'grid-action'
  | 'grid-action-view'
  | 'grid-action-edit'
  | 'grid-action-delete';

declare module '@mantine/core' {
  export interface ActionIconProps {
    variant?: ExtendedActionIconVariant;
  }

  export interface ButtonProps {
    variant?: ExtendedButtonVariant;
  }
}
