import React from 'react';
import { Editor } from '@tiptap/react';
import { 
  ListBulletIcon,
  NumberedListIcon,
} from '@heroicons/react/24/outline';
import { HoverMenu, HoverMenuOption } from '@/components/HoverMenu';

interface ListMenuProps {
  editor: Editor | null;
}

const ListMenu: React.FC<ListMenuProps> = ({ editor }) => {
  if (!editor) return null;

  const getCurrentListType = () => {
    if (editor.isActive('bulletList')) return 'Viñetas';
    if (editor.isActive('orderedList')) return 'Numerada';
    return 'Listas';
  };

  const getCurrentListIcon = () => {
    if (editor.isActive('bulletList')) return <ListBulletIcon className="w-4 h-4" />;
    if (editor.isActive('orderedList')) return <NumberedListIcon className="w-4 h-4" />;
    return <ListBulletIcon className="w-4 h-4" />; // Default
  };

  const listOptions: HoverMenuOption[] = [
    {
      id: 'bulletList',
      label: 'Lista con viñetas',
      description: 'Lista con puntos',
      icon: <ListBulletIcon className="w-4 h-4" />,
      onClick: () => editor.chain().focus().toggleBulletList().run(),
      isActive: editor.isActive('bulletList'),
    },
    {
      id: 'orderedList',
      label: 'Lista numerada',
      description: 'Lista con números',
      icon: <NumberedListIcon className="w-4 h-4" />,
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: editor.isActive('orderedList'),
    },
  ];

  const trigger = (
    <div className="flex items-center gap-1 px-3 py-1.5 rounded hover:bg-gray-100 transition-colors">
      {getCurrentListIcon()}
      <span className="text-sm font-medium">{getCurrentListType()}</span>
    </div>
  );

  return (
    <HoverMenu
      trigger={trigger}
      options={listOptions}
      position="bottom-left"
      showOnHover={false}
      showOnClick={true}
      delay={150}
    />
  );
};

export { ListMenu }; 