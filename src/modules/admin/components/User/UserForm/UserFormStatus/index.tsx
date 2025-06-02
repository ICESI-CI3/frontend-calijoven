import { ReactNode } from 'react';

interface UserStatusProps {
  status: boolean;
  onStatusChange: (value: boolean) => void;
  title: string
  trueIcon: ReactNode;
  falseIcon: ReactNode;
  trueText: string,
  falseText: string
}

export function UserFormStatus({ status, onStatusChange, title, trueIcon, trueText, falseIcon, falseText }: UserStatusProps) {
    return (
        <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-lg border border-gray-200 h-full flex-1">
            <div className="p-2 rounded-full bg-blue-100">
                {status ? trueIcon : falseIcon}
            </div>
            <div className="flex-1 flex flex-col justify-center text-left sm:text-left">
                <div className="flex items-center gap-2">
                    <h3 className="font-medium">{title}</h3>
                </div>
                <p className="text-sm text-gray-600">
                    {status 
                    ? trueText
                    : falseText
                    }
                </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
                <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={status}
                    onChange={(e) => onStatusChange(e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
        </div>
    )
}