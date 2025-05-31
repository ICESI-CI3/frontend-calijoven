'use client';

import { Button } from '@/components/Button';
import { Table } from '@/components/Table';
import { ROUTES } from '@/lib/constants/routes';
import { useUsersDashboard } from '@/modules/admin';
import { getDesktopColumns, getMobileColumns } from '@/modules/admin/components/User/UserTable/TableColumns';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function UsersDashboard() {
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();
  const { users, total, isLoading, isError, error, filters, page, limit, handleSearch, handlePageChange, handleBan, handleHide, banningUserId, hidingUserId } = useUsersDashboard({
    initialFilters: {}
  });

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleDetails = (id: string) => {
    router.push(ROUTES.ADMIN.USER_DETAIL(id).PATH);
  };

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row md:space-x-4 items-start justify-between mb-2 gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-2">Usuarios</h1>
          <p className="text-gray-600 mb-2">Aquí puedes gestionar los usuarios de la plataforma.</p>
        </div>  
        <div className="flex justify-end mb-4 w-full md:w-auto">
          <Button
            fullWidth={true}
            type='button'
            className="w-full md:w-auto"
            onClick={() => router.push(ROUTES.ADMIN.USER_CREATE.PATH)}
          >
            Crear nuevo usuario
          </Button>
        </div>
        </div>
      <Table
        columns={isMobile ? getMobileColumns(handleDetails) : getDesktopColumns({ onBan: handleBan, onHide: handleHide, onDetails: handleDetails, banningUserId, hidingUserId })}
        data={users}
        keyExtractor={(user) => user.id}
        search={true}
        onSearch={handleSearch}
        pagination={{
          enabled: true,
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          onPageChange: handlePageChange,
        }}
      />
    </div>
  );
}