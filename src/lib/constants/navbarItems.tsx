import { ROUTES } from './routes';
import { UserIcon, ArrowLeftOnRectangleIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import type { ReactNode } from 'react';

export type NavbarItem = {
  label: string;
  href?: string;
  icon?: ReactNode;
  children?: NavbarItem[];
  external?: boolean;
};

export const navbarItems: NavbarItem[] = [
  { label: 'Inicio', href: ROUTES.HOME },
  { label: 'Publicaciones', href: ROUTES.PUBLICATIONS.LIST },
  {
    label: '¿Quiénes somos?',
    children: [
      { label: 'PDJ - Plataforma Distrital de Juventud', href: ROUTES.PDJ },
      { label: 'CDJ - Consejo Distrital de Juventud', href: ROUTES.CDJ },
    ],
  },
  { label: 'Transparencia', href: ROUTES.TRANSPARENCY },
];

export const navbarUserMenu: NavbarItem[] = [
  { label: 'Mi espacio', href: ROUTES.MY_SPACE.HOME, icon: <Cog6ToothIcon className="h-5 w-5" /> },
  { label: 'Perfil', href: ROUTES.MY_SPACE.CONFIGURATION, icon: <UserIcon className="h-5 w-5" /> },
  {
    label: 'Cerrar sesión',
    href: '#logout',
    icon: <ArrowLeftOnRectangleIcon className="h-5 w-5" />,
  },
];
