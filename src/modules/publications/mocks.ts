import type { Publication, PublicationType, Tag, Attachment, EventDto, NewsDto, OfferDto } from '@/types/publication';
import type { Organization } from '@/types/organization';
import type { City } from '@/types/city';

export const mockPublication: Publication = {
  id: '1',
  title: 'Test Publication',
  description: 'Test Description',
  content: '<p>Test Content</p>',
  type: {
    name: 'event',
    description: 'Evento'
  } as PublicationType,
  published_at: '2024-01-01T00:00:00.000Z',
  published_by: {
    id: '1',
    name: 'Test Author',
    profilePicture: 'test.jpg',
    banned: false,
  },
  organizers: [
    {
      id: '1',
      name: 'Test Organization',
      acronym: 'TO',
      public: true,
      members: [],
      committees: [],
      documents: [],
    },
  ],
  cities: [
    {
      id: '1',
      name: 'Test City',
      departmentId: 1,
    } as City,
  ],
  tags: [
    {
      id: '1',
      name: 'Test Tag',
      description: 'Test Tag Description',
    } as Tag,
  ],
  attachments: [
    {
      id: '1',
      name: 'test.pdf',
      url: 'https://example.com/test.pdf',
      format: 'application/pdf',
    } as Attachment,
  ],
  createdAt: '2024-01-01T00:00:00.000Z',
  event: {
    date: '2024-01-01T00:00:00.000Z',
    location: 'Test Location',
    registrationLink: 'https://example.com/register',
  } as EventDto,
  news: undefined,
  offer: undefined,
  registrations: [],
  registered: 0,
};

export const mockPublications: Publication[] = [
  mockPublication,
  {
    id: '2',
    title: 'Test Publication 2',
    description: 'Test Description 2',
    content: 'Test Content 2',
    type: {
      name: 'news',
      description: 'Noticia',
    } as PublicationType,
    published_at: null,
    published_by: undefined,
    organizers: [],
    cities: [],
    tags: [],
    attachments: [],
    createdAt: '2024-01-02T00:00:00.000Z',
    event: undefined,
    news: {
      author: 'Test Author',
    } as NewsDto,
    offer: undefined,
    registrations: [],
    registered: 0,
  },
];

export const mockUserOrganizations: Organization[] = [
  {
    id: '1',
    name: 'Test Organization 1',
    acronym: 'TO1',
    public: true,
    members: [],
    committees: [],
    documents: [],
  },
  {
    id: '2',
    name: 'Test Organization 2',
    acronym: 'TO2',
    public: true,
    members: [],
    committees: [],
    documents: [],
  },
];

export const mockOfferTypes = [
  {
    id: '1',
    name: 'Test Offer Type',
  },
];

export const mockCities = [
  {
    id: '1',
    name: 'Test City 1',
    departmentId: 1,
  } as City,
  {
    id: '2',
    name: 'Test City 2',
    departmentId: 2,
  } as City,
];

export const mockTags = [
  {
    id: '1',
    name: 'Test Tag 1',
    description: 'Test Tag Description 1',
  } as Tag,
  {
    id: '2',
    name: 'Test Tag 2',
    description: 'Test Tag Description 2',
  } as Tag,
];

export const mockPublicationService = {
  getPublications: jest.fn(),
  deletePublication: jest.fn(),
  generateSingleReport: jest.fn(),
  createPublication: jest.fn(),
  updatePublication: jest.fn(),
  getPublication: jest.fn(),
};

export const mockUsePublications = {
  publications: mockPublications,
  isLoading: false,
  error: null,
  refetch: jest.fn(),
  createPublication: jest.fn(),
  updatePublication: jest.fn(),
  deletePublication: jest.fn(),
  generateReport: jest.fn(),
}; 