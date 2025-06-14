export type PQRSPriority = 'low' | 'medium' | 'high';

export interface PQRSTypeEntity {
  id: string;
  name: string;
}

export interface PQRSStatusEntity {
  name: string;
  description: string;
}

export interface PQRS {
  id: string;
  title: string;
  description: string;
  type: PQRSTypeEntity | null;
  typeId?: string;
  status: PQRSStatusEntity;
  priority?: PQRSPriority;
  userId: string;
  createdAt: string;
  updatedAt: string;
  attachments?: string[];
  category?: string;
  adminComment?: string | null;
  user?: {
    id: string;
    name: string;
    profilePicture: string;
    banned: boolean;
  };
}

export interface CreatePQRSDto {
  title: string;
  description: string;
  typeId: string;
  priority?: PQRSPriority;
  attachments?: File[];
}

export interface UpdatePQRSDto {
  title?: string;
  description?: string;
  status?: string | PQRSStatusEntity;
  adminComment?: string;
  category?: string;
  priority?: PQRSPriority;
}

export interface PQRSFilters {
  type?: PQRSTypeEntity;
}

export interface AdminPQRSFilters {
  status?: string;
  type?: string;
  user?: string;
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedPQRSResponse {
  items: PQRS[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
} 