'use client';

import { Avatar } from "@/components/Avatar";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Select } from "@/components/Select";
import { useAdminCreateUser } from "@/modules/admin/hooks/useAdminCreateUser";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CreateUserForm() {
    const router = useRouter();
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const {
        formData,
        cities,
        handleInputChange,
        handleSubmit,
        isCreating,
        createError,
        createSuccess
    } = useAdminCreateUser();

    useEffect(() => {
        if (createSuccess) {
            router.push('/admin/usuario');
        }
    }, [createSuccess, router]);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Crear Usuario</h1>
            <p className="text-gray-600 mb-4">
                Completa el formulario para crear un nuevo usuario.
            </p>
            
            {createError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    Error al crear el usuario
                </div>
            )}

            <div className="flex flex-col md:flex-row gap-8">
                {/* Formulario */}
                <div className="w-full rounded-lg border border-gray-200 bg-card p-6 shadow-sm">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            label="Nombre Completo"
                            type="text"
                            placeholder="Ingresa el nombre completo"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            className="w-full p-2 border rounded"
                            required
                        />
                        <Input
                            label="Correo Electrónico"
                            type="email"
                            placeholder="Ingresa el correo electrónico"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className="w-full p-2 border rounded"
                            required
                        />
                        <Input
                            label="Contraseña"
                            type="password"
                            placeholder="Ingresa la contraseña"
                            value={formData.password}
                            onChange={(e) => handleInputChange('password', e.target.value)}
                            className="w-full p-2 border rounded"
                            required
                        />
                        <Select
                            label="Ciudad"
                            options={cities.map(city => ({ value: city.id, label: city.name }))}
                            value={formData.city?.id || ''}
                            onChange={(value) => {
                                const selectedCity = cities.find(city => city.id === value);
                                handleInputChange('city', selectedCity || null);
                            }}
                        />
                        <div className="flex justify-end gap-2 mt-4">
                            <Button
                                variant="outline"
                                type="button"
                                onClick={() => router.push('/admin/usuario')}
                            >
                                Cancelar
                            </Button>
                            <Button
                                variant="primary"
                                type="submit"
                                disabled={isCreating}
                            >
                                {isCreating ? 'Creando...' : 'Crear Usuario'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}