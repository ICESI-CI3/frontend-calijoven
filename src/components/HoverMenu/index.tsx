import React, { useState, useRef, useEffect } from 'react';

export interface HoverMenuOption {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  onClick: () => void;
  isActive?: boolean;
  className?: string;
}

interface HoverMenuProps {
  trigger: React.ReactNode;
  options: HoverMenuOption[];
  position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right' | 'bottom-center';
  className?: string;
  menuClassName?: string;
  delay?: number;
  showOnHover?: boolean;
  showOnClick?: boolean;
  disabled?: boolean;
  closeOnSelect?: boolean;
}

const HoverMenu: React.FC<HoverMenuProps> = ({
  trigger,
  options,
  position = 'bottom-left',
  className = '',
  menuClassName = '',
  delay = 200,
  showOnHover = true,
  showOnClick = false,
  disabled = false,
  closeOnSelect = true,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const showMenu = () => {
    if (disabled) return;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(true);
  };

  const hideMenu = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      if (!isHovering) {
        setIsVisible(false);
      }
    }, delay);
  };

  const handleMouseEnter = () => {
    if (showOnHover) {
      setIsHovering(true);
      showMenu();
    }
  };

  const handleMouseLeave = () => {
    if (showOnHover) {
      setIsHovering(false);
      hideMenu();
    }
  };

  const handleClick = () => {
    if (showOnClick) {
      setIsVisible(!isVisible);
    }
  };

  const handleOptionClick = (option: HoverMenuOption) => {
    option.onClick();
    if (closeOnSelect) {
      setIsVisible(false);
    }
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'bottom-right':
        return 'top-full right-0 mt-1';
      case 'top-left':
        return 'bottom-full left-0 mb-1';
      case 'top-right':
        return 'bottom-full right-0 mb-1';
      case 'bottom-center':
        return 'top-full left-1/2 transform -translate-x-1/2 mt-1';
      default: // bottom-left
        return 'top-full left-0 mt-1';
    }
  };

  // Cerrar el menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsVisible(false);
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isVisible]);

  // Limpiar timeout al desmontar
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative inline-block ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {/* Trigger */}
      <div className={`${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
        {trigger}
      </div>

      {/* Menu */}
      {isVisible && (
        <div
          className={`absolute z-50 min-w-48 rounded-md border border-gray-200 bg-white shadow-lg ${getPositionClasses()} ${menuClassName} `}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <div className="py-1">
            {options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleOptionClick(option)}
                className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors duration-150 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none ${option.isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-700'} ${option.className || ''} `}
              >
                {option.icon && <span className="h-4 w-4 flex-shrink-0">{option.icon}</span>}
                <div className="flex-1">
                  <div className="font-medium">{option.label}</div>
                  {option.description && (
                    <div className="mt-0.5 text-xs text-gray-500">{option.description}</div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export { HoverMenu };
