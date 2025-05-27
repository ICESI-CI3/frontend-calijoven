'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { ArrowRightOnRectangleIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/lib/hooks/useAuth';
import { Avatar } from '../Avatar';

interface SidebarProps {
  commonItems: SidebarItem[];
  adminItems: SidebarItem[];
}

export type SidebarItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
  badgeCount?: number;
};

type SidebarItemProps = {
  item: SidebarItem;
  isExpanded: boolean;
  pathname: string;
  isMobile?: boolean;
}

function SidebarItem({ item, isExpanded, pathname, isMobile = false }: SidebarItemProps) {
  const isActive = pathname === item.href;
  return (
    <Link
      key={item.href}
      href={item.href}
      className={cn(
        `group relative flex items-center rounded-md transition-colors`,
        isExpanded || isMobile ? 'justify-start gap-3 px-2 py-2' : 'justify-center p-2',
        isActive
          ? 'bg-primary text-primary-foreground'
          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
      )}
      aria-label={item.label}
    >
      <div className='h-5 w-5'>
        {item.icon}
      </div>

      <span
        className={cn(
          'overflow-hidden whitespace-nowrap text-xs font-medium transition-all duration-300 ease-in-out',
          (isExpanded || isMobile) ? 'block w-auto opacity-100' : 'hidden w-0 opacity-0',
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
            (isExpanded || isMobile)
              ? 'ml-auto opacity-100'
              : 'absolute right-1 top-1 -translate-y-1/2 translate-x-1/2 transform opacity-0 group-hover:opacity-100'
          )}
        >
          {item.badgeCount}
        </span>
      )}
    </Link>
  );
}

export function Sidebar({ commonItems, adminItems }: SidebarProps) {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkIsMobile();
    
    // Add event listener
    window.addEventListener('resize', checkIsMobile);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  const handleMouseEnter = () => !isMobile && setIsExpanded(true);
  const handleMouseLeave = () => !isMobile && setIsExpanded(false);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const sidebarWidthClass = isExpanded ? 'w-64' : 'w-20';

  if (isMobile) {
    return (
      <>
        {/* Mobile Header */}
        <div className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between border-b border-border bg-card px-4 shadow-sm">
          <div className="flex items-center gap-3">
            <Avatar src={user?.profilePicture || ''} alt={user?.name || ''} size="sm" />
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-foreground">
                {user?.name || 'Cargando...'}
              </span>
              <span className="text-xs text-muted-foreground">
                {user?.city.name || 'Cargando...'}
              </span>
            </div>
          </div>
          
          <button 
            onClick={toggleMobileMenu}
            className="p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-md"
          >
            {isMobileMenuOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu (Overlay) */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-40 flex pt-16 bg-background/80 backdrop-blur-sm">
            <div className="w-full max-w-sm bg-card shadow-lg h-full overflow-y-auto p-4">
              <nav className="flex flex-col gap-1">
                <p className="px-3 py-2 text-xs font-semibold text-muted-foreground">Navegación</p>
                {commonItems.map((item) => (
                  <SidebarItem 
                    key={item.href} 
                    item={item} 
                    isExpanded={true} 
                    pathname={pathname} 
                    isMobile={true}
                  />
                ))}
                
                <div className="h-px bg-border my-2" />
                <p className="px-3 py-2 text-xs font-semibold text-muted-foreground">Administración</p>
                {adminItems.map((item) => (
                  <SidebarItem 
                    key={item.href} 
                    item={item} 
                    isExpanded={true}
                    pathname={pathname}
                    isMobile={true}
                  />
                ))}
                
                <div className="h-px bg-border my-2" />
                <button
                  onClick={() => logout()}
                  className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <span className="h-5 w-5 flex-shrink-0">
                    <ArrowRightOnRectangleIcon className="h-full w-full" />
                  </span>
                  <span className="text-sm font-medium">
                    Cerrar Sesión
                  </span>
                </button>
              </nav>
            </div>
          </div>
        )}
        
        {/* Spacer for fixed header */}
        <div className="h-16" />
      </>
    );
  }

  // Desktop sidebar
  return (
    <aside
      className={cn(
        'relaive top-0 left-0 hidden md:flex h-screen flex-col border-r border-border bg-card py-4 shadow-sm transition-all duration-300 ease-in-out',
        sidebarWidthClass
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Sección de usuario (visible en ambas vistas) */}
      <div
        className={cn(
          'mt-2 flex items-center gap-3 px-4 justify-start',
        )}
      >
        {/* Avatar del usuario */}
        <Avatar src={user?.profilePicture || ''} alt={user?.name || ''} size="md" />
        <div
          className={cn(
            'flex-col overflow-hidden transition-all duration-300 ease-in-out',
            isExpanded ? 'flex w-auto opacity-100' : 'hidden w-0 opacity-0'
          )}
        >
          <span className="whitespace-nowrap text-sm font-semibold text-foreground">
            {user?.name || 'Cargando...'}
          </span>
          <span className="whitespace-nowrap text-xs text-muted-foreground">
            {user?.city.name || 'Cargando...'}
          </span>
        </div>
      </div>

      {/* Items de Navegación */}
      <nav className="mt-6 flex flex-1 flex-col gap-1 overflow-y-auto px-2 text-xs">
        {commonItems.map((item) => (
          <SidebarItem key={item.href} item={item} isExpanded={isExpanded} pathname={pathname} />
        ))}
        <div className="h-px bg-border my-2" />
        {adminItems.map((item) => (
          <SidebarItem key={item.href} item={item} isExpanded={isExpanded} pathname={pathname} />
        ))}
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