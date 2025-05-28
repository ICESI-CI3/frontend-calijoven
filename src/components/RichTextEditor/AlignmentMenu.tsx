import React from 'react';
import { Editor } from '@tiptap/react';
import { 
  Bars3BottomLeftIcon,
  Bars3Icon,
  Bars3BottomRightIcon,
} from '@heroicons/react/24/outline';
import { HoverMenu, HoverMenuOption } from '@/components/HoverMenu';

interface AlignmentMenuProps {
  editor: Editor | null;
}

const AlignmentMenu: React.FC<AlignmentMenuProps> = ({ editor }) => {
  if (!editor) return null;

  const getCurrentAlignment = () => {
    if (editor.isActive({ textAlign: 'left' })) return 'Izquierda';
    if (editor.isActive({ textAlign: 'center' })) return 'Centro';
    if (editor.isActive({ textAlign: 'right' })) return 'Derecha';
    return 'Izquierda'; // Default
  };

  const getCurrentAlignmentIcon = () => {
    if (editor.isActive({ textAlign: 'center' })) return <Bars3Icon className="w-4 h-4" />;
    if (editor.isActive({ textAlign: 'right' })) return <Bars3BottomRightIcon className="w-4 h-4" />;
    return <Bars3BottomLeftIcon className="w-4 h-4" />; // Default left
  };

  const alignmentOptions: HoverMenuOption[] = [
    {
      id: 'left',
      label: 'Izquierda',
      description: 'Alinear a la izquierda',
      icon: <Bars3BottomLeftIcon className="w-4 h-4" />,
      onClick: () => editor.chain().focus().setTextAlign('left').run(),
      isActive: editor.isActive({ textAlign: 'left' }) || (!editor.isActive({ textAlign: 'center' }) && !editor.isActive({ textAlign: 'right' })),
    },
    {
      id: 'center',
      label: 'Centro',
      description: 'Centrar texto',
      icon: <Bars3Icon className="w-4 h-4" />,
      onClick: () => editor.chain().focus().setTextAlign('center').run(),
      isActive: editor.isActive({ textAlign: 'center' }),
    },
    {
      id: 'right',
      label: 'Derecha',
      description: 'Alinear a la derecha',
      icon: <Bars3BottomRightIcon className="w-4 h-4" />,
      onClick: () => editor.chain().focus().setTextAlign('right').run(),
      isActive: editor.isActive({ textAlign: 'right' }),
    },
  ];

  const trigger = (
    <div className="flex items-center gap-1 px-3 py-1.5 rounded hover:bg-gray-100 transition-colors">
      {getCurrentAlignmentIcon()}
      <span className="text-sm font-medium">{getCurrentAlignment()}</span>
    </div>
  );

  return (
    <HoverMenu
      trigger={trigger}
      options={alignmentOptions}
      position="bottom-left"
      showOnHover={false}
      showOnClick={true}
      delay={150}
    />
  );
};

export { AlignmentMenu }; 