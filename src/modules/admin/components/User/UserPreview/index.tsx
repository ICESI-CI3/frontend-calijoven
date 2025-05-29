'use client';
import { Avatar } from '@/components/Avatar';
import { Button } from '@/components/Button';
import { Tag } from '@/components/Tag';
import { cn } from '@/lib/utils';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { CircleStackIcon, DocumentMagnifyingGlassIcon, DocumentTextIcon, EyeIcon, EyeSlashIcon, MagnifyingGlassMinusIcon, MagnifyingGlassPlusIcon, ShieldCheckIcon, ShieldExclamationIcon } from '@heroicons/react/24/solid';

export interface UserPreviewProps {
  id: string;
  name: string;
  email: string;
  image?: string;
  isBanned: boolean;
  isHidden: boolean;
  onDetails: (id: string) => void;
  className?: string;
}

export function UserPreview({
  id,
  name,
  email,
  image,
  isBanned,
  isHidden,
  onDetails,
  className = '',
}: UserPreviewProps) {
  return (
    <div
      className={cn(
        'flex flex-col md:flex-row items-start md:items-center gap-1 rounded-lg border bg-white p-4 transition-shadow hover:shadow-md w-full',
        className
      )}
    >
      {/* User Image and Basic Info */}
      <div className="flex flex-row items-center gap-4">
        <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-full">
          <Avatar
            src={image || '/default-avatar.png'}
            alt={name}
            size="lg"
          />
        </div>
        <div className="flex flex-col md:hidden">
          <h3 className="text-sm font-medium text-gray-900 text-left">{name}</h3>
          <p className="text-sm text-gray-500">{email}</p>
        </div>
      </div>

      {/* User Info */}
      <div className="flex flex-1 flex-col md:flex-row items-start md:items-center gap-4 w-full">
        <h3 className="hidden md:block text-sm font-medium text-gray-900">{name}</h3>
        <div className="flex flex-row w-full items-center justify-between">
            {/* Tag Status */}
            <div className="flex flex-wrap gap-1 flex-1">
              {isHidden ? (
                <Tag color="warning" className="text-xs flex items-center gap-1">
                  <EyeSlashIcon className="h-3 w-3" />
                  Oculto
                </Tag>
              ) : (
                <Tag color="success" className="text-xs flex items-center gap-1">
                  <EyeIcon className="h-3 w-3" />
                  Público
                </Tag>
              )}

              {isBanned ? (
                <Tag color="danger" className="text-xs flex items-center gap-1">
                  <ShieldExclamationIcon className="h-3 w-3" />
                  Baneado
                </Tag>
              ) : (
                <Tag color="success" className="text-xs flex items-center gap-1">
                  <ShieldCheckIcon className="h-3 w-3" />
                  Activo
                </Tag>
              )}
            </div>
            {/*Button Actions */}
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDetails(id)}
                className="text-gray-500 hover:text-gray-700"
              >
                <DocumentTextIcon className="h-4 w-4" />
              </Button>
            </div>
        </div>
      </div>
    </div>
  );
}