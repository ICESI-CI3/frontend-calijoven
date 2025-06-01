'use client';

import { Avatar } from '@/components/Avatar';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Select } from '@/components/Select';
import { Toggle } from '@/components/Toggle';
import { User } from '@/types/user';

interface UserFormProps {
  user?: User;
  mode: 'view' | 'edit';
  onSubmit?: (data: Partial<User>) => void;
  onCancel?: () => void;
}

export function UserForm({ user, mode, onSubmit, onCancel }: UserFormProps) {
  const isViewMode = mode === 'view';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement form submission logic
    if (onSubmit) {
      // onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Profile Picture Section */}
      <div className="flex flex-  col items-center space-y-4">
        <Avatar
          src={user?.profilePicture}
          alt={user?.name || 'User'}
          size="xl"
        />
        {!isViewMode && (
          <Button variant="outline" size="sm">
            Cambiar foto
          </Button>
        )}
      </div>

      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Nombre"
          value={user?.name}
          disabled={isViewMode}
          required
        />
        <Input
          label="Correo electrónico"
          type="email"
          value={user?.email}
          disabled={isViewMode}
          required
        />
        <Select
          label="Ciudad"
          value={user?.city?.id ?? ''}
          disabled={isViewMode}
          options={[
            { value: '1', label: 'Ciudad de México' },
            // Add more cities as needed
          ]}
          onChange={() => {}}
        />
      </div>

      {/* Roles and Permissions */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Roles y Permisos</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {user?.roles.map((role) => (
            <div key={role} className="flex items-center space-x-2">
              <Toggle
                checked={true}
                disabled={isViewMode}
                label={role}
                onChange={() => {}}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Status Settings */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Configuración de Estado</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Toggle
            checked={user?.isPublic ?? false}
            disabled={isViewMode}
            label="Perfil Público"
            onChange={() => {}}
          />
          <Toggle
            checked={user?.banned ?? false}
            disabled={isViewMode}
            label="Usuario Baneado"
            onChange={() => {}}
          />
        </div>
      </div>

      {/* Action Buttons */}
      {!isViewMode && (
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
          >
            Guardar Cambios
          </Button>
        </div>
      )}
    </form>
  );
}