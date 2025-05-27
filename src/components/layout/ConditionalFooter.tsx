'use client';

import { usePathname } from 'next/navigation';
import { Footer } from '@/components/layout/Footer';
import { navbarItems } from '@/lib/constants/navbarItems';

export function ConditionalFooter() {
  const pathname = usePathname();
  const mainRoutes = navbarItems
    .flatMap((item) =>
      item.href ? [item.href] : item.children ? item.children.map((sub) => sub.href) : []
    )
    .filter(Boolean);
  const showFooter = mainRoutes.includes(pathname);

  return showFooter ? <Footer /> : null;
}
