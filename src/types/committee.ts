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
