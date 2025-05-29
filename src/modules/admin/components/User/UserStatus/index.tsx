import { Tag } from '@/components/Tag';

interface UserStatusProps {
  isPublic?: boolean;
  isBanned?: boolean;
}

export function UserStatus({ isPublic, isBanned }: UserStatusProps) {
  if (typeof isPublic !== 'undefined') {
    return (
      <Tag 
        color={isPublic ? 'success' : 'warning'} 
        className="text-xs"
      >
        {isPublic ? 'Público' : 'Oculto'}
      </Tag>
    );
  }

  if (typeof isBanned !== 'undefined') {
    return (
      <Tag 
        color={isBanned ? 'danger' : 'success'} 
        className="text-xs"
      >
        {isBanned ? 'Baneado' : 'Activo'}
      </Tag>
    );
  }

  return null;
}