'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/providers/UserProvider';
import { Sidebar } from '@/components/layout/Sidebar';
import { sidebarAdminItems } from '@/config/sidebarAdminItems';
import { sidebarUserItems } from '@/config/sidebarUserItems';
import { ROUTES } from '@/lib/constants/routes';
import { SidebarItem } from '@/types/sidebar';
import { Spinner } from '@/components/Spinner';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const [sidebarItems, setSidebarItems] = useState<SidebarItem[]>([]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push(ROUTES.LOGIN);
    }

    if (user) {
      // Verificar si el usuario tiene el rol ADMIN
      const isAdmin = user.roles.some((role) => {
        return role.name === 'ADMIN';
      });

      setSidebarItems(isAdmin ? sidebarAdminItems : sidebarUserItems);
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar items={sidebarItems} />
      <main className="flex-1 bg-background p-6">{children}</main>
    </div>
  );
}
