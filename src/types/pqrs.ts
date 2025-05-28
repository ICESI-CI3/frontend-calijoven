export type PQRSStatus = 'pending' | 'in_progress' | 'resolved' | 'rejected' | 'closed';

export type PQRSType = 'petition' | 'complaint' | 'claim' | 'suggestion';

export type PQRSPriority = 'low' | 'medium' | 'high';

export interface PQRS {
  id: string;
  title: string;
  description: string;
  type: PQRSType;
  status: PQRSStatus;
  priority: PQRSPriority;
  userId: string;
  createdAt: string;
  updatedAt: string;
  response?: string;
  attachments?: string[];
  category?: string;
}

export interface CreatePQRSDto {
  title: string;
  description: string;
  type: PQRSType;
  category?: string;
  attachments?: File[];
  priority?: PQRSPriority;
}

export interface UpdatePQRSDto {
  title?: string;
  description?: string;
  status?: PQRSStatus;
  response?: string;
  category?: string;
  priority?: PQRSPriority;
}

export interface PQRSFilters {
  status?: PQRSStatus;
  type?: PQRSType;
  category?: string;
  priority?: PQRSPriority;
  startDate?: string;
  endDate?: string;
  search?: string;
}

export interface PaginatedPQRSResponse {
  items: PQRS[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
} 