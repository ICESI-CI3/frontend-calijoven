import apiClient from '@/lib/api/client';
import { API_ROUTES } from '@/lib/constants/api';

export type Banner = {
  id: string;
  title: string;
  imageUrl: string;
  public: boolean;
  created_at: string;
  link: string;
};

export type PageMeta = {
  itemCount: number;
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
};

export type PageResponse<T> = {
  data: T[];
  meta: PageMeta;
};

export const getBanners = async (publicOnly: boolean = true): Promise<Banner[]> => {
  try {
    const response = await apiClient.get<PageResponse<Banner>>(API_ROUTES.BANNERS.BASE, {
      params: {
        public: publicOnly,
        take: 10,
        order: 'DESC',
      },
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching banners:', error);
    throw error;
  }
};
