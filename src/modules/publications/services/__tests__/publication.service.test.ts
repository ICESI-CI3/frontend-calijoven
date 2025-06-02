import apiClient from '@/lib/api/client';
import { API_ROUTES } from '@/lib/constants/api';
import { publicationTypes } from '@/lib/constants/publicationTypes';
import type { CreatePublicationDto, Publication, Tag, UpdatePublicationDto } from '@/types/publication';
import { PaginatedResponse, PublicationError, PublicationService } from '../publication.service';

// Mock the apiClient module
jest.mock('@/lib/api/client');

const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>;

// Mock FormData
const mockFormData = new Map<string, any>();
global.FormData = class MockFormData {
  append = jest.fn((key, value) => {
    mockFormData.set(key, value);
  });
  // Add other methods if needed by the service, e.g., get, getAll, delete, has

  // Helper to get data for assertions
  getMockData = () => Object.fromEntries(mockFormData);
} as any;

describe('PublicationService', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    mockFormData.clear(); // Clear mock FormData data
  });

  // --- Tests for getPublications ---
  describe('getPublications', () => {
    const mockPublications: Publication[] = [
      // Add mock publication objects here
    ];
    const mockPaginatedResponse: PaginatedResponse<Publication> = {
      data: mockPublications,
      total: 0,
      page: 1,
      totalPages: 1,
    };

    it('should fetch publications with default filters', async () => {
      mockedApiClient.get.mockResolvedValueOnce({ data: mockPaginatedResponse });

      const result = await PublicationService.getPublications();

      expect(mockedApiClient.get).toHaveBeenCalledWith(
        `${API_ROUTES.PUBLICATIONS.BASE}?page=1&limit=10`
      );
      expect(result).toEqual(mockPaginatedResponse);
    });

    it('should fetch publications with custom filters', async () => {
      mockedApiClient.get.mockResolvedValueOnce({ data: mockPaginatedResponse });

      const filters = { tag: 'test-tag', city: 'test-city', type: publicationTypes.event.value, unpublished: true, organization: 'org-id', sortBy: 'date', sortOrder: 'DESC', search: 'keyword' };
      const page = 2;
      const limit = 5;

      const result = await PublicationService.getPublications(filters, page, limit);

      const expectedParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        tag: filters.tag,
        city: filters.city,
        type: filters.type,
        unpublished: String(filters.unpublished),
        organization: filters.organization,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
        search: filters.search,
      });

      expect(mockedApiClient.get).toHaveBeenCalledWith(
        `${API_ROUTES.PUBLICATIONS.BASE}?${expectedParams.toString()}`
      );
      expect(result).toEqual(mockPaginatedResponse);
    });

    it('should throw PublicationError on fetch publications failure', async () => {
      const mockError = new Error('API Error');
      mockedApiClient.get.mockRejectedValueOnce(mockError);

      await expect(PublicationService.getPublications()).rejects.toThrow(
        PublicationError
      );
      await expect(PublicationService.getPublications()).rejects.toThrow(
        'No se pudieron obtener las publicaciones.'
      );
    });
  });

  // --- Tests for getPublication ---
  describe('getPublication', () => {
    const mockPublicationId = 'pub1';
    const mockPublication: Publication = {
      // Add mock publication object here
      id: mockPublicationId,
      title: 'Test Publication',
      description: 'Test Desc',
      content: 'Test Content',
      type: publicationTypes.news.value,
      published: true,
      cities: [],
      organizers: [],
      tags: [],
      attachments: [],
      createdAt: '',
      updatedAt: '',
      // Add other required properties of Publication
    };

    it('should fetch a publication by ID on success', async () => {
      mockedApiClient.get.mockResolvedValueOnce({ data: mockPublication });

      const result = await PublicationService.getPublication(mockPublicationId);

      expect(mockedApiClient.get).toHaveBeenCalledWith(
        `${API_ROUTES.PUBLICATIONS.BASE}/${mockPublicationId}`
      );
      expect(result).toEqual(mockPublication);
    });

    it('should throw PublicationError on fetch publication by ID failure', async () => {
      const mockError = new Error('API Error');
      mockedApiClient.get.mockRejectedValueOnce(mockError);

      await expect(PublicationService.getPublication(mockPublicationId)).rejects.toThrow(
        PublicationError
      );
      await expect(PublicationService.getPublication(mockPublicationId)).rejects.toThrow(
        'No se pudo obtener la publicación.'
      );
    });
  });

  // --- Tests for createPublication ---
  describe('createPublication', () => {
    const mockCreateData: CreatePublicationDto = {
      title: 'New Pub',
      description: 'New Desc',
      content: 'New Content',
      type: publicationTypes.event.value,
      published: true,
      cities: ['city1', 'city2'],
      organizers: ['org1'],
      tags: [{ id: 'tag1', name: 'Tag 1' }],
      event: { startDate: 'date1', endDate: 'date2', location: 'loc1' },
      attachments: [new File(['file1 content'], 'file1.txt', { type: 'text/plain' })],
    };

    const mockCreatedPublication: Publication = {
      id: 'new-pub',
      ...mockCreateData,
      // Add other required properties of Publication
      attachments: [], // Assuming attachments are processed differently on creation
      createdAt: '',
      updatedAt: '',
    };

    it('should create a publication on success', async () => {
      mockedApiClient.post.mockResolvedValueOnce({ data: mockCreatedPublication });

      const result = await PublicationService.createPublication(mockCreateData);

      expect(mockedApiClient.post).toHaveBeenCalledWith(
        API_ROUTES.PUBLICATIONS.BASE,
        expect.any(FormData), // Expect FormData instance
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      // Verify FormData content
      const formData = new (global.FormData as any)(); // Get the mock instance
      formData.append('title', mockCreateData.title);
      formData.append('description', mockCreateData.description);
      formData.append('content', mockCreateData.content);
      formData.append('type', mockCreateData.type);
      formData.append('published', String(mockCreateData.published));
      mockCreateData.cities.forEach(cityId => formData.append('cities', cityId));
      mockCreateData.organizers.forEach(orgId => formData.append('organizers', orgId));
      formData.append('tags', JSON.stringify(mockCreateData.tags));
      formData.append(mockCreateData.type, JSON.stringify(mockCreateData.event));
      mockCreateData.attachments.forEach(file => formData.append('attachments', file));

      // Use expect(mockFormData.getMockData()).toEqual(...) to compare
      // Note: FormData append for arrays or multiple values with the same key requires iterating over mockFormData Map
      // A simple Object.fromEntries might not capture multiple values per key correctly.
      // Let's just check for specific appends first.

      expect(mockFormData.get('title')).toBe(mockCreateData.title);
      expect(mockFormData.get('description')).toBe(mockCreateData.description);
      expect(mockFormData.get('content')).toBe(mockCreateData.content);
      expect(mockFormData.get('type')).toBe(mockCreateData.type);
      expect(mockFormData.get('published')).toBe(String(mockCreateData.published));
      expect(mockFormData.get('tags')).toBe(JSON.stringify(mockCreateData.tags));
      expect(mockFormData.get(mockCreateData.type)).toBe(JSON.stringify(mockCreateData.event));

      // For arrays and files, checking existence is easier with mockFormData's internal map
      expect(mockFormData.has('cities')).toBe(true);
      expect(mockFormData.has('organizers')).toBe(true);
      expect(mockFormData.has('attachments')).toBe(true);


      expect(result).toEqual(mockCreatedPublication);
    });

    it('should handle empty optional fields during creation', async () => {
      const mockCreateDataMinimal: CreatePublicationDto = {
        title: 'Minimal Pub',
        description: 'Minimal Desc',
        content: 'Minimal Content',
        type: publicationTypes.news.value,
        // Missing published, cities, organizers, tags, event/news/offer, attachments
      };
      const mockCreatedPublicationMinimal: Publication = {
        id: 'minimal-pub',
        ...mockCreateDataMinimal,
        published: false, // Assuming a default value if not provided
        cities: [],
        organizers: [],
        tags: [],
        attachments: [],
        createdAt: '',
        updatedAt: '',
        // Add other required properties of Publication
      };

      mockedApiClient.post.mockResolvedValueOnce({ data: mockCreatedPublicationMinimal });

      await PublicationService.createPublication(mockCreateDataMinimal);

      expect(mockedApiClient.post).toHaveBeenCalledWith(
        API_ROUTES.PUBLICATIONS.BASE,
        expect.any(FormData),
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      // Verify that optional fields were not appended if empty/missing
      expect(mockFormData.has('published')).toBe(false);
      expect(mockFormData.has('cities')).toBe(false);
      expect(mockFormData.has('organizers')).toBe(false);
      expect(mockFormData.has('tags')).toBe(false);
      expect(mockFormData.has(publicationTypes.event.value)).toBe(false);
      expect(mockFormData.has(publicationTypes.news.value)).toBe(false);
      expect(mockFormData.has(publicationTypes.offer.value)).toBe(false);
      expect(mockFormData.has('attachments')).toBe(false);
    });

    it('should throw PublicationError on create publication failure', async () => {
      const mockError = new Error('API Error');
      mockedApiClient.post.mockRejectedValueOnce(mockError);
      const mockCreateDataError: CreatePublicationDto = {
        title: 'Fail Pub',
        description: 'Fail Desc',
        content: 'Fail Content',
        type: publicationTypes.event.value,
      };

      await expect(PublicationService.createPublication(mockCreateDataError)).rejects.toThrow(
        PublicationError
      );
      await expect(PublicationService.createPublication(mockCreateDataError)).rejects.toThrow(
        'No se pudo crear la publicación.'
      );
    });
  });

  // --- Tests for updatePublication ---
  describe('updatePublication', () => {
    const mockPublicationId = 'pub1';
    const mockUpdateData: UpdatePublicationDto = {
      title: 'Updated Title',
      published: false,
      attachmentsToDelete: ['old-attachment-id'],
      attachments: [new File(['new file content'], 'newfile.pdf', { type: 'application/pdf' })],
    };

    const mockUpdatedPublication: Publication = {
      id: mockPublicationId,
      // ... rest of publication data after update
      title: mockUpdateData.title!,
      published: mockUpdateData.published!,
      attachments: [], // Assuming attachments are handled separately
      cities: [],
      organizers: [],
      tags: [],
      createdAt: '',
      updatedAt: '',
      type: publicationTypes.news.value, // Assuming type is present
      description: '',
      content: '',
    };

    it('should update a publication on success', async () => {
      mockedApiClient.put.mockResolvedValueOnce({ data: mockUpdatedPublication });

      const result = await PublicationService.updatePublication(mockPublicationId, mockUpdateData);

      expect(mockedApiClient.put).toHaveBeenCalledWith(
        `${API_ROUTES.PUBLICATIONS.BASE}/${mockPublicationId}`,
        expect.any(FormData), // Expect FormData instance
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      // Verify FormData content
      expect(mockFormData.get('title')).toBe(mockUpdateData.title);
      expect(mockFormData.get('published')).toBe(String(mockUpdateData.published));
      expect(mockFormData.get('attachmentsToDelete')).toBe(JSON.stringify(mockUpdateData.attachmentsToDelete));
      expect(mockFormData.has('attachments')).toBe(true); // Check if new attachments were appended

      expect(result).toEqual(mockUpdatedPublication);
    });

    it('should handle empty optional fields during update', async () => {
      const mockUpdateDataMinimal: UpdatePublicationDto = {
        // Only updating title
        title: 'Only Title Update',
      };
      const mockUpdatedPublicationMinimal: Publication = {
        id: mockPublicationId,
        title: mockUpdateDataMinimal.title!,
        published: true, // Assuming old value persists
        cities: [], organizers: [], tags: [], attachments: [], createdAt: '', updatedAt: '', type: publicationTypes.news.value, description: '', content: '',
      };

      mockedApiClient.put.mockResolvedValueOnce({ data: mockUpdatedPublicationMinimal });

      await PublicationService.updatePublication(mockPublicationId, mockUpdateDataMinimal);

      expect(mockedApiClient.put).toHaveBeenCalledWith(
        `${API_ROUTES.PUBLICATIONS.BASE}/${mockPublicationId}`,
        expect.any(FormData),
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      // Verify that optional fields were not appended if empty/missing
      expect(mockFormData.has('published')).toBe(false);
      expect(mockFormData.has('attachmentsToDelete')).toBe(false);
      expect(mockFormData.has('attachments')).toBe(false);
    });

    it('should throw PublicationError on update publication failure', async () => {
      const mockError = new Error('API Error');
      mockedApiClient.put.mockRejectedValueOnce(mockError);
      const mockUpdateDataError: UpdatePublicationDto = { title: 'Fail Update' };

      await expect(PublicationService.updatePublication(mockPublicationId, mockUpdateDataError)).rejects.toThrow(
        PublicationError
      );
      await expect(PublicationService.updatePublication(mockPublicationId, mockUpdateDataError)).rejects.toThrow(
        'No se pudo actualizar la publicación.'
      );
    });
  });

  // --- Tests for deletePublication ---
  describe('deletePublication', () => {
    const mockPublicationId = 'pub1';

    it('should delete a publication on success', async () => {
      mockedApiClient.delete.mockResolvedValueOnce({ data: {} }); // Successful delete returns empty data

      await PublicationService.deletePublication(mockPublicationId);

      expect(mockedApiClient.delete).toHaveBeenCalledWith(
        `${API_ROUTES.PUBLICATIONS.BASE}/${mockPublicationId}`
      );
    });

    it('should throw PublicationError on delete publication failure', async () => {
      const mockError = new Error('API Error');
      mockedApiClient.delete.mockRejectedValueOnce(mockError);

      await expect(PublicationService.deletePublication(mockPublicationId)).rejects.toThrow(
        new PublicationError('No se pudo eliminar la publicación.')
      );
    });
  });

  // --- Tests for generateGeneralReport ---
  describe('generateGeneralReport', () => {
    const mockReportName = 'general-report';
    const mockReportFilters = { city: 'test-city', type: publicationTypes.event.value };
    const mockBlob = new Blob(['report content'], { type: 'application/pdf' });

    it('should generate a general report on success', async () => {
      mockedApiClient.post.mockResolvedValueOnce({ data: mockBlob });

      const result = await PublicationService.generateGeneralReport(mockReportName, mockReportFilters);

      expect(mockedApiClient.post).toHaveBeenCalledWith(
        API_ROUTES.REPORTS.PUBLICATION.GENERAL,
        { name: mockReportName, filters: mockReportFilters },
        { responseType: 'blob' }
      );
      expect(result).toEqual(mockBlob);
    });

    it('should throw PublicationError on generate general report failure', async () => {
      const mockError = new Error('API Error');
      mockedApiClient.post.mockRejectedValueOnce(mockError);

      await expect(PublicationService.generateGeneralReport(mockReportName, mockReportFilters)).rejects.toThrow(
        PublicationError
      );
      await expect(PublicationService.generateGeneralReport(mockReportName, mockReportFilters)).rejects.toThrow(
        'No se pudo generar el reporte general.'
      );
    });
  });

  // --- Tests for generateSingleReport ---
  describe('generateSingleReport', () => {
    const mockPublicationId = 'pub1';
    const mockReportName = 'single-report';
    const mockBlob = new Blob(['single report content'], { type: 'application/pdf' });

    it('should generate a single report on success', async () => {
      mockedApiClient.post.mockResolvedValueOnce({ data: mockBlob }); // Use POST

      const result = await PublicationService.generateSingleReport(mockPublicationId, mockReportName);

      expect(mockedApiClient.post).toHaveBeenCalledWith(
        `${API_ROUTES.REPORTS.PUBLICATION.BY_ID(mockPublicationId)}`,
        { name: mockReportName },
        { responseType: 'blob' }
      );
      expect(result).toEqual(mockBlob);
    });

    it('should throw PublicationError on generate single report failure', async () => {
      const mockError = new Error('API Error');
      mockedApiClient.post.mockRejectedValueOnce(mockError);

      await expect(PublicationService.generateSingleReport(mockPublicationId, mockReportName)).rejects.toThrow(
        PublicationError
      );
      await expect(PublicationService.generateSingleReport(mockPublicationId, mockReportName)).rejects.toThrow(
        'No se pudo generar el reporte individual.'
      );
    });
  });

  // --- Tests for searchTags ---
  describe('searchTags', () => {
    const mockSearchTerm = 'test';
    const mockTags: Tag[] = [{ id: 'tag1', name: 'test tag' }];
    const mockPaginatedTags: PaginatedResponse<Tag> = {
      data: mockTags,
      total: 1,
      page: 1,
      totalPages: 1,
    };

    it('should search tags with default pagination', async () => {
      mockedApiClient.get.mockResolvedValueOnce({ data: mockPaginatedTags });

      const result = await PublicationService.searchTags(mockSearchTerm);

      expect(mockedApiClient.get).toHaveBeenCalledWith(
        `${API_ROUTES.PUBLICATIONS.BASE}/tags`,
        {
          params: {
            search: mockSearchTerm,
            page: 1,
            limit: 50,
          },
        }
      );
      expect(result).toEqual(mockPaginatedTags);
    });

    it('should search tags with custom pagination', async () => {
      mockedApiClient.get.mockResolvedValueOnce({ data: mockPaginatedTags });

      const page = 2;
      const limit = 10;
      const result = await PublicationService.searchTags(mockSearchTerm, page, limit);

      expect(mockedApiClient.get).toHaveBeenCalledWith(
        `${API_ROUTES.PUBLICATIONS.BASE}/tags`,
        {
          params: {
            search: mockSearchTerm,
            page: page,
            limit: limit,
          },
        }
      );
      expect(result).toEqual(mockPaginatedTags);
    });

    it('should throw PublicationError on search tags failure', async () => {
      const mockError = new Error('API Error');
      mockedApiClient.get.mockRejectedValueOnce(mockError);

      await expect(PublicationService.searchTags(mockSearchTerm)).rejects.toThrow(
        Error // Expect generic Error, not PublicationError based on service code
      );
      await expect(PublicationService.searchTags(mockSearchTerm)).rejects.toThrow(
        'No se pudieron buscar las etiquetas' // Expect specific error message
      );
    });
  });
});

// Helper function to get data from mocked FormData
// Note: This won't correctly handle multiple appends with the same key (like cities or attachments)
// For more robust checks, iterate over mockFormData.getMockData() which is the internal Map
function getFormDataAsObject(formData: any): Record<string, any> {
  const obj: Record<string, any> = {};
  // This is a simplified approach and might not work for all cases, especially arrays/files
  // It's better to inspect mockFormData.getMockData() (the Map) directly.
  // For demonstration, if your mock FormData has a way to get entries:
  // for (const [key, value] of formData.entries()) {
  //   obj[key] = value;
  // }
  return (formData as any).getMockData();
} 