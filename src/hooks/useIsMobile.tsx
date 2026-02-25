import { useMediaQuery } from '@mantine/hooks';

export default function useIsMobile() {
  const isMobile = useMediaQuery('(max-width: 40rem)');
  return isMobile;
}
