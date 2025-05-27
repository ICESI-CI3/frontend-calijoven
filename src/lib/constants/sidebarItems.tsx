import { PERMISSIONS } from '@/lib/constants/permissions';
import { User } from '@/types/user';
import {
  Squares2X2Icon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  StarIcon,
  BuildingOfficeIcon,
  PhotoIcon,
} from '@heroicons/react/24/outline';
import { ROUTES } from './routes';
import { SidebarItem } from '@/components/layout/Sidebar';

export const defaultSidebarItems: SidebarItem[] = [
  {
    label: 'Inicio',
    href: ROUTES.MY_SPACE.HOME.PATH,
    icon: <Squares2X2Icon className="h-full w-full" />,
  },
  {
    label: 'Publicaciones',
    href: ROUTES.MY_SPACE.PUBLICATIONS.PATH,
    icon: <StarIcon className="h-full w-full" />,
  },
  {
    label: 'PQRS',
    href: ROUTES.MY_SPACE.PQRS.PATH,
    icon: <ChatBubbleLeftRightIcon className="h-full w-full" />,
  },
  {
    label: 'Configuración',
    href: ROUTES.MY_SPACE.CONFIGURATION.PATH,
    icon: <Cog6ToothIcon className="h-full w-full" />,
  },
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
  [PERMISSIONS.MANAGE_BANNER]: [
    {
      label: 'Banners',
      href: ROUTES.ADMIN.BANNERS.PATH,
      icon: <PhotoIcon className="h-full w-full" />,
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
