'use client';

import { Table } from '@/components/Table';
import { getDesktopColumns, getMobileColumns } from '@/modules/admin/components/User/UserTable/TableColumns';
import { User } from '@/types/user';
import { useEffect, useState } from 'react';


const users: User[] = [
  {
    id: '1',
    name: 'Juan Pérez',
    email: 'juan@example.com',
    roles: ['MANAGE_PUBLICATION', 'MANAGE_PQRS'],
    banned: false,
    isPublic: true,
    profilePicture: 'https://i.pravatar.cc/150?img=1',
    city: {
      id: '1',
      name: 'Ciudad de México',
    },
    leadingCommittees: [],
    committees: [],
    organizations: [],
  },
  {
    id: '2',
    name: 'María García',
    email: 'maria@example.com',
    roles: ['MANAGE_USER', 'READ_USER'],
    banned: true,
    isPublic: false,
    profilePicture: 'https://i.pravatar.cc/150?img=2',
    city: {
      id: '1',
      name: 'Ciudad de México',
    },
    leadingCommittees: [],
    committees: [],
    organizations: [],
  }, 
  {
    id: '3',
    name: 'Pedro López',
    email: 'pedro@example.com',
    roles: ['MANAGE_USER', 'READ_USER'],
    banned: false,
    isPublic: true,
    profilePicture: 'https://i.pravatar.cc/150?img=3',
    city: {
      id: '1',
      name: 'Ciudad de México',
    },
    leadingCommittees: [],
    committees: [],
    organizations: [],
  },
  {
    id: '4',
    name: 'Ana Torres',
    email: 'ana@example.com',
    roles: ['MANAGE_USER', 'READ_USER'],
    banned: false,
    isPublic: false,
    profilePicture: 'https://i.pravatar.cc/150?img=4',
    city: {
      id: '1',
      name: 'Ciudad de México',
    },
    leadingCommittees: [],
    committees: [],
    organizations: [],
  },
];


export default function UsersDashboard() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleDetails = (id: string) => {
    console.log('Edit user:', id);
  };

  return (
    <div className="p-4">
      <Table
        columns={isMobile ? getMobileColumns(handleDetails) : getDesktopColumns(handleDetails)}
        data={users}
        keyExtractor={(user) => user.id}
        search={true}
        onSearch={(value) => console.log('Buscar:', value)}
        pagination={{
          enabled: true,
          currentPage: 1,
          totalPages: 5,
          onPageChange: (page) => console.log('Cambiar página:', page),
        }}
      />
    </div>
  );
}