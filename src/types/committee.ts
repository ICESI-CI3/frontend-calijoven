import { User } from './user';

export type BaseCommittee = {
  id: string;
  name: string;
};

export type Committee = BaseCommittee & {
  leader: User;
  members: User[];
};

export type CommitteeCreateRequest = {
  name: string;
  leaderId: string;
};

export type CommitteeUpdateRequest = {
  name?: string;
  leaderId?: string;
};

export type CommitteeMemberRequest = {
  userId: string;
};

export interface CommitteeMember {
  id: string;
  name: string;
  email: string;
  role?: string;
}

export interface Committee {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  members: CommitteeMember[];
  organizationId: string;
}

export interface CreateCommitteeDto {
  name: string;
  description: string;
}

export interface UpdateCommitteeDto {
  name?: string;
  description?: string;
}

export interface AddMemberDto {
  userId: string;
}
