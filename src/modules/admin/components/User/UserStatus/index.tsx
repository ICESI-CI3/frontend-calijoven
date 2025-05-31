import { Tag, TagColor } from '@/components/Tag';

{ /* TODO: Hacer este componente general para que sea para public y para banned */}

interface UserStatusProps {
  status?: boolean;
  statusTrueText?: string;
  statusFalseText?: string;
  statusTrueColor?: TagColor;
  statusFalseColor?: TagColor;
}

export function UserStatus({ status, statusTrueText, statusFalseText, statusTrueColor, statusFalseColor }: UserStatusProps) {
  return (
    <Tag 
      color={status ? statusTrueColor : statusFalseColor} 
      className="text-xs"
    >
      {status ? statusTrueText : statusFalseText}
    </Tag>
  )
}