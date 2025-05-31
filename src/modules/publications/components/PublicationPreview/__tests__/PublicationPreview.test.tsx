import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PublicationPreview from '../index';
import { mockPublications } from '@/modules/publications/mocks';
import { useRouter } from 'next/navigation';
import type { Publication, PublicationType } from '@/types/publication';
import type { Organization } from '@/types/organization';
import { PropsWithChildren } from 'react';

// Mock de next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock del componente Button
jest.mock('@/components/Button', () => ({
  Button: ({ children, onClick, variant, size }: PropsWithChildren<{ onClick?: () => void; variant?: string; size?: string }>) => (
    <button onClick={onClick} data-variant={variant} data-size={size}>
      {children}
    </button>
  ),
}));

describe('PublicationPreview', () => {
  const defaultProps = {
    publication: mockPublications[0] as Publication,
  };

  it('renders publication preview correctly', () => {
    const publication = {
      ...mockPublications[0],
      organizers: mockPublications[0].organizers || [],
    } as Publication;
    render(<PublicationPreview publication={publication} />);

    // Verificar que se muestran los elementos principales
    expect(screen.getByText(publication.title)).toBeInTheDocument();
    expect(screen.getByText(publication.description)).toBeInTheDocument();
    expect(screen.getByText('Evento')).toBeInTheDocument();
    expect(screen.getByText(/Organiza:/)).toBeInTheDocument();
    const organizerElement = screen.getByText((content, element) => {
      return element?.textContent === 'Organiza: Test Organization' || false;
    });
    expect(organizerElement).toBeInTheDocument();
    expect(screen.getByText('Test City')).toBeInTheDocument();
  });

  it('displays correct type badge', () => {
    const { rerender } = render(<PublicationPreview {...defaultProps} />);

    // Verificar badge de evento
    expect(screen.getByText('Evento')).toHaveClass('bg-green-500');

    // Verificar badge de noticia
    const newsType: PublicationType = {
      name: 'news',
      description: 'Noticia',
    };
    rerender(
      <PublicationPreview
        {...defaultProps}
        publication={{
          ...mockPublications[0],
          type: newsType,
        }}
      />
    );
    expect(screen.getByText('Noticia')).toHaveClass('bg-blue-500');

    // Verificar badge de oferta
    const offerType: PublicationType = {
      name: 'offer',
      description: 'Oferta',
    };
    rerender(
      <PublicationPreview
        {...defaultProps}
        publication={{
          ...mockPublications[0],
          type: offerType,
        }}
      />
    );
    expect(screen.getByText('Oferta')).toHaveClass('bg-yellow-500');
  });

  it('displays formatted date', () => {
    render(<PublicationPreview {...defaultProps} />);

    const formattedDate = new Date(mockPublications[0].createdAt).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });

    expect(screen.getByText(formattedDate)).toBeInTheDocument();
  });

  it('displays default image when no attachments', () => {
    const publicationWithoutAttachments = {
      ...mockPublications[0],
      attachments: [],
    };

    render(<PublicationPreview publication={publicationWithoutAttachments} />);

    const image = screen.getByAltText(mockPublications[0].title);
    expect(image).toHaveAttribute(
      'src',
      'https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg'
    );
  });

  it('displays first attachment as image when available', () => {
    render(<PublicationPreview {...defaultProps} />);

    const image = screen.getByAltText(mockPublications[0].title);
    expect(image).toHaveAttribute('src', mockPublications[0].attachments?.[0]?.url);
  });

  it('handles read more click with custom handler', () => {
    const mockOnReadMore = jest.fn();
    render(<PublicationPreview {...defaultProps} onReadMore={mockOnReadMore} />);

    const readMoreButton = screen.getByRole('button', { name: /leer más/i });
    fireEvent.click(readMoreButton);

    expect(mockOnReadMore).toHaveBeenCalledWith(mockPublications[0].id);
  });

  it('handles read more click without custom handler', () => {
    const mockPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });

    render(<PublicationPreview {...defaultProps} />);

    const readMoreButton = screen.getByRole('button', { name: /leer más/i });
    fireEvent.click(readMoreButton);

    expect(mockPush).toHaveBeenCalled();
  });

  it('displays organizers and cities correctly', () => {
    const mockOrganizers: Organization[] = [
      {
        id: '1',
        name: 'Organization 1',
        acronym: 'ORG1',
        public: true,
        members: [],
        committees: [],
        documents: [],
      },
      {
        id: '2',
        name: 'Organization 2',
        acronym: 'ORG2',
        public: true,
        members: [],
        committees: [],
        documents: [],
      },
    ];

    const publicationWithMultipleOrganizersAndCities = {
      ...mockPublications[0],
      organizers: mockOrganizers,
      cities: [
        { id: '1', name: 'City 1', departmentId: 1 },
        { id: '2', name: 'City 2', departmentId: 2 },
      ],
    };

    render(<PublicationPreview publication={publicationWithMultipleOrganizersAndCities} />);

    expect(screen.getByText('Organiza: Organization 1, Organization 2')).toBeInTheDocument();
    expect(screen.getByText('City 1, City 2')).toBeInTheDocument();
  });

  it('handles missing organizers and cities', () => {
    const publicationWithoutOrganizersAndCities = {
      ...mockPublications[0],
      organizers: [],
      cities: [],
    };

    render(<PublicationPreview publication={publicationWithoutOrganizersAndCities} />);

    expect(screen.queryByText(/Organiza:/)).not.toBeInTheDocument();
    expect(screen.queryByText(/City/)).not.toBeInTheDocument();
  });
}); 