import { whatWeDoCards } from '../what-we-do-cards';

describe('whatWeDoCards', () => {
  it('should be an array', () => {
    expect(Array.isArray(whatWeDoCards)).toBe(true);
  });

  it('should have at least one card', () => {
    expect(whatWeDoCards.length).toBeGreaterThan(0);
  });

  it('should have the correct structure for each card', () => {
    whatWeDoCards.forEach(card => {
      expect(card).toHaveProperty('title');
      expect(typeof card.title).toBe('string');

      expect(card).toHaveProperty('description');
      expect(typeof card.description).toBe('string');

      expect(card).toHaveProperty('icon');
      expect(typeof card.icon).toBe('string'); // Could add more specific checks for icon values if needed

      expect(card).toHaveProperty('color');
      expect(typeof card.color).toBe('string'); // Could add more specific checks for color values if needed

      // Optional className property
      if (card.className) {
        expect(typeof card.className).toBe('string');
      }
    });
  });

  it('should contain specific expected titles', () => {
    const titles = whatWeDoCards.map(card => card.title);
    expect(titles).toContain('Representación y Participación');
    expect(titles).toContain('Articulación de Iniciativas');
    expect(titles).toContain('Control Social y Veeduría');
    expect(titles).toContain('Espacio de Encuentro');
  });
}); 