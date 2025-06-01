import { User } from './user';
import { Committee } from './committee';
import { Document } from './document';

export interface Organization {
  id: string;
  name: string;
  acronym: string;
  public: boolean;
  members: PublicUserDto[];
  committees: CommitteeDto[];
  documents: DocumentDto[];
}

export interface CreateOrganizationDto {
  name: string;
  acronym: string;
  public?: boolean;
}

export type UpdateOrganizationDto = Partial<CreateOrganizationDto>;

export interface MemberOrganizationDto {
  email: string;
}

export interface PublicUserDto {
  id: string;
  name: string;
  email: string;
  profilePicture: string;
  banned: boolean;
  city: string;
  leadingCommittees?: SimpleCommitteeDto[];
  organizations?: SimpleOrganizationDto[];
  committees?: SimpleCommitteeDto[];
}

export interface SimpleCommitteeDto {
  id: string;
  name: string;
}

export interface SimpleOrganizationDto {
  id: string;
  name: string;
  acronym: string;
  public: boolean;
}

export interface CommitteeDto {
  id: string;
  name: string;
  leader: PublicUserDto;
  members: PublicUserDto[];
}

export type OrganizationPreviewDto = SimpleOrganizationDto & {
  membersCount: number;
  documentsCount: number;
  committeesCount: number;
}

export interface DocumentDto {
  id: string;
  title: string;
  file_url: string;
  date: Date;
  type: DocumentTypeDto;
  organization: OrganizationDto;
}

export interface DocumentTypeDto {
  id: string;
  name: string;
  description?: string;
}

export interface OrganizationDto {
  id: string;
  name: string;
  acronym: string;
  public: boolean;
}

export interface OrganizationFilters {
  page?: number;
  limit?: number;
  order?: 'ASC' | 'DESC';
  search?: string;
  public?: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    itemCount: number;
    totalItems: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}
