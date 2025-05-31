import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PublicationsTabs from '../PublicationsTabs';

// Mock de los componentes de UI
jest.mock('@/components/Tabs', () => ({
  Tabs: ({ children, value, onChange }: any) => (
    <div data-testid="tabs">
      <div role="tablist">
        <button
          role="tab"
          aria-selected={value === 'all'}
          onClick={() => onChange('all')}
          data-value="all"
        >
          Todas
        </button>
        <button
          role="tab"
          aria-selected={value === 'events'}
          onClick={() => onChange('events')}
          data-value="events"
        >
          Eventos
        </button>
        <button
          role="tab"
          aria-selected={value === 'news'}
          onClick={() => onChange('news')}
          data-value="news"
        >
          Noticias
        </button>
        <button
          role="tab"
          aria-selected={value === 'offers'}
          onClick={() => onChange('offers')}
          data-value="offers"
        >
          Ofertas
        </button>
      </div>
      <div role="tabpanel">{children}</div>
    </div>
  ),
  TabPanel: ({ children }: any) => <div role="tabpanel">{children}</div>,
}));

// Mock del componente Button
jest.mock('@/components/Button', () => ({
  Button: ({ children, onClick, variant, size }: any) => (
    <button onClick={onClick} data-variant={variant} data-size={size}>
      {children}
    </button>
  ),
}));

describe('PublicationsTabs', () => {
  const mockOnTabChange = jest.fn();
  const defaultProps = {
    tabs: [
      { value: 'all', label: 'Todas' },
      { value: 'events', label: 'Eventos' },
      { value: 'news', label: 'Noticias' },
      { value: 'offers', label: 'Ofertas' },
    ],
    activeTab: 'all',
    onTabChange: mockOnTabChange,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all tabs correctly', () => {
    render(<PublicationsTabs {...defaultProps} />);

    expect(screen.getByRole('button', { name: 'Todas' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Eventos' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Noticias' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Ofertas' })).toBeInTheDocument();
  });

  it('shows active tab correctly', () => {
    render(<PublicationsTabs {...defaultProps} activeTab="events" />);

    const eventsTab = screen.getByRole('button', { name: 'Eventos' });
    expect(eventsTab).toHaveAttribute('data-variant', 'primary');

    const otherTabs = [
      screen.getByRole('button', { name: 'Todas' }),
      screen.getByRole('button', { name: 'Noticias' }),
      screen.getByRole('button', { name: 'Ofertas' }),
    ];

    otherTabs.forEach(tab => {
      expect(tab).toHaveAttribute('data-variant', 'outline');
    });
  });

  it('handles tab change', () => {
    render(<PublicationsTabs {...defaultProps} />);

    const newsTab = screen.getByRole('button', { name: 'Noticias' });
    fireEvent.click(newsTab);

    expect(mockOnTabChange).toHaveBeenCalledWith('news');
  });
}); 