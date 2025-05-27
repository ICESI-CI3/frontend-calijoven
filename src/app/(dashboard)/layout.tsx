'use client';

import { useEffect, useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { buildSidebarItems, defaultSidebarItems } from '@/lib/constants/sidebarItems';
import { SidebarItem } from '@/components/layout/Sidebar';
import { Spinner } from '@/components/Spinner';
import { useAuth, useHydration } from '@/lib/hooks/useAuth';
import { redirect } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const isHydrated = useHydration();

  const [commonItems, setCommonItems] = useState<SidebarItem[]>([]);
  const [adminItems, setAdminItems] = useState<SidebarItem[]>([]);

  useEffect(() => {
    setCommonItems(defaultSidebarItems);
    setAdminItems(buildSidebarItems(user));
  }, [user]);

  if (!isHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="flex h-screen flex-col sm:flex-row">
      <Sidebar commonItems={commonItems} adminItems={adminItems} />
      <main className="flex-1 overflow-y-auto bg-background p-6">{children}</main>
    </div>
  );
}
