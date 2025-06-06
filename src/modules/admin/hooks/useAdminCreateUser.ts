import { BaseCity } from "@/types/city";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { CityService } from "../services/cities.service";
import { UserService } from "../services/user.service";

interface CreateUserFormData {
    name: string;
    email: string;
    password: string;
    city: BaseCity | null;
}

export function useAdminCreateUser() {
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState<CreateUserFormData>({
        name: '',
        email: '',
        password: '',
        city: null
    });

    // Obtener las ciudades
    const { data: cities = [] } = useQuery<BaseCity[]>({
        queryKey: ['cities'],
        queryFn: async () => {
            const response = await CityService.getCities();
            return response.data;
        }
    });

    // Mutación para crear el usuario
    const createMutation = useMutation({
        mutationFn: (userData: CreateUserFormData) => 
            UserService.createUser({
                name: userData.name,
                email: userData.email,
                password: userData.password,
                city: userData.city?.id || '',
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            // Reset form after successful creation
            setFormData({
                name: '',
                email: '',
                password: '',
                city: null
            });
        }
    });

    const handleInputChange = (field: string, value: string | BaseCity | null) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        return createMutation.mutateAsync(formData);
    };

    return {
        formData,
        cities,
        handleInputChange,
        handleSubmit,
        isCreating: createMutation.isPending,
        createError: createMutation.error,
        createSuccess: createMutation.isSuccess
    };
}
