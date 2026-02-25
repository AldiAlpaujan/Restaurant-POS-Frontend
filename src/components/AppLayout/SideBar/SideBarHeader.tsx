import { Image } from '@mantine/core';
import lgLogo from '@/assets/lg-app-logo.svg';
import smLogo from '@/assets/sm-app-logo.svg';
import useIsMobile from '@/hooks/useIsMobile';
import { useAppLayoutContext } from '@/stores/AppLayoutContext';

export default function SideBarHeader() {
  const isMobile = useIsMobile();
  const { desktopOpened } = useAppLayoutContext();
  return (
    <div className="ml-4 mt-4 h-12 w-full bg-transparent">
      <Image
        src={isMobile ? lgLogo : desktopOpened ? lgLogo : smLogo}
        alt="logo"
        className="h-full w-full object-contain object-left"
      />
    </div>
  );
}
