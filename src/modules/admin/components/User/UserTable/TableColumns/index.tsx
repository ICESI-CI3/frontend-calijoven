import { TableColumn } from '@/components/Table';
import { TableActions } from '../TableActions';
import { Avatar } from '@/components/Avatar';
import { UserRoles } from '../../UserRole';
import { UserStatus } from '../../UserStatus';
import { UserPreview } from '../../UserPreview';
import { User } from '@/types/user';

export const getDesktopColumns = (onDetails: (id: string) => void): TableColumn<User>[] => [
  {
    key: 'name',
    header: 'Nombre',
    flex: 2,
    render: (user: User) => (
      <div className="flex items-center gap-4">
        <Avatar
          src={user.profilePicture}
          alt={user.name}
          size="lg"
        />
        <span className='w-full text-left'>{user.name}</span>
      </div>
    ),
  },
  {
    key: 'email',
    header: 'Correo',
    flex: 2,
  },
  {
    key: 'role',
    header: 'Rol',
    flex: 1,
    render: (user: User) => <UserRoles roles={user.roles} userId={user.id} />,
  },
  {
    key: 'status',
    header: 'Estado del Usuario',
    flex: 1,
    render: (user: User) => (
      <UserStatus isPublic={user.isPublic} />
    ),
  },
  {
    key: 'visibility',
    header: 'Visibilidad del Perfil',
    flex: 1,
    render: (user: User) => (
      <UserStatus isBanned={user.banned} />
    ),
  },
  {
    key: 'actions',
    header: 'Acciones',
    flex: 1,
    align: 'right',
    render: (user: User) => (
      <TableActions userId={user.id} onDetails={onDetails} />
    ),
  },
];

export const getMobileColumns = (onDetails: (id: string) => void): TableColumn<User>[] => [
  {
    key: 'user',
    header: 'Usuarios',
    flex: 1,
    render: (user: User) => (
      <UserPreview
        id={user.id}
        name={user.name}
        email={user.email}
        image={user.profilePicture}
        isBanned={user.banned}
        isHidden={user.isPublic}
        onDetails={onDetails}
      />
    ),
  },
];