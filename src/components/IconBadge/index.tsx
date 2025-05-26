'use client';

import { ReactNode } from 'react';
import { Badge, BadgeProps } from '@/components/Badge';
import { cn } from '@/lib/utils';
import { CalendarIcon, CheckCircleIcon, NewspaperIcon, PencilIcon, TagIcon, XMarkIcon } from '@heroicons/react/24/outline';

export interface IconBadgeProps extends BadgeProps {
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
}

export const StatusIcons = {
  published: <CheckCircleIcon className="h-3 w-3" />,
  draft: <PencilIcon className="h-3 w-3" />,
  rejected: <XMarkIcon className="h-3 w-3" />,
};

export const TypeIcons = {
  news: <NewspaperIcon className="h-3 w-3" />,
  event: <CalendarIcon className="h-3 w-3" />,
  offer: <TagIcon className="h-3 w-3" />,
};

export const LocationIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-3 w-3"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
      clipRule="evenodd"
    />
  </svg>
);

export function IconBadge({
  children,
  icon,
  iconPosition = 'left',
  className = '',
  ...badgeProps
}: IconBadgeProps) {
  return (
    <Badge {...badgeProps} className={cn('flex items-center gap-1', className)}>
      {iconPosition === 'left' && icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
      {iconPosition === 'right' && icon && <span className="flex-shrink-0">{icon}</span>}
    </Badge>
  );
}
