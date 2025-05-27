'use client';

import { useEffect, useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { buildSidebarItems, defaultSidebarItems } from '@/lib/constants/sidebarItems';
import { SidebarItem } from '@/components/layout/Sidebar';
import { Spinner } from '@/components/Spinner';
import { useAuth } from '@/lib/hooks/useAuth';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  const [commonItems, setCommonItems] = useState<SidebarItem[]>([]);
  const [adminItems, setAdminItems] = useState<SidebarItem[]>([]);

  useEffect(() => {
    setCommonItems(defaultSidebarItems);
    setAdminItems(buildSidebarItems(user));
  }, [user]);

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col sm:flex-row">
      <Sidebar commonItems={commonItems} adminItems={adminItems} />
      <main className="flex-1 bg-background p-6 overflow-y-auto">{children}</main>
    </div>
  );
}
