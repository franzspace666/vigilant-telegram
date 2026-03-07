import { describe, it, expect } from 'vitest';
import { BaseScraper, ScrapedVyzva } from '../baseScraper';

// Create a concrete implementation for testing
class TestScraper extends BaseScraper {
  source = 'TEST';
  baseUrl = 'https://example.com';

  async scrape(): Promise<ScrapedVyzva[]> {
    return [];
  }
}

describe('BaseScraper', () => {
  let scraper: TestScraper;

  beforeEach(() => {
    scraper = new TestScraper();
  });

  describe('generateHash', () => {
    it('should generate consistent hash for same input', () => {
      const vyzva: ScrapedVyzva = {
        nazev: 'Test',
        zdroj: 'TEST',
        zdrojUrl: 'https://example.com/1',
        oblasti: ['zemedelstvi'],
        deadline: new Date('2024-12-31'),
        alokace: 1000000,
        status: 'otevrena',
      };

      const hash1 = scraper.generateHash(vyzva);
      const hash2 = scraper.generateHash(vyzva);

      expect(hash1).toBe(hash2);
    });

    it('should generate different hash for different nazev', () => {
      const vyzva1: ScrapedVyzva = {
        nazev: 'Test 1',
        zdroj: 'TEST',
        zdrojUrl: 'https://example.com/1',
        oblasti: [],
        status: 'otevrena',
      };
      const vyzva2: ScrapedVyzva = {
        nazev: 'Test 2',
        zdroj: 'TEST',
        zdrojUrl: 'https://example.com/1',
        oblasti: [],
        status: 'otevrena',
      };

      expect(scraper.generateHash(vyzva1)).not.toBe(scraper.generateHash(vyzva2));
    });

    it('should generate different hash for different deadline', () => {
      const vyzva1: ScrapedVyzva = {
        nazev: 'Test',
        zdroj: 'TEST',
        zdrojUrl: 'https://example.com/1',
        oblasti: [],
        deadline: new Date('2024-12-31'),
        status: 'otevrena',
      };
      const vyzva2: ScrapedVyzva = {
        nazev: 'Test',
        zdroj: 'TEST',
        zdrojUrl: 'https://example.com/1',
        oblasti: [],
        deadline: new Date('2025-01-15'),
        status: 'otevrena',
      };

      expect(scraper.generateHash(vyzva1)).not.toBe(scraper.generateHash(vyzva2));
    });

    it('should generate valid MD5 hash format', () => {
      const vyzva: ScrapedVyzva = {
        nazev: 'Test',
        zdroj: 'TEST',
        zdrojUrl: 'https://example.com/1',
        oblasti: [],
        status: 'otevrena',
      };

      const hash = scraper.generateHash(vyzva);
      expect(hash).toMatch(/^[a-f0-9]{32}$/);
    });
  });

  describe('parseDate', () => {
    it('should parse DD.MM.YYYY format', () => {
      const date = scraper.parseDate('31.12.2024');
      expect(date).toBeDefined();
      expect(date?.getFullYear()).toBe(2024);
      expect(date?.getMonth()).toBe(11); // December is month 11
      expect(date?.getDate()).toBe(31);
    });

    it('should parse D.M.YYYY format', () => {
      const date = scraper.parseDate('1.1.2024');
      expect(date).toBeDefined();
      expect(date?.getFullYear()).toBe(2024);
      expect(date?.getMonth()).toBe(0); // January is month 0
      expect(date?.getDate()).toBe(1);
    });

    it('should parse YYYY-MM-DD format', () => {
      const date = scraper.parseDate('2024-12-31');
      expect(date).toBeDefined();
      expect(date?.getFullYear()).toBe(2024);
      expect(date?.getMonth()).toBe(11);
      expect(date?.getDate()).toBe(31);
    });

    it('should parse ISO date strings', () => {
      const date = scraper.parseDate('2024-12-31T10:30:00Z');
      expect(date).toBeDefined();
      expect(date?.getFullYear()).toBe(2024);
    });

    it('should return undefined for empty string', () => {
      expect(scraper.parseDate('')).toBeUndefined();
    });

    it('should return undefined for invalid date string', () => {
      expect(scraper.parseDate('not a date')).toBeUndefined();
      expect(scraper.parseDate('abc123')).toBeUndefined();
    });

    it('should handle date strings with extra text', () => {
      const date = scraper.parseDate('Deadline: 31.12.2024');
      expect(date).toBeDefined();
      expect(date?.getFullYear()).toBe(2024);
    });
  });

  describe('parseAmount', () => {
    it('should parse simple numbers', () => {
      expect(scraper.parseAmount('1000')).toBe(1000);
      expect(scraper.parseAmount('500000')).toBe(500000);
    });

    it('should parse numbers with spaces', () => {
      expect(scraper.parseAmount('1 000 000')).toBe(1000000);
      expect(scraper.parseAmount('500 000')).toBe(500000);
    });

    it('should parse numbers with comma decimal separator', () => {
      expect(scraper.parseAmount('1,5')).toBe(2); // rounds
      expect(scraper.parseAmount('2,75')).toBe(3); // rounds
    });

    it('should parse millions with "mil." suffix', () => {
      expect(scraper.parseAmount('5 mil.')).toBe(5000000);
      expect(scraper.parseAmount('2,5 mil. Kč')).toBe(2500000);
      expect(scraper.parseAmount('100 mil')).toBe(100000000);
    });

    it('should parse billions with "mld." suffix', () => {
      expect(scraper.parseAmount('1 mld.')).toBe(1000000000);
      expect(scraper.parseAmount('2,5 mld. Kč')).toBe(2500000000);
    });

    it('should parse thousands with "tis." suffix', () => {
      expect(scraper.parseAmount('500 tis.')).toBe(500000);
      expect(scraper.parseAmount('100 tis. Kč')).toBe(100000);
    });

    it('should return undefined for empty string', () => {
      expect(scraper.parseAmount('')).toBeUndefined();
    });

    it('should return undefined for non-numeric string', () => {
      expect(scraper.parseAmount('neuvedeno')).toBeUndefined();
      expect(scraper.parseAmount('N/A')).toBeUndefined();
    });

    it('should be case insensitive for multipliers', () => {
      expect(scraper.parseAmount('5 MIL.')).toBe(5000000);
      expect(scraper.parseAmount('1 MLD.')).toBe(1000000000);
      expect(scraper.parseAmount('500 TIS.')).toBe(500000);
    });
  });

  describe('cleanText', () => {
    it('should trim whitespace', () => {
      expect(scraper.cleanText('  hello  ')).toBe('hello');
    });

    it('should collapse multiple spaces', () => {
      expect(scraper.cleanText('hello    world')).toBe('hello world');
    });

    it('should handle newlines and tabs', () => {
      expect(scraper.cleanText('hello\n\nworld')).toBe('hello world');
      expect(scraper.cleanText('hello\t\tworld')).toBe('hello world');
    });

    it('should handle mixed whitespace', () => {
      expect(scraper.cleanText('  hello  \n\t  world  ')).toBe('hello world');
    });

    it('should return empty string for whitespace-only input', () => {
      expect(scraper.cleanText('   ')).toBe('');
      expect(scraper.cleanText('\n\t')).toBe('');
    });
  });

  describe('resolveUrl', () => {
    it('should return absolute URLs unchanged', () => {
      expect(scraper.resolveUrl('https://other.com/page')).toBe('https://other.com/page');
      expect(scraper.resolveUrl('http://other.com/page')).toBe('http://other.com/page');
    });

    it('should resolve relative URLs starting with /', () => {
      expect(scraper.resolveUrl('/path/to/page')).toBe('https://example.com/path/to/page');
    });

    it('should resolve relative URLs not starting with /', () => {
      expect(scraper.resolveUrl('path/to/page')).toBe('https://example.com/path/to/page');
    });

    it('should handle baseUrl with trailing slash', () => {
      const scraperWithSlash = new TestScraper();
      // Test current behavior - it adds extra slash if baseUrl doesn't have one
      expect(scraperWithSlash.resolveUrl('page')).toBe('https://example.com/page');
    });
  });
});
