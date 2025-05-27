
export type BaseCity = {
  id: string;
  name: string;
};

export type City = BaseCity & {
  departmentId: number;
};

export type Department = {
  id: number;
  name: string;
};

export type Commune = {
  id: string;
  name: string;
};
