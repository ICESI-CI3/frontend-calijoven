import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface CardProps {
  title: string;
  description?: string;
  subtitle?: string;
  icon?: ReactNode;
  color?: 'primary' | 'secondary' | 'accent' | 'custom';
  className?: string;
  children?: ReactNode;
}

const colorMap = {
  primary: 'border-l-4 border-primary',
  secondary: 'border-l-4 border-secondary',
  accent: 'border-l-4 border-accent',
  custom: '',
};

export function Card({
  title,
  description,
  subtitle,
  icon,
  color = 'primary',
  className,
  children,
}: CardProps) {
  return (
    <div
      className={cn(
        'relative flex flex-col rounded-xl border bg-card p-6 text-card-foreground shadow-sm',
        colorMap[color],
        className
      )}
    >
      <div className="flex items-start gap-4">
        {icon && <div className="flex h-10 w-10 items-center justify-center">{icon}</div>}
        <div className="flex-1">
          <h2 className="mb-1 flex items-center gap-2 text-lg font-semibold leading-tight text-foreground">
            {title}
          </h2>
          {subtitle && (
            <div className="mb-1 text-sm font-medium text-muted-foreground">{subtitle}</div>
          )}
          {description && <p className="mb-2 text-base text-muted-foreground">{description}</p>}
          {children}
        </div>
      </div>
    </div>
  );
}
