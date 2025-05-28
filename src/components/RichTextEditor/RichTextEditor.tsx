import React, { useEffect, useState } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';

import { TextFormatMenu } from '@/components/RichTextEditor/TextFormatMenu';
import { TextStyleMenu } from '@/components/RichTextEditor/TextStyleMenu';
import { AlignmentMenu } from '@/components/RichTextEditor/AlignmentMenu';
import { ListMenu } from '@/components/RichTextEditor/ListMenu';
import { ExtrasMenu } from '@/components/RichTextEditor/ExtrasMenu';

type RichTextEditorProps = {
  value: string;
  onChange: (content: string) => void;
  disabled?: boolean;
};

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange, disabled }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        blockquote: {
          HTMLAttributes: {
            class: 'border-l-4 border-gray-300 pl-4 italic my-4',
          },
        },
      }),
      Underline,
      TextStyle,
      Color,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Link,
      Image,
    ],

    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    editor?.commands.setContent(value);
  }, [value, editor]);

  return (
    <div className="relative rounded-md border bg-white">
      <div className="flex flex-wrap items-center gap-2 border-b px-2 py-2">
        {/* Selector de formato */}
        <TextFormatMenu editor={editor} />

        {/* Separador */}
        <div className="h-6 w-px bg-gray-300"></div>

        {/* Estilos de texto */}
        <TextStyleMenu editor={editor} />

        {/* Separador */}
        <div className="h-6 w-px bg-gray-300"></div>

        {/* Alineación */}
        <AlignmentMenu editor={editor} />

        {/* Separador */}
        <div className="h-6 w-px bg-gray-300"></div>

        {/* Listas */}
        <ListMenu editor={editor} />

        {/* Separador */}
        <div className="h-6 w-px bg-gray-300"></div>

        {/* Extras */}
        <ExtrasMenu editor={editor} />
      </div>

      <EditorContent
        editor={editor}
        disabled={disabled}
        className="prose prose-sm min-h-[75px] max-w-none p-4 focus:outline-none"
      />
    </div>
  );
};

export { RichTextEditor };
