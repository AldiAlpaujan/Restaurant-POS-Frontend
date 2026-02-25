import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import type { SideBarMenuItem } from '@/components/AppLayout/SideBar/MenuItem';

// Fungsi bantu untuk membandingkan path secara presisi
const checkSimilarPath = (path: string, menuPath: string): boolean => {
  // 1. Kasus pencocokan path yang persis sama
  if (menuPath === path) {
    return true;
  }

  // Hapus trailing slash dari kedua path jika ada, kecuali untuk root path '/'
  const sanitizedPath = path.endsWith('/') && path !== '/' ? path.slice(0, -1) : path;
  const sanitizedMenuPath =
    menuPath.endsWith('/') && menuPath !== '/' ? menuPath.slice(0, -1) : menuPath;

  // 2. Kasus pencocokan dengan children (menuPath adalah prefix dari path)
  // Contoh: menuPath: '/admin/settings' cocok dengan path: '/admin/settings/profile'
  // Logika ini menghindari pencocokan yang tidak valid seperti '/dashboard' dengan '/dashboard-settings'
  return (
    sanitizedPath.startsWith(sanitizedMenuPath) && sanitizedPath[sanitizedMenuPath.length] === '/'
  );
};

const useActiveMenu = (items: SideBarMenuItem[]) => {
  const path = useLocation().pathname;
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  useEffect(() => {
    let bestMatchTitle: string | null = null;
    let bestMatchUrlLength = 0;

    // Fungsi rekursif untuk mencari menu yang paling cocok
    const findMatch = (menuItems: typeof items) => {
      for (const item of menuItems) {
        // Cek pencocokan dengan menu saat ini
        if (checkSimilarPath(path, item.url)) {
          // Prioritaskan pencocokan yang paling spesifik (URL terpanjang)
          if (item.url.length > bestMatchUrlLength) {
            bestMatchTitle = item.title;
            bestMatchUrlLength = item.url.length;
          }
        }

        // Jika ada children, lakukan pencarian rekursif di dalamnya
        if (item.children) {
          findMatch(item.children as typeof items);
        }
      }
    };

    // Jalankan pencarian
    findMatch(items);

    // Atur menu aktif, atau null jika tidak ada yang cocok
    setActiveMenu(bestMatchTitle);
  }, [path, items]);

  return activeMenu;
};

export default useActiveMenu;
