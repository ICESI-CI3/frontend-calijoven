import React from 'react';
import { Editor } from '@tiptap/react';
import { 
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  StrikethroughIcon,
} from '@heroicons/react/24/outline';
import { HoverMenu, HoverMenuOption } from '@/components/HoverMenu';

interface TextStyleMenuProps {
  editor: Editor | null;
}

const TextStyleMenu: React.FC<TextStyleMenuProps> = ({ editor }) => {
  if (!editor) return null;

  const getActiveStyles = () => {
    const styles = [];
    if (editor.isActive('bold')) styles.push('N');
    if (editor.isActive('italic')) styles.push('C');
    if (editor.isActive('underline')) styles.push('S');
    if (editor.isActive('strike')) styles.push('T');
    return styles.length > 0 ? styles.join('') : 'Texto';
  };

  const styleOptions: HoverMenuOption[] = [
    {
      id: 'bold',
      label: 'Negrita',
      description: 'Texto en negrita',
      icon: <BoldIcon className="w-4 h-4" />,
      onClick: () => editor.chain().focus().toggleBold().run(),
      isActive: editor.isActive('bold'),
    },
    {
      id: 'italic',
      label: 'Cursiva',
      description: 'Texto en cursiva',
      icon: <ItalicIcon className="w-4 h-4" />,
      onClick: () => editor.chain().focus().toggleItalic().run(),
      isActive: editor.isActive('italic'),
    },
    {
      id: 'underline',
      label: 'Subrayado',
      description: 'Texto subrayado',
      icon: <UnderlineIcon className="w-4 h-4" />,
      onClick: () => editor.chain().focus().toggleUnderline().run(),
      isActive: editor.isActive('underline'),
    },
    {
      id: 'strike',
      label: 'Tachado',
      description: 'Texto tachado',
      icon: <StrikethroughIcon className="w-4 h-4" />,
      onClick: () => editor.chain().focus().toggleStrike().run(),
      isActive: editor.isActive('strike'),
    },
  ];

  const trigger = (
    <div className="flex items-center gap-1 px-3 py-1.5 rounded hover:bg-gray-100 transition-colors">
      <span className="text-sm font-medium">{getActiveStyles()}</span>
      <div className="flex gap-0.5">
        {editor.isActive('bold') && <BoldIcon className="w-3 h-3 text-blue-600" />}
        {editor.isActive('italic') && <ItalicIcon className="w-3 h-3 text-blue-600" />}
        {editor.isActive('underline') && <UnderlineIcon className="w-3 h-3 text-blue-600" />}
        {editor.isActive('strike') && <StrikethroughIcon className="w-3 h-3 text-blue-600" />}
      </div>
    </div>
  );

  return (
    <HoverMenu
      trigger={trigger}
      options={styleOptions}
      position="bottom-left"
      showOnHover={false}
      showOnClick={true}
      delay={150}
      closeOnSelect={false}
    />
  );
};

export { TextStyleMenu }; 