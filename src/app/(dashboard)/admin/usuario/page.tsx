'use client';

import { Button } from '@/components/Button';
import { Table } from '@/components/Table';
import { getDesktopColumns, getMobileColumns } from '@/modules/admin/components/User/UserTable/TableColumns';
import { User } from '@/types/user';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleDetails = (id: string) => {
    router.push(`/admin/usuario/${id}`);
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
            onClick={() => console.log('Crear nuevo usuario')}
          >
            Crear nuevo usuario
          </Button>
        </div>
        </div>
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