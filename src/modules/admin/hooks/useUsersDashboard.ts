// hooks/useUsersDashboard.ts
import { getUser, UserFilters } from '@/types/user';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { UserService } from '../services/user.service';

export type UsersDashboardOptions = {
    initialFilters?: UserFilters;
    initialPage?: number;
    initialLimit?: number;
}

type UsersQueryResult = {
    data: getUser[];
    total: number;
}

export function useUsersDashboard({
    initialFilters = {},
    initialPage = 1,
    initialLimit = 5,
  }: UsersDashboardOptions) {
    const [filters, setFilters] = useState<UserFilters>(initialFilters);
    const [page, setPage] = useState(initialPage);
    const [limit, setLimit] = useState(initialLimit);
    const [banningUserId, setBanningUserId] = useState<string | null>(null);
    const [hidingUserId, setHidingUserId] = useState<string | null>(null);

    const queryKey = useMemo(() => ['user', filters, page, limit], [filters, page, limit]);

    const { data, isLoading, isError, error, refetch } = useQuery<UsersQueryResult>({
        queryKey,
        queryFn: () => UserService.getUsers(filters, page, limit),
      });

    const handleSearch = (search: string) => {
        setFilters((prev) => ({ ...prev, name: search }));
        setPage(1);
    }

    const handleBan = async (id: string) => {
        try {
            setBanningUserId(id);
            await UserService.banUser(id);
            refetch(); 
        } catch (error) {
            console.error('Error al banear usuario:', error);
        } finally {
            setBanningUserId(null);
        }
    }

    const handleHide = async (id: string) => {
        try {
            setHidingUserId(id);
            await UserService.publicUser(id);
            refetch(); 
        } catch (error) {
            console.error('Error al cambiar visibilidad del usuario:', error);
        } finally {
            setHidingUserId(null);
        }
    }
    
    
    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    return {
        users: data?.data || [],
        total: data?.total || 0,
        isLoading,
        isError,
        error,
        filters,
        page,
        limit,
        handleSearch,
        handlePageChange,
        handleBan,
        handleHide,
        refetch,
        banningUserId,
        hidingUserId,
    };
}