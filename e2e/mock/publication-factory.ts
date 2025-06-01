import { faker } from '@faker-js/faker';

/**
 * Tipos base para las entidades
 */
export interface MockUser {
  id: string;
  name: string;
  email: string;
  profilePicture: string;
  banned: boolean;
  city: MockCity;
  leadingCommittees: string[];
  organizations: MockOrganization[];
  committees: string[];
  roles: string[];
}

export interface MockCity {
  id: string;
  name: string;
}

export interface MockOrganization {
  id: string;
  name: string;
  acronym: string;
  public: boolean;
}

export interface MockPublication {
  id: string;
  title: string;
  description: string;
  content?: string;
  published_at: string | null;
  type: {
    name: string;
    description: string;
  };
  attachments: MockAttachment[];
  organizers: MockOrganization[];
  cities: MockCity[];
  tags: MockTag[];
  createdAt: string;
  event?: MockEvent | null;
  news?: MockNews | null;
  offer?: MockOffer | null;
}

export interface MockEvent {
  id: string;
  date: string;
  location: string;
  registrationLink?: string;
}

export interface MockNews {
  id: string;
  author: string;
}

export interface MockOffer {
  id: string;
  offerType: string;
  external_link?: string;
  deadline?: string;
}

export interface MockAttachment {
  id: string;
  name: string;
  format: string;
  url: string;
}

export interface MockTag {
  id: string;
  name: string;
  description: string;
}
/**
 * Factory principal para generar publicaciones mock
 */
export class PublicationFactory {
  static create(overrides: Partial<MockPublication> = {}): MockPublication {
    const publicationTypes = [
      { name: 'event', description: 'Eventos' },
      { name: 'news', description: 'Noticias' },
      { name: 'offer', description: 'Ofertas' },
    ];

    const type = overrides.type || faker.helpers.arrayElement(publicationTypes);
    const id = faker.string.uuid();

    const basePublication: MockPublication = {
      id,
      title: faker.lorem.sentence(4),
      description: faker.lorem.sentence(8),
      content: faker.lorem.paragraphs(3),
      published_at: faker.datatype.boolean() ? faker.date.recent().toISOString() : null,
      type,
      attachments: [],
      organizers: [],
      cities: [],
      tags: [],
      createdAt: faker.date.recent().toISOString(),
      event: null,
      news: null,
      offer: null,
      ...overrides,
    };

    // Agregar datos específicos según el tipo
    if (type.name === 'event') {
      basePublication.event = {
        id,
        date: faker.date.recent().toISOString(),
        location: faker.location.city(),
        registrationLink: faker.internet.url(),
      };
    } else if (type.name === 'news') {
      basePublication.news = {
        id,
        author: faker.person.fullName(),
      };
    } else if (type.name === 'offer') {
      basePublication.offer = {
        id,
        offerType: faker.helpers.arrayElement([
          'job',
          'scholarship',
          'exchange',
          'entrepreneurship',
        ]),
        external_link: faker.internet.url(),
        deadline: faker.date.recent().toISOString(),
      };
    }

    return basePublication;
  }

  static createMany(count: number, overrides: Partial<MockPublication> = {}): MockPublication[] {
    return Array.from({ length: count }, () => this.create(overrides));
  }

  static event(overrides: Partial<MockPublication> = {}): MockPublication {
    return this.create({
      type: { name: 'event', description: 'Eventos' },
      title: `${faker.helpers.arrayElement(['Taller', 'Conferencia', 'Seminario', 'Festival'])} de ${faker.helpers.arrayElement(['Programación', 'Emprendimiento', 'Arte', 'Música', 'Deporte'])}`,
      ...overrides,
    });
  }

  static news(overrides: Partial<MockPublication> = {}): MockPublication {
    return this.create({
      type: { name: 'news', description: 'Noticias' },
      title: `${faker.helpers.arrayElement(['Nuevo', 'Importante', 'Último'])} ${faker.helpers.arrayElement(['Programa', 'Proyecto', 'Anuncio', 'Comunicado'])} ${faker.helpers.arrayElement(['de Becas', 'Juvenil', 'Educativo', 'Cultural'])}`,
      ...overrides,
    });
  }

  static offer(overrides: Partial<MockPublication> = {}): MockPublication {
    return this.create({
      type: { name: 'offer', description: 'Ofertas' },
      title: `${faker.helpers.arrayElement(['Convocatoria', 'Oportunidad', 'Beca'])} ${faker.helpers.arrayElement(['de Empleo', 'de Estudio', 'de Intercambio', 'de Emprendimiento'])}`,
      ...overrides,
    });
  }

  static published(overrides: Partial<MockPublication> = {}): MockPublication {
    return this.create({
      published_at: faker.date.recent().toISOString(),
      ...overrides,
    });
  }

  static draft(overrides: Partial<MockPublication> = {}): MockPublication {
    return this.create({
      published_at: null,
      ...overrides,
    });
  }
}
