import { User } from './user';

export type Committee = {
  id: string;
  name: string;
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
