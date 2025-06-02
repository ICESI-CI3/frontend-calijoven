'use client';

import { Alert } from '@/components/Alert';
import { Avatar } from '@/components/Avatar';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Select } from '@/components/Select';
import { Spinner } from '@/components/Spinner';
import { Tag } from '@/components/Tag';
import { ROUTES } from '@/lib/constants/routes';
import { UserFormStatus } from '@/modules/admin/components/User/UserForm/UserFormStatus';
import { useUserManagement } from '@/modules/admin/hooks/useAdminUserDetails';
import { EyeIcon, EyeSlashIcon, SignalIcon, SignalSlashIcon } from '@heroicons/react/24/outline';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function UserDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;
  const [selectedRole, setSelectedRole] = useState<string>('');
  
  const {
    user,
    isLoading,
    isError,
    error,
    formData,
    setFormData,
    roles,
    cities,
    updateMutation,
    isUpdating,
    handleSubmit,
    handleInputChange,
    handleAddRole,
    handleRemoveRole,
    updateSuccess,
    updateError,
    refetch,
  } = useUserManagement(userId);

  useEffect(() => {
    if (updateSuccess) {
      const timer = setTimeout(() => {
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [updateSuccess]);

  const onAddRole = async () => {
    if (!selectedRole) return;
    try {
      await handleAddRole(selectedRole);
      setSelectedRole('');
    } catch (error) {
      console.error('Error al agregar rol:', error);
    }
  };

  const onRemoveRole = async (roleId: string) => {
    try {
      await handleRemoveRole(roleId);
    } catch (error) {
      console.error('Error al remover rol:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  if (isError && !user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="py-12 text-center">
          <Alert
            type="error"
            message={error instanceof Error ? error.message : 'Error al cargar el usuario'}
          />
          <div className="mt-4 flex justify-center gap-2">
            <Button onClick={() => refetch()}>Reintentar</Button>
            <Button variant="outline" onClick={() => router.back()}>
              Volver
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="py-12 text-center">
          <p className="mb-4 text-red-600">Usuario no encontrado</p>
          <Button variant="outline" onClick={() => router.back()}>
            Volver
          </Button>
        </div>
      </div>
    );
  }

  const availableRoleOptions = roles
    ? roles
        .filter((role) => !user.roles.some((ur) => ur.id === role.id))
        .map((role) => ({ value: role.id, label: role.name }))
    : [];

  const cityOptions = cities?.map(city => ({
    value: city.id,
    label: city.name
  })) || [];

  return (
    <div className="p-6">
      <section className="flex flex-col gap-4">
        <div>
          <h1 className='text-2xl font-bold'>Detalles del Usuario</h1>
          <p className='text-gray-600'>Aquí puedes gestionar los usuarios de la plataforma.</p>
        </div>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          {/* Primara Sección */}
          <div className='flex flex-col md:flex-row gap-4 w-full'>
            <div className='gap-2 rounded-lg border border-gray-200 bg-card p-6 shadow-sm flex-[0.3] flex flex-col items-center justify-center text-center'>
              <Avatar
                src={user.profilePicture || '/default-avatar.png'}
                alt={user.name}
                size="2xl"
              />
              <p className='text-lg font-bold'>{user.name}</p>
              <p className='text-sm text-gray-600'>{user.email}</p>
            </div>
            <div className='rounded-lg border border-gray-200 bg-card p-6 shadow-sm flex-[0.7]'>
              <h2 className='text-lg font-bold mb-4'>Información del usuario</h2>
              <div className="space-y-6">
                {/* Row 1: Nombre y Correo */}
                <div className="flex gap-4 flex-col md:flex-row">
                  <div className="flex-1">
                    <Input
                      label="Nombre completo"
                      placeholder="Ingresa el nombre completo del usuario"
                      required
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                    />
                  </div>
                  <div className="flex-1">
                    <Input
                      label="Correo electrónico"
                      type="email"
                      placeholder="Ingresa tu correo electrónico"
                      required
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                    />
                  </div>
                </div>

                {/* Row 2: Ciudad */}
                <div>
                  <Select
                    label='Ciudad'
                    options={cityOptions}
                    value={formData.city?.id || ''}
                    onChange={(value) => {
                      const selectedCity = cities?.find(city => city.id === value) || null;
                      handleInputChange('city', selectedCity);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Segunda Sección */}
          <div className='rounded-lg border border-gray-200 bg-card p-6 shadow-sm'>
            <h2 className='text-lg font-bold mb-4'>Roles del usuario</h2>
            <div className="space-y-4">
              <div className="flex gap-2 items-end">
                <Select
                  label="Agregar rol"
                  options={availableRoleOptions}
                  value={selectedRole}
                  onChange={(value) => setSelectedRole(value)}
                  disabled={availableRoleOptions.length === 0}
                />
                <Button
                  variant='primary'
                  onClick={onAddRole}
                  disabled={!selectedRole}
                >
                  Agregar
                </Button>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Roles asignados</h3>
                <div className="flex flex-wrap gap-2">
                  {user.roles.map((role) => (
                    <div
                      key={role.id}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 text-blue-700"
                    >
                      <Tag
                        color="primary"
                        onRemove={() => onRemoveRole(role.id)}
                      >
                        {role.name}
                      </Tag>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Tercera Sección */}
          <div className='rounded-lg border border-gray-200 bg-card p-6 shadow-sm'>
            <h2 className='text-lg font-bold mb-4'>Estado del usuario </h2>
            <div className="flex gap-4 w-full flex-col md:flex-row">
              {/* Estado Perfil Público */}
              <UserFormStatus
                status={formData.isPublic}
                onStatusChange={(value) => handleInputChange('isPublic', value)}
                title="Visibilidad del perfil"
                trueIcon={<EyeIcon className="h-6 w-6 text-blue-600" />}
                falseIcon={<EyeSlashIcon className="h-6 w-6 text-gray-600" />}
                trueText="El perfil es visible para otros usuarios"
                falseText="El perfil es privado y no visible para otros usuarios"
              />

              {/* Estado Usuario Baneado */}
              <UserFormStatus
                status={formData.banned}
                onStatusChange={(value) => handleInputChange('banned', value)}
                title="Estado del usuario"
                trueIcon={<SignalSlashIcon className="h-6 w-6 text-red-600" />}
                falseIcon={<SignalIcon className="h-6 w-6 text-green-600" />}
                trueText="El usuario está baneado y no puede acceder a la plataforma"
                falseText="El usuario no está baneado y puede acceder a la plataforma"
              />
            </div>
          </div>

          {/* Sección de Acciones */}
          <div className='flex flex-row gap-4 items-end justify-end'>
            <Button
              variant='outline'
              type="button"
              onClick={() => router.push(ROUTES.ADMIN.USERS.PATH)}
            >
              Volver
            </Button>
            <Button
              type="submit"
              disabled={isUpdating}
              isLoading={isUpdating}
            >
              {isUpdating ? 'Actualizando...' : 'Actualizar Datos'}
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}