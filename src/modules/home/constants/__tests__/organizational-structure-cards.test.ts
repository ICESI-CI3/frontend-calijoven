import { organizationalStructureCards } from '../organizational-structure-cards';

describe('organizationalStructureCards', () => {
  it('should be an array', () => {
    expect(Array.isArray(organizationalStructureCards)).toBe(true);
  });

  it('should have at least one card', () => {
    expect(organizationalStructureCards.length).toBeGreaterThan(0);
  });

  it('should have the correct structure for each card', () => {
    organizationalStructureCards.forEach(card => {
      expect(card).toHaveProperty('title');
      expect(typeof card.title).toBe('string');

      expect(card).toHaveProperty('description');
      expect(typeof card.description).toBe('string');

      expect(card).toHaveProperty('icon');
      expect(typeof card.icon).toBe('string'); // Could add more specific checks for icon values if needed

      expect(card).toHaveProperty('color');
      expect(typeof card.color).toBe('string'); // Could add more specific checks for color values if needed

      if (card.items) {
        expect(Array.isArray(card.items)).toBe(true);
        card.items.forEach(item => {
          expect(typeof item).toBe('string');
        });
      }
    });
  });

  it('should contain specific expected titles', () => {
    const titles = organizationalStructureCards.map(card => card.title);
    expect(titles).toContain('Consejo Distrital de Juventud');
    expect(titles).toContain('Plataforma Distrital de Juventudes');
  });
}); 