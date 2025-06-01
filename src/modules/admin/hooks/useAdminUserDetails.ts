import { BaseCity } from "@/types/city";
import { getUser, Role, UserUpdateRequest } from "@/types/user";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { CityService } from "../services/cities.service";
import { RoleService } from "../services/role.service";
import { UserService } from "../services/user.service";

interface FormData {
    name: string;
    email: string;
    roles: string[];
    city: BaseCity | null;
    isPublic: boolean;
    banned: boolean;
}

export function useUserManagement(userId: string){
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        roles: [] as string[], // Array de IDs de roles
        city: null,
        isPublic: false,
        banned: false
    });
    
    // Obtener el usuario
    const {
        data: user,
        isLoading,
    isError,
    error,
    refetch,
    } = useQuery<getUser>({
        queryKey: ['user', userId],
        queryFn: () => UserService.getUser(userId),
        enabled: !!userId,
    });

    // Obtener los roles
    const { data: roles = [] } = useQuery<Role[]>({
        queryKey: ['roles'],
        queryFn: () => RoleService.getRoles()
    }) 

    // Obtener las cuidades
    const { data: cities = [] } = useQuery<BaseCity[]>({
        queryKey: ['cities'],
        queryFn: async () => {
            const response = await CityService.getCities();
            return response.data;
        }
    })

    // Mutación para actualizar el usuario
    const updateMutation = useMutation({
        mutationFn: (updateData: UserUpdateRequest) => UserService.updateUser(userId, updateData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user', userId] })
        }
    })

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                roles: user.roles?.map(role => role.id) || [], // Mapeamos todos los roles a sus IDs
                city: user.city || null,
                isPublic: user.isPublic || false,
                banned: user.banned || false
            });
        }
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) return;

        // Encontrar roles que se agregaron y se removieron
        const currentRoleIds = user.roles.map(role => role.id);
        const newRoleIds = formData.roles;
        
        const rolesToAdd = roles.filter(role => 
            newRoleIds.includes(role.id) && !currentRoleIds.includes(role.id)
        );
        
        const rolesToRemove = roles.filter(role => 
            currentRoleIds.includes(role.id) && !newRoleIds.includes(role.id)
        );

        const updateData: UserUpdateRequest = {
            name: formData.name !== user.name ? formData.name : undefined,
            email: formData.email !== user.email ? formData.email : undefined,
            city: formData.city?.id !== user.city?.id ? formData.city?.id : undefined,
            addRoles: rolesToAdd.length > 0 ? rolesToAdd : undefined,
            removeRoles: rolesToRemove.length > 0 ? rolesToRemove : undefined,
            isPublic: formData.isPublic !== user.isPublic ? formData.isPublic : undefined,
            banned: formData.banned !== user.banned ? formData.banned : undefined,
        };

        return updateMutation.mutateAsync(updateData);
    };

    const handleInputChange = (field: string, value: string | boolean | BaseCity | null) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleAddRole = async (roleId: string) => {
        const currentRoles = formData.roles || [];
        if (!currentRoles.includes(roleId)) {
            // Actualizar el estado local
            setFormData(prev => ({
                ...prev,
                roles: [...currentRoles, roleId]
            }));

            // Actualizar en el backend
            await UserService.updateUser(userId, {
                addRoles: [roles.find(role => role.id === roleId)!]
            });

            // Invalidar la consulta para actualizar la UI
            queryClient.invalidateQueries({ queryKey: ['user', userId] });
        }
    };

    const handleRemoveRole = async (roleId: string) => {
        // Actualizar el estado local
        setFormData(prev => ({
            ...prev,
            roles: prev.roles.filter(id => id !== roleId)
        }));

        // Actualizar en el backend
        await UserService.updateUser(userId, {
            removeRoles: [roles.find(role => role.id === roleId)!]
        });

        // Invalidar la consulta para actualizar la UI
        queryClient.invalidateQueries({ queryKey: ['user', userId] });
    };

    return {
        // Datos y estados del usuario
        user,
        isLoading,
        isError,
        error,
        
        // Datos del formulario
        formData,
        setFormData,
        
        // Datos disponibles
        roles,
        cities,
        
        // Funciones
        handleSubmit,
        handleInputChange,
        handleAddRole,
        handleRemoveRole,
        updateMutation,
        
        // Estado de la mutación
        isUpdating: updateMutation.isPending,
        updateError: updateMutation.error,
        updateSuccess: updateMutation.isSuccess,
        refetch
    };
}