import { SidebarItem } from '@/components/layout/Sidebar';
import { PERMISSIONS } from '@/lib/constants/permissions';
import { User } from '@/types/user';
import {
  BuildingOfficeIcon,
  ChatBubbleLeftRightIcon,
  Cog6ToothIcon,
  DocumentTextIcon,
  PhotoIcon,
  Squares2X2Icon,
  StarIcon,
  UserGroupIcon,
  BookmarkIcon,
} from '@heroicons/react/24/outline';
import { ROUTES } from './routes';

export const defaultSidebarItems: SidebarItem[] = [
  /*
  {
    label: 'Inicio',
    href: ROUTES.MY_SPACE.HOME.PATH,
    icon: <Squares2X2Icon className="h-full w-full" />,
  },
  */
  {
    label: 'Publicaciones Guardadas',
    href: ROUTES.MY_SPACE.SAVED_PUBLICATIONS.PATH,
    icon: <BookmarkIcon className="h-full w-full" />,
  },
  {
    label: 'PQRS',
    href: ROUTES.MY_SPACE.PQRS.PATH,
    icon: <ChatBubbleLeftRightIcon className="h-full w-full" />,
  },
  /*
  {
    label: 'Configuración',
    href: ROUTES.MY_SPACE.CONFIGURATION.PATH,
    icon: <Cog6ToothIcon className="h-full w-full" />,
  },¨
  */
];

export const sidebarItemsPerPermission: { [key: string]: SidebarItem[] } = {
  [PERMISSIONS.READ_USER || PERMISSIONS.MANAGE_USER]: [
    {
      label: 'Usuarios',
      href: ROUTES.ADMIN.USERS.PATH,
      icon: <UserGroupIcon className="h-full w-full" />,
    },
  ],
  [PERMISSIONS.MANAGE_ORGANIZATION]: [
    {
      label: 'Organizaciones',
      href: ROUTES.ADMIN.ORGANIZATIONS.PATH,
      icon: <BuildingOfficeIcon className="h-full w-full" />,
    },
  ],
  [PERMISSIONS.MANAGE_PUBLICATION]: [
    {
      label: 'Publicaciones',
      href: ROUTES.ADMIN.PUBLICATIONS.PATH,
      icon: <DocumentTextIcon className="h-full w-full" />,
    },
  ],
  
  [PERMISSIONS.MANAGE_PQRS]: [
    {
      label: 'PQRS',
      href: ROUTES.ADMIN.PQRS.PATH,
      icon: <ChatBubbleLeftRightIcon className="h-full w-full" />,
    },
  ],
};

export const buildSidebarItems = (user: User | null) => {
  if (!user) return [];

  const items: SidebarItem[] = [];

  for (const permission of user.roles) {
    try {
      items.push(...sidebarItemsPerPermission[permission]);
    } catch {}
  }

  return items;
};
