import React from 'react';
import { Editor } from '@tiptap/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { HoverMenu, HoverMenuOption } from '@/components/HoverMenu';

interface TextFormatMenuProps {
  editor: Editor | null;
}

const TextFormatMenu: React.FC<TextFormatMenuProps> = ({ editor }) => {
  if (!editor) return null;

  const getCurrentFormat = () => {
    if (editor.isActive('heading', { level: 1 })) return 'Título 1';
    if (editor.isActive('heading', { level: 2 })) return 'Título 2';
    if (editor.isActive('heading', { level: 3 })) return 'Título 3';
    if (editor.isActive('heading', { level: 4 })) return 'Título 4';
    if (editor.isActive('heading', { level: 5 })) return 'Título 5';
    if (editor.isActive('heading', { level: 6 })) return 'Título 6';
    return 'Párrafo';
  };

  const formatOptions: HoverMenuOption[] = [
    {
      id: 'paragraph',
      label: 'Párrafo',
      description: 'Texto normal',
      onClick: () => editor.chain().focus().setParagraph().run(),
      isActive: editor.isActive('paragraph'),
    },
    {
      id: 'heading1',
      label: 'Título 1',
      description: 'Encabezado principal',
      onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: editor.isActive('heading', { level: 1 }),
    },
    {
      id: 'heading2',
      label: 'Título 2',
      description: 'Encabezado secundario',
      onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: editor.isActive('heading', { level: 2 }),
    },
    {
      id: 'heading3',
      label: 'Título 3',
      description: 'Encabezado terciario',
      onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      isActive: editor.isActive('heading', { level: 3 }),
    },
    {
      id: 'heading4',
      label: 'Título 4',
      description: 'Encabezado cuaternario',
      onClick: () => editor.chain().focus().toggleHeading({ level: 4 }).run(),
      isActive: editor.isActive('heading', { level: 4 }),
    },
    {
      id: 'heading5',
      label: 'Título 5',
      description: 'Encabezado quinario',
      onClick: () => editor.chain().focus().toggleHeading({ level: 5 }).run(),
      isActive: editor.isActive('heading', { level: 5 }),
    },
    {
      id: 'heading6',
      label: 'Título 6',
      description: 'Encabezado sesenario',
      onClick: () => editor.chain().focus().toggleHeading({ level: 6 }).run(),
      isActive: editor.isActive('heading', { level: 6 }),
    },
  ];

  const trigger = (
    <div className="flex items-center gap-1 px-3 py-1.5 rounded hover:bg-gray-100 transition-colors">
      <span className="text-sm font-medium">{getCurrentFormat()}</span>
      <ChevronDownIcon className="h-3 w-3 text-gray-500" />
    </div>
  );

  return (
    <HoverMenu
      trigger={trigger}
      options={formatOptions}
      position="bottom-left"
      showOnHover={false}
      showOnClick={true}
      delay={150}
    />
  );
};

export { TextFormatMenu }; 