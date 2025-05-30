'use client';

import { Avatar } from '@/components/Avatar';
import { Input } from '@/components/Input';
import { Select } from '@/components/Select';
import { Tag } from '@/components/Tag';
import { UserFormStatus } from '@/modules/admin/components/User/UserForm/UserFormStatus';
import { BaseCity } from '@/types/city';
import { User } from '@/types/user';
import { EyeIcon, EyeSlashIcon, SignalIcon } from '@heroicons/react/24/outline';
import { useParams } from 'next/navigation';

const mockCities: BaseCity[] = [
  { id: '1', name: 'Ciudad de México' },
  { id: '2', name: 'Guadalajara' },
  { id: '3', name: 'Monterrey' },
  { id: '4', name: 'Puebla' },
  { id: '5', name: 'Querétaro' },
];

const users: User[] = [
  {
    id: '1',
    name: 'Juan Pérez',
    email: 'juan@example.com',
    roles: ['MANAGE_PUBLICATION', 'MANAGE_PQRS'],
    userTypes: ['ADMIN'],
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
    userTypes: ['ADMIN'],
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
    userTypes: ['ADMIN', 'MIEMBRO_CDJ'],
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
    userTypes: ['ADMIN'],
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

const availableRoles = [
  { value: 'MANAGE_PUBLICATION', label: 'Gestionar Publicaciones' },
  { value: 'MANAGE_PQRS', label: 'Gestionar PQRS' },
  { value: 'MANAGE_USER', label: 'Gestionar Usuarios' },
  { value: 'READ_USER', label: 'Ver Usuarios' },
];

export default function UserDetailsPage() {
  const params = useParams();
  const user = users.find(u => u.id === params.id);
  if (!user) {
    return <div>Usuario no encontrado</div>;
  } else {
    return (
      <div className="p-6">
        <section className="flex flex-col gap-4">
            <div>
              <h1 className='text-2xl font-bold'>Detalles del Usuario</h1>
              <p className='text-gray-600'>Aquí puedes gestionar los usuarios de la plataforma.</p>
            </div>
          <form className='flex flex-col gap-4'>
            { /* Primara Sección */}
            <div className='flex flex-col md:flex-row gap-4 w-full'>
              <div className='gap-2 rounded-lg border border-gray-200 bg-card p-6 shadow-sm flex-[0.3] flex flex-col items-center justify-center text-center'>
                 <Avatar
                   src={user?.profilePicture || '/default-avatar.png'}
                   alt={user?.name || ''}
                   size="2xl"
                 />
                  <p className='text-lg font-bold'>{user?.name}</p>
                  <p className='text-sm text-gray-600'>{user?.email}</p>
              </div>
              <div className='rounded-lg border border-gray-200 bg-card p-6 shadow-sm flex-[0.7]'>
                <h2 className='text-lg font-bold mb-4'>Información del usuario</h2>
                <div className="space-y-6">
                  {/* Row 1: Nombre y Correo */}
                  <div className="flex gap-4 flex-col md:flex-row">
                    <div className="flex-1">
                      <Input 
                        label="Nombre completo" 
                        placeholder="Ingresa tu nombre completo" 
                        required 
                        defaultValue={user?.name}
                      />
                    </div>
                    <div className="flex-1">
                      <Input 
                        label="Correo electrónico" 
                        type="email"
                        placeholder="Ingresa tu correo electrónico" 
                        required 
                        defaultValue={user?.email}
                      />
                    </div>
                  </div>

                  {/* Row 2: Ciudad */}
                  <div>
                    <Select
                      label='Ciudad'
                      options={mockCities.map(city => ({ value: city.id, label: city.name }))}
                      value={user.city.id}
                      onChange={() => {}}
                    />
                  </div>
                </div>
              </div>
            </div>

            { /* Segunda Sección */}
            <div className='rounded-lg border border-gray-200 bg-card p-6 shadow-sm'>
              <h2 className='text-lg font-bold mb-4'>Roles del usuario</h2>
              <div className="space-y-4">
                <Select
                  label="Agregar rol"
                  options={availableRoles}
                  value=""
                  onChange={() => {}}
                />
                
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Roles asignados</h3>
                  <div className="flex flex-wrap gap-2">
                    {user.roles.map((role) => (
                      <div
                        key={role}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 text-blue-700"
                      >
                        <Tag color="primary" onRemove={() => alert('Primary tag removed')}>
                          {availableRoles.find(r => r.value === role)?.label || role}
                        </Tag>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            { /* Tercera Sección */}
            <div className='rounded-lg border border-gray-200 bg-card p-6 shadow-sm'>
              <h2 className='text-lg font-bold mb-4'>Estado del usuario </h2>
              <div className="flex gap-4 w-full flex-col md:flex-row">
                {/* Estado Perfil Público */}
                <UserFormStatus
                  status={user.isPublic}
                  onStatusChange={() => {}}
                  activeIcon={<EyeIcon className="h-6 w-6 text-blue-600" />}
                  inactiveIcon={<EyeSlashIcon className="h-6 w-6 text-gray-600" />}
                />

                {/* Estado Usuario Baneado */}
                <UserFormStatus
                  status={user.banned}
                  onStatusChange={() => {}}
                  activeIcon={<SignalIcon className="h-6 w-6 text-red-600" />}
                  inactiveIcon={<SignalIcon className="h-6 w-6 text-green-600" />}
                />
              </div>
            </div>
            
            { /* Sección de Acciones */}
            <div className='flex flex-row gap-4 items-end justify-end'>
              # Botones de acciones
            </div>
          </form>
        </section>
      </div>
    );
  }
}