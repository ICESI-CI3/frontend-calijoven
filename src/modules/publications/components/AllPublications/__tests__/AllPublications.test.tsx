import { screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AllPublications from '../index';
import type { Publication } from '@/types/publication';
import { renderWithClient } from '@/test-utils';

// Mock de los datos de prueba
const mockPublications: Publication[] = [
  {
    id: '1',
    title: 'Test Publication 1',
    description: 'Test Description 1',
    content: 'Test Content 1',
    type: { name: 'event', description: 'Evento' },
    published_at: null,
    cities: [],
    tags: [],
    createdAt: '2024-01-01T00:00:00.000Z',
    attachments: [],
  },
  {
    id: '2',
    title: 'Test Publication 2',
    description: 'Test Description 2',
    content: 'Test Content 2',
    type: { name: 'news', description: 'Noticia' },
    published_at: '2024-01-02T00:00:00.000Z',
    cities: [],
    tags: [],
    createdAt: '2024-01-02T00:00:00.000Z',
    attachments: [],
  },
];

const mockOnEdit = jest.fn();
const mockOnCreateNew = jest.fn();
const mockOnReadMore = jest.fn();

describe('AllPublications', () => {
  it('renders loading state', () => {
    renderWithClient(
      <AllPublications
        publications={[]}
        isLoading={true}
        isError={false}
        error={null}
        onEdit={mockOnEdit}
        onCreateNew={mockOnCreateNew}
        onReadMore={mockOnReadMore}
      />
    );
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders error state', () => {
    const errorMessage = 'Error al cargar las publicaciones';
    renderWithClient(
      <AllPublications
        publications={[]}
        isLoading={false}
        isError={true}
        error={new Error(errorMessage)}
        onEdit={mockOnEdit}
        onCreateNew={mockOnCreateNew}
        onReadMore={mockOnReadMore}
      />
    );
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('renders empty state', () => {
    renderWithClient(
      <AllPublications
        publications={[]}
        isLoading={false}
        isError={false}
        error={null}
        onEdit={mockOnEdit}
        onCreateNew={mockOnCreateNew}
        onReadMore={mockOnReadMore}
      />
    );
    expect(screen.getByText('No hay publicaciones disponibles')).toBeInTheDocument();
  });

  it('renders list of publications', () => {
    renderWithClient(
      <AllPublications
        publications={mockPublications}
        isLoading={false}
        isError={false}
        error={null}
        onEdit={mockOnEdit}
        onCreateNew={mockOnCreateNew}
        onReadMore={mockOnReadMore}
      />
    );
    
    expect(screen.getByText('Test Publication 1')).toBeInTheDocument();
    expect(screen.getByText('Test Description 1')).toBeInTheDocument();
    expect(screen.getByText('Test Publication 2')).toBeInTheDocument();
    expect(screen.getByText('Test Description 2')).toBeInTheDocument();
  });
}); 