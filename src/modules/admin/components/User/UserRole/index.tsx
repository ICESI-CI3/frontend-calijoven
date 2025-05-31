import { Tag } from '@/components/Tag';
import { Role } from '@/types/user';

interface UserRolesProps {
  roles: Role[];
  userId: string;
}

export function UserRoles({ roles = [], userId }: UserRolesProps) {
  if (!roles || roles.length === 0) {
    return (
      <Tag color="default" className="text-xs">
        Sin roles
      </Tag>
    );
  }

  return (
    <div className="flex gap-1">
      {roles.map((role, index) => (
        <Tag key={`${userId}-${role.id}-${index}`} color="primary" className="text-xs">
          {role.name}
        </Tag>
      ))}
    </div>
  );
}