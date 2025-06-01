import { PublicationTypeEnum } from "@/types/publication";

export type PublicationType = {
  value: PublicationTypeEnum;
  label: string;
};

export const publicationTypes: Record<string, PublicationType> = {
  news: { value: 'news', label: 'Noticias' },
  event: { value: 'event', label: 'Eventos' },
  offer: { value: 'offer', label: 'Ofertas' },
};
