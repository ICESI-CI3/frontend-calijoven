'use client';

import { useEffect, useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { buildSidebarItems, defaultSidebarItems } from '@/lib/constants/sidebarItems';
import { SidebarItem } from '@/components/layout/Sidebar';
import { useAuth } from '@/lib/hooks/useAuth';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [commonItems, setCommonItems] = useState<SidebarItem[]>([]);
  const [adminItems, setAdminItems] = useState<SidebarItem[]>([]);

  const { user } = useAuth();
  useEffect(() => {
    setCommonItems(defaultSidebarItems);
    setAdminItems(buildSidebarItems(user));
  }, [user]);

  return (
    <div className="flex h-screen flex-col sm:flex-row">
      <Sidebar commonItems={commonItems} adminItems={adminItems} />
      <main className="flex-1 overflow-y-auto bg-background p-6">{children}</main>
    </div>
  );
}
