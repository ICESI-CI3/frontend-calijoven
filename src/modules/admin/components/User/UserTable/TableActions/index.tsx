// src/modules/admin/components/UserActions.tsx
import { Button } from '@/components/Button';
import { DocumentTextIcon } from '@heroicons/react/24/solid';

interface UserActionsProps {
  userId: string;
  onDetails: (id: string) => void;
}

export function TableActions({ userId, onDetails }: UserActionsProps) {
  return (
    <div className="flex justify-end gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onDetails(userId)}
        className="text-gray-500 hover:text-gray-700"
      >
        <DocumentTextIcon className="h-4 w-4 mr-1" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onDetails(userId)}
        className="text-gray-500 hover:text-gray-700"
      >
        <DocumentTextIcon className="h-4 w-4 mr-1" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onDetails(userId)}
        className="text-gray-500 hover:text-gray-700"
      >
        <DocumentTextIcon className="h-4 w-4 mr-1" />
      </Button>
    </div>
  );
}