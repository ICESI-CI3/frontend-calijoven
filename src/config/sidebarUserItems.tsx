import { SidebarItem } from '@/types/sidebar';
import {
  StarIcon,
  ClipboardDocumentCheckIcon,
  ChatBubbleLeftRightIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';

export const sidebarUserItems: SidebarItem[] = [
  { label: 'Favoritos', href: '/favoritos', icon: <StarIcon className="h-6 w-6" /> },
  {
    label: 'Inscripciones',
    href: '/inscripciones',
    icon: <ClipboardDocumentCheckIcon className="h-6 w-6" />,
  },
  { label: 'PQRS', href: '/pqrs', icon: <ChatBubbleLeftRightIcon className="h-6 w-6" /> },
  { label: 'Configuración', href: '/configuracion', icon: <Cog6ToothIcon className="h-6 w-6" /> },
];
