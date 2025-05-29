import { Tag } from '@/components/Tag';

interface UserRolesProps {
  roles: string[];
  userId: string;
}

export function UserRoles({ roles, userId }: UserRolesProps) {
  return (
    <div className="flex gap-1">
      {roles.map((role, index) => (
        <Tag key={`${userId}-${role}-${index}`} color="primary" className="text-xs">
          {role}
        </Tag>
      ))}
    </div>
  );
}