import { SidebarItem } from '@/types/sidebar';
import {
  Squares2X2Icon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  FolderIcon,
  ChartBarIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';

export const sidebarAdminItems: SidebarItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: <Squares2X2Icon className="h-6 w-6" /> },
  {
    label: 'Publicaciones',
    href: '/publicaciones',
    icon: <DocumentTextIcon className="h-6 w-6" />,
  },
  { label: 'PQRS', href: '/pqrs', icon: <ChatBubbleLeftRightIcon className="h-6 w-6" /> },
  { label: 'Usuarios', href: '/usuarios', icon: <UserGroupIcon className="h-6 w-6" /> },
  { label: 'Documentos', href: '/documentos', icon: <FolderIcon className="h-6 w-6" /> },
  { label: 'Estadísticas', href: '/estadisticas', icon: <ChartBarIcon className="h-6 w-6" /> },
  { label: 'Configuración', href: '/configuracion', icon: <Cog6ToothIcon className="h-6 w-6" /> },
];
