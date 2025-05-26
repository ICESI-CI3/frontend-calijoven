import { User } from './user';
import { Committee } from './committee';
import { Document } from './document';

export type BaseOrganization = {
  id: string;
  name: string;
  acronym: string;
  public: boolean;
};

export type Organization = BaseOrganization & {
  members: User[];
  committees: Committee[];
  documents: Document[];
};

export type OrganizationCreateRequest = {
  name: string;
  acronym: string;
  public: boolean;
};

export type OrganizationUpdateRequest = {
  name?: string;
  acronym?: string;
  public?: boolean;
};

export type OrganizationMemberRequest = {
  userId: string;
};
