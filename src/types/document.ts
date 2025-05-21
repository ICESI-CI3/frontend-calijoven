import { DocumentType } from './documentType';

export type Document = {
  id: string;
  title: string;
  file_url: string;
  date: string;
  type: DocumentType;
  organization: string;
};

export type DocumentCreateRequest = {
  title: string;
  typeId: string;
  organizationId: string;
  date: string;
};
