import { render, screen } from '@testing-library/react';
import { OrganizationalStructureSection } from '../index';
import { organizationalStructureCards } from '@/modules/home/constants/organizational-structure-cards';

// Mock the organizational-structure-cards constant
jest.mock('@/modules/home/constants/organizational-structure-cards', () => ({
  organizationalStructureCards: [
    {
      title: 'Test Structure 1',
      description: 'Description 1',
      icon: 'BuildingOffice2Icon',
      color: 'blue-400',
      className: 'test-class-1',
      items: ['Item 1', 'Item 2'],
    },
    {
      title: 'Test Structure 2',
      description: 'Description 2',
      icon: 'UserGroupIcon',
      color: 'primary',
      className: 'test-class-2',
      items: ['Item 3', 'Item 4'],
    },
  ],
}));

describe('OrganizationalStructureSection', () => {
  it('renders the section title and description', () => {
    render(<OrganizationalStructureSection />);
    
    expect(screen.getByText('Estructura Organizativa')).toBeInTheDocument();
    expect(screen.getByText(/Conoce cómo está organizada la participación juvenil en Cali/)).toBeInTheDocument();
  });

  it('renders all organizational structure cards', () => {
    render(<OrganizationalStructureSection />);
    
    organizationalStructureCards.forEach((card) => {
      expect(screen.getByText(card.title)).toBeInTheDocument();
      expect(screen.getByText(card.description)).toBeInTheDocument();
    });
  });

  it('renders cards with correct icons', () => {
    render(<OrganizationalStructureSection />);
    
    // Check for SVG icons by their class
    const icons = document.querySelectorAll('svg[data-slot="icon"]');
    expect(icons).toHaveLength(organizationalStructureCards.length);
  });

  it('renders cards with correct classes', () => {
    render(<OrganizationalStructureSection />);
    
    organizationalStructureCards.forEach((card) => {
      const cardElement = screen.getByText(card.title).closest('div[class*="relative flex flex-col"]');
      if (cardElement && card.className) {
        expect(cardElement).toHaveClass(card.className);
      }
    });
  });

  it('renders card items with checkmarks', () => {
    render(<OrganizationalStructureSection />);
    
    organizationalStructureCards.forEach((card) => {
      card.items?.forEach((item) => {
        const itemElement = screen.getByText(item);
        expect(itemElement).toBeInTheDocument();
        
        // Check for checkmark icon (SVG)
        const checkmark = itemElement.closest('li')?.querySelector('svg');
        expect(checkmark).toBeInTheDocument();
      });
    });
  });

  it('renders items with correct styling', () => {
    render(<OrganizationalStructureSection />);
    
    const listItems = screen.getAllByRole('listitem');
    listItems.forEach((item) => {
      expect(item).toHaveClass('flex');
      expect(item).toHaveClass('items-center');
      expect(item).toHaveClass('gap-2');
      expect(item).toHaveClass('text-base');
    });
  });

  it('renders items with correct text colors', () => {
    render(<OrganizationalStructureSection />);
    
    const itemTexts = screen.getAllByText(/Item \d/);
    itemTexts.forEach((text) => {
      expect(text).toHaveClass('text-foreground');
    });
  });
}); 