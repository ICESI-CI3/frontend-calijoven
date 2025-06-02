import { Avatar } from '@/components/Avatar';
import { TableColumn } from '@/components/Table';
import { getUser } from '@/types/user';
import { AdjustmentsHorizontalIcon, EyeIcon, EyeSlashIcon, SignalIcon, SignalSlashIcon } from '@heroicons/react/24/outline';
import { UserPreview } from '../../UserPreview';
import { UserRoles } from '../../UserRole';
import { UserStatus } from '../../UserStatus';
import { TableActions } from '../TableActions';

interface UserTableColumnsProps {
  onBan: (id: string) => void;
  onHide: (id: string) => void;
  onDetails: (id: string) => void;
  banningUserId: string | null;
  hidingUserId: string | null;
}

export const getDesktopColumns = ({ onBan, onHide, onDetails, banningUserId, hidingUserId }: UserTableColumnsProps): TableColumn<getUser>[] => [
  {
    key: 'name',
    header: 'Nombre',
    flex: 2,
    render: (user: getUser) => (
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
    render: (user: getUser) => <span className='block text-left w-full'>{user.email}</span>,
  },
  {
    key: 'role',
    header: 'Rol',
    flex: 1,
    render: (user: getUser) => <UserRoles roles={user.roles} userId={user.id} />,
  },
  {
    key: 'status',
    header: 'Estado del Usuario',
    flex: 1,
    render: (user: getUser) => (
      <UserStatus
        status={user.banned}
        statusTrueText="Baneado"
        statusFalseText="Activo"
        statusTrueColor="danger"
        statusFalseColor="success"
      />
    ),
  },
  {
    key: 'visibility',
    header: 'Visibilidad del Perfil',
    flex: 1,
    render: (user: getUser) => (
      <UserStatus
        status={user.isPublic}
        statusTrueText="Público"
        statusFalseText="Oculto"
        statusTrueColor="success"
        statusFalseColor="warning"
      />
    ),
  },
  {
    key: 'actions',
    header: 'Acciones',
    flex: 1,
    align: 'right',
    render: (user: getUser) => (
      <TableActions
        userId={user.id}
        crumbs={[
          {
            onAction: () => onBan(user.id),
            icon: user.banned ? (
              <SignalSlashIcon className="h-4 w-4 mr-1" />
            ) : (
              <SignalIcon className="h-4 w-4 mr-1" />
            ),
            userId: user.id,
            isLoading: banningUserId === user.id,
          },
          {
            onAction: () => onHide(user.id),
            icon: user.isPublic ? (
              <EyeIcon className="h-4 w-4 mr-1" />
            ) : (
              <EyeSlashIcon className="h-4 w-4 mr-1" />
            ),
            userId: user.id,
            isLoading: hidingUserId === user.id,
          },
          {
            onAction: () => onDetails(user.id), 
            icon: <AdjustmentsHorizontalIcon className="h-4 w-4 mr-1" />,
            userId: user.id,
          }
        ]}
      />
    ),
  },
];

export const getMobileColumns = (onDetails: (id: string) => void): TableColumn<getUser>[] => [
  {
    key: 'user',
    header: 'Usuarios',
    flex: 1,
    render: (user: getUser) => (
      <UserPreview
        id={user.id}
        name={user.name}
        email={user.email}
        image={user.profilePicture}
        isBanned={user.banned}
        isPublic={user.isPublic}
        onDetails={onDetails}
      />
    ),
  },
];