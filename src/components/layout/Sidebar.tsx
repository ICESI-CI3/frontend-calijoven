'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { SidebarItem } from '@/types/sidebar';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { useUser } from '@/providers/UserProvider';

interface SidebarProps {
  items: SidebarItem[];
}

export function Sidebar({ items }: SidebarProps) {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);
  const { user, logout, isLoading } = useUser();

  useEffect(() => {}, [items, user]);

  if (isLoading || !user) {
    return null;
  }

  const handleMouseEnter = () => setIsExpanded(true);
  const handleMouseLeave = () => setIsExpanded(false);

  const sidebarWidthClass = isExpanded ? 'w-64' : 'w-20';

  const getRoleDisplay = () => {
    const isAdmin = user.roles.some((role) => {
      return role.name === 'ADMIN';
    });

    return isAdmin ? 'Administrador' : 'Usuario';
  };

  return (
    <aside
      className={cn(
        'relative flex h-screen flex-col border-r border-border bg-card py-4 shadow-sm transition-all duration-300 ease-in-out',
        sidebarWidthClass
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Sección de usuario (visible en ambas vistas) */}
      <div
        className={cn(
          'mt-2 flex items-center gap-3 px-4',
          isExpanded ? 'justify-start' : 'justify-center'
        )}
      >
        {/* Avatar del usuario */}
        <div className="h-8 w-8 flex-shrink-0 rounded-full bg-gray-300"></div>
        <div
          className={cn(
            'flex-col overflow-hidden transition-all duration-300 ease-in-out',
            isExpanded ? 'flex w-auto opacity-100' : 'hidden w-0 opacity-0'
          )}
        >
          <span className="whitespace-nowrap text-sm font-semibold text-foreground">
            {user.name || 'Cargando...'}
          </span>
          <span className="whitespace-nowrap text-xs text-muted-foreground">
            {getRoleDisplay()}
          </span>
        </div>
      </div>

      {/* Items de Navegación */}
      <nav className="mt-6 flex flex-1 flex-col gap-1 overflow-y-auto px-2">
        {items.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                `group relative flex items-center rounded-md transition-colors`,
                isExpanded ? 'justify-start gap-3 px-3 py-2' : 'justify-center p-2',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
              aria-label={item.label}
            >
              <div className={cn(isExpanded ? 'h-5 w-5 flex-shrink-0' : 'h-6 w-6 flex-shrink-0')}>
                {item.icon}
              </div>

              <span
                className={cn(
                  'overflow-hidden whitespace-nowrap text-sm font-medium transition-all duration-300 ease-in-out',
                  isExpanded ? 'block w-auto opacity-100' : 'hidden w-0 opacity-0',
                  isActive
                    ? 'text-primary-foreground'
                    : 'text-foreground group-hover:text-accent-foreground'
                )}
              >
                {item.label}
              </span>

              {/* Badge de notificación (visible si existe) */}
              {item.badgeCount !== undefined && item.badgeCount > 0 && (
                <span
                  className={cn(
                    'bg-error inline-flex items-center justify-center rounded-full px-1.5 py-0.5 text-xs font-bold leading-none text-white',
                    isExpanded
                      ? 'ml-auto opacity-100'
                      : 'absolute right-1 top-1 -translate-y-1/2 translate-x-1/2 transform opacity-0 group-hover:opacity-100'
                  )}
                >
                  {item.badgeCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Pie de página (Botón de Logout)*/}
      <div className={cn('mt-auto px-2 pt-4')}>
        <button
          onClick={() => logout()}
          className={cn(
            'flex items-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
            isExpanded ? 'w-full justify-start gap-3 px-3 py-2' : 'mx-auto h-12 w-12 justify-center'
          )}
          aria-label={isExpanded ? 'Cerrar Sesión' : 'Logout'}
        >
          <span className={cn(isExpanded ? 'h-5 w-5 flex-shrink-0' : 'h-6 w-6 flex-shrink-0')}>
            <ArrowRightOnRectangleIcon className="h-full w-full" />
          </span>
          <span
            className={cn(
              'whitespace-nowrap text-sm font-medium',
              isExpanded ? 'block opacity-100' : 'hidden opacity-0'
            )}
          >
            Cerrar Sesión
          </span>
        </button>
      </div>
    </aside>
  );
}
