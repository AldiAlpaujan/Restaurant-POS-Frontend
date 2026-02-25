import { notifications } from '@mantine/notifications';

const success = ({
  title = 'Success',
  message,
  onClick,
}: {
  title?: string | null;
  message: string;
  onClick?: (() => void) | null;
}): string => {
  return notifications.show({
    title,
    message,
    radius: 'xs',
    position: 'top-right',
    color: 'green',
    onClick: () => onClick?.(),
  });
};

const warning = ({
  title = 'Warning',
  message,
  onClick,
}: {
  title?: string | null;
  message: string;
  onClick?: (() => void) | null;
}): string => {
  return notifications.show({
    title,
    message,
    radius: 'xs',
    position: 'top-right',
    color: 'orange',
    onClick: () => onClick?.(),
  });
};

const info = ({
  title = 'Information',
  message,
  onClick,
}: {
  title?: string | null;
  message: string;
  onClick?: (() => void) | null;
}): string => {
  return notifications.show({
    title,
    message,
    radius: 'xs',
    position: 'top-right',
    color: 'blue',
    onClick: () => onClick?.(),
  });
};

const error = ({
  title = 'Error',
  message,
  onClick,
}: {
  title?: string | null;
  message: string;
  onClick?: (() => void) | null;
}): string => {
  return notifications.show({
    title,
    message,
    radius: 'xs',
    position: 'top-right',
    color: 'red',
    onClick: () => onClick?.(),
  });
};

const hide = (id: string) => {
  notifications.hide(id);
};

export const toastUtils = {
  success,
  warning,
  info,
  error,
  hide,
};
