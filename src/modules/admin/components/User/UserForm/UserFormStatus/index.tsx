import { ReactNode } from 'react';

interface UserStatusProps {
  status: boolean;
  onStatusChange: () => void;
  activeIcon: ReactNode;
  inactiveIcon: ReactNode;
}

export function UserFormStatus({ status, onStatusChange, activeIcon, inactiveIcon }: UserStatusProps) {
    return (
        <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-lg border border-gray-200 h-full flex-1">
            <div className="p-2 rounded-full bg-blue-100">
                {status ? activeIcon : inactiveIcon}
            </div>
            <div className="flex-1 flex flex-col justify-center text-left sm:text-left">
                <div className="flex items-center gap-2">
                    <h3 className="font-medium">Perfil Público</h3>
                </div>
                <p className="text-sm text-gray-600">
                    {status 
                    ? "El perfil es visible para otros usuarios"
                    : "El perfil no es visible para otros usuarios"
                    }
                </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
                <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={status}
                    onChange={onStatusChange}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
        </div>
    )
}