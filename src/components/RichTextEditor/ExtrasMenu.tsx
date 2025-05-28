import React from 'react';
import { Editor } from '@tiptap/react';
import { 
  LinkIcon,
  PhotoIcon,
  CodeBracketIcon,
  CodeBracketSquareIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline';
import { HoverMenu, HoverMenuOption } from '@/components/HoverMenu';

interface ExtrasMenuProps {
  editor: Editor | null;
}

const ExtrasMenu: React.FC<ExtrasMenuProps> = ({ editor }) => {
  if (!editor) return null;

  const addLink = () => {
    const url = prompt('Ingrese la URL:', 'https://example.com');
    if (url) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }
  };

  const addImage = () => {
    const url = prompt('Ingrese la URL de la imagen:', 'https://example.com');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const hasActiveExtras = () => {
    return editor.isActive('link') || 
           editor.isActive('code') || 
           editor.isActive('codeBlock') || 
           editor.isActive('blockquote');
  };

  const getActiveExtrasText = () => {
    const actives = [];
    if (editor.isActive('link')) actives.push('Enlace');
    if (editor.isActive('code')) actives.push('Código');
    if (editor.isActive('codeBlock')) actives.push('Bloque');
    if (editor.isActive('blockquote')) actives.push('Cita');
    return actives.length > 0 ? actives.join(', ') : 'Extras';
  };

  const extrasOptions: HoverMenuOption[] = [
    {
      id: 'link',
      label: 'Enlace',
      description: 'Insertar enlace',
      icon: <LinkIcon className="w-4 h-4" />,
      onClick: addLink,
      isActive: editor.isActive('link'),
    },
    {
      id: 'image',
      label: 'Imagen',
      description: 'Insertar imagen',
      icon: <PhotoIcon className="w-4 h-4" />,
      onClick: addImage,
      isActive: false, // Las imágenes no tienen estado activo persistente
    },
    {
      id: 'code',
      label: 'Código inline',
      description: 'Código en línea',
      icon: <CodeBracketIcon className="w-4 h-4" />,
      onClick: () => editor.chain().focus().toggleCode().run(),
      isActive: editor.isActive('code'),
    },
    {
      id: 'codeBlock',
      label: 'Bloque de código',
      description: 'Bloque de código',
      icon: <CodeBracketSquareIcon className="w-4 h-4" />,
      onClick: () => editor.chain().focus().toggleCodeBlock().run(),
      isActive: editor.isActive('codeBlock'),
    },
    {
      id: 'blockquote',
      label: 'Cita',
      description: 'Bloque de cita',
      icon: <ChatBubbleLeftRightIcon className="w-4 h-4" />,
      onClick: () => editor.chain().focus().toggleBlockquote().run(),
      isActive: editor.isActive('blockquote'),
    },
  ];

  const trigger = (
    <div className={`flex items-center gap-1 px-3 py-1.5 rounded hover:bg-gray-100 transition-colors ${
      hasActiveExtras() ? 'bg-blue-50 text-blue-700' : ''
    }`}>
      <span className="text-sm font-medium">{getActiveExtrasText()}</span>
      <div className="flex gap-0.5">
        {editor.isActive('link') && <LinkIcon className="w-3 h-3 text-blue-600" />}
        {editor.isActive('code') && <CodeBracketIcon className="w-3 h-3 text-blue-600" />}
        {editor.isActive('codeBlock') && <CodeBracketSquareIcon className="w-3 h-3 text-blue-600" />}
        {editor.isActive('blockquote') && <ChatBubbleLeftRightIcon className="w-3 h-3 text-blue-600" />}
      </div>
    </div>
  );

  return (
    <HoverMenu
      trigger={trigger}
      options={extrasOptions}
      position="bottom-left"
      showOnHover={false}
      showOnClick={true}
      delay={150}
      closeOnSelect={false}
    />
  );
};

export { ExtrasMenu }; 