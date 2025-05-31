import { render, screen } from '@testing-library/react';
import { WhatWeDoSection } from '../index';
import { whatWeDoCards } from '@/modules/home/constants/what-we-do-cards';

// Mock the what-we-do-cards constant
jest.mock('@/modules/home/constants/what-we-do-cards', () => ({
  whatWeDoCards: [
    {
      title: 'Test Card 1',
      description: 'Description 1',
      icon: 'UserGroupIcon',
      color: 'primary',
      className: 'test-class-1',
    },
    {
      title: 'Test Card 2',
      description: 'Description 2',
      icon: 'LightBulbIcon',
      color: 'success',
      className: 'test-class-2',
    },
  ],
}));

describe('WhatWeDoSection', () => {
  it('renders the section title and description', () => {
    render(<WhatWeDoSection />);
    
    expect(screen.getByText('¿Qué hacemos?')).toBeInTheDocument();
    expect(screen.getByText(/Somos el mecanismo de participación juvenil/)).toBeInTheDocument();
  });

  it('renders all what-we-do cards', () => {
    render(<WhatWeDoSection />);
    
    whatWeDoCards.forEach((card) => {
      expect(screen.getByText(card.title)).toBeInTheDocument();
      expect(screen.getByText(card.description)).toBeInTheDocument();
    });
  });

  it('renders cards with correct icons', () => {
    render(<WhatWeDoSection />);
    
    // Check for SVG icons by their class
    const icons = document.querySelectorAll('svg[data-slot="icon"]');
    expect(icons).toHaveLength(whatWeDoCards.length);
  });

  it('renders cards with correct classes', () => {
    render(<WhatWeDoSection />);
    
    whatWeDoCards.forEach((card) => {
      const cardElement = screen.getByText(card.title).closest('div[class*="relative flex flex-col"]');
      expect(cardElement).toHaveClass(card.className);
    });
  });

  it('renders cards in a grid layout', () => {
    render(<WhatWeDoSection />);
    
    const gridContainer = screen.getByRole('section').querySelector('div.mx-auto');
    expect(gridContainer).toBeInTheDocument();
    expect(gridContainer).toHaveClass('grid');
    expect(gridContainer).toHaveClass('grid-cols-1');
    expect(gridContainer).toHaveClass('md:grid-cols-2');
  });

  it('renders cards with correct colors', () => {
    render(<WhatWeDoSection />);
    
    whatWeDoCards.forEach((card) => {
      const icon = screen.getByText(card.title)
        .closest('div[class*="relative flex flex-col"]')
        ?.querySelector(`svg[class*="text-${card.color}"]`);
      expect(icon).toBeInTheDocument();
    });
  });
}); 