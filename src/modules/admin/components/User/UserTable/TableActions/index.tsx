// src/modules/admin/components/UserActions.tsx
import { Button } from '@/components/Button';
import { Spinner } from '@/components/Spinner';

interface UserActionsProps {
  userId: string;
  crumbs: ActionCrumbProps[];
}

export function TableActions({ userId, crumbs }: UserActionsProps) {
  return (
    <div className="flex justify-end gap-2">
      {crumbs.map((crumb, index) => (
        <ActionCrumb
          key={index}
          onAction={crumb.onAction}
          icon={crumb.icon}
          userId={userId}
          isLoading={crumb.isLoading}
        />
      ))}
    </div>
  );
}

interface ActionCrumbProps {
  onAction: (userId: string) => void;
  icon: React.ReactNode;
  userId: string;
  isLoading?: boolean;
}

export function ActionCrumb({
  onAction,
  icon,
  userId,
  isLoading
}: ActionCrumbProps) {
  return(
    <Button
        variant="ghost"
        size="sm"
        onClick={() => onAction(userId)}
        className="text-gray-500 hover:text-gray-700"
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="h-4 w-4 mr-1">
            <Spinner size="sm" />
          </div>
        ) : icon}
      </Button>
  )
}