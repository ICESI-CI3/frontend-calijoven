'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { SearchableSelect } from '@/components/SearchableSelect';
import { Tag } from '@/components/Tag';
import { governanceService } from '@/lib/api/governance.service';
import type { BaseCity } from '@/types/city';
import type { RegisterFormData } from '@/types/auth';
import { Alert } from '@/components/Alert';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/constants/routes';
import AuthService from '@/modules/auth/services/auth.service';
import { validateRegisterFormData } from '@/lib/validation/authValidation';

export function RegisterForm() {
  const [selectedCity, setSelectedCity] = useState<BaseCity | null>(null);
  const [formData, setFormData] = useState({
    nombres: '',
    correo: '',
    password: '',
    acceptTerms: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | undefined>(undefined);

  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [id]: type === 'checkbox' ? checked : value,
    });
  };

  const handleCitySelect = (cityItem: { id: string; name: string; description?: string }) => {
    setSelectedCity({ id: cityItem.id, name: cityItem.name });
  };

  const handleCityRemove = () => {
    setSelectedCity(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setPasswordError(undefined);

    const validationErrors = validateRegisterFormData(formData, selectedCity);

    if (validationErrors.formError || validationErrors.passwordError) {
        setError(validationErrors.formError);
        setPasswordError(validationErrors.passwordError);
        return;
    }

    setIsLoading(true);

    const userData: RegisterFormData = {
        name: formData.nombres,
        email: formData.correo,
        password: formData.password,
        city: selectedCity!.id,
    };

    try {
        const response = await AuthService.register(userData);
        console.log('Registro exitoso:', response);
        router.push(ROUTES.AUTH.LOGIN.PATH);
    } catch (err: any) {
        console.error('Error en el registro:', err);
        if (err.response && err.response.data && err.response.data.message) {
             setError(err.response.data.message);
        } else if (err.message) {
            setError('Error en el registro: ' + err.message);
        } else {
            setError('Error al registrar el usuario. Por favor, intenta de nuevo.');
        }
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      {error && <Alert type="error" message={error} />}
      <div className="space-y-4">
        <Input
          id="nombres"
          label="Nombres *"
          placeholder="Tus nombres completos"
          value={formData.nombres}
          onChange={handleInputChange}
          required
        />

        <Input
          id="correo"
          type="email"
          label="Correo Electrónico *"
          placeholder="tu.email@ejemplo.com"
          value={formData.correo}
          onChange={handleInputChange}
          required
        />

        <div>
            <label htmlFor="ciudad" className="block text-sm font-medium text-foreground">Ciudad *</label>
            <div className="mb-2 flex flex-wrap gap-2">
                {selectedCity ? (
                    <Tag
                        key={selectedCity.id}
                        onRemove={handleCityRemove}
                        className="cursor-pointer border-primary-200 bg-primary-100 text-primary-800"
                    >
                        {selectedCity.name}
                    </Tag>
                ) : (
                     <span className="text-sm italic text-muted-foreground">Selecciona tu ciudad</span>
                )}
            </div>
            {!selectedCity && (
                <SearchableSelect
                    label=""
                    placeholder="Selecciona tu ciudad"
                    searchFunction={governanceService.searchCities}
                    onSelect={handleCitySelect}
                    maxHeight="150px"
                />
            )}
            {!selectedCity && error && error.includes('ciudad') && <p className="text-sm text-red-500">Selecciona una ciudad.</p>}
        </div>

        <div>
            <Input
              id="password"
              type="password"
              label="Contraseña *"
              placeholder="Mínimo 8 caracteres"
              value={formData.password}
              onChange={handleInputChange}
              required
              minLength={8}
            />
            {passwordError && <p className="mt-1 text-sm text-red-500">{passwordError}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="acceptTerms"
            checked={formData.acceptTerms}
            onChange={handleInputChange}
            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
          />
          <label htmlFor="acceptTerms" className="ml-2 block text-sm text-muted-foreground">
            Acepto los <Link href="#" className="font-medium text-primary hover:underline">términos y condiciones</Link> y la <Link href="#" className="font-medium text-primary hover:underline">política de privacidad</Link> *
          </label>
        </div>
      </div>

      <div>
        <Button type="submit" className="w-full" disabled={isLoading} isLoading={isLoading}>
          Crear Cuenta
        </Button>
      </div>
    </form>
  );
} 