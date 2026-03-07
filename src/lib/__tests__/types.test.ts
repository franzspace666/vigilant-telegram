import { describe, it, expect } from 'vitest';
import { mapDbStatus, formatCastka, serializeVyzva, statusMap, statusLabels } from '../types';

describe('statusMap', () => {
  it('should map otevrena to open', () => {
    expect(statusMap['otevrena']).toBe('open');
  });

  it('should map ukoncena to closed', () => {
    expect(statusMap['ukoncena']).toBe('closed');
  });

  it('should map planovana to planned', () => {
    expect(statusMap['planovana']).toBe('planned');
  });

  it('should map pozastavena to closed', () => {
    expect(statusMap['pozastavena']).toBe('closed');
  });
});

describe('statusLabels', () => {
  it('should have Czech label for open', () => {
    expect(statusLabels['open']).toBe('Otevřená');
  });

  it('should have Czech label for closing', () => {
    expect(statusLabels['closing']).toBe('Končí brzy');
  });

  it('should have Czech label for planned', () => {
    expect(statusLabels['planned']).toBe('Plánovaná');
  });

  it('should have Czech label for closed', () => {
    expect(statusLabels['closed']).toBe('Uzavřená');
  });
});

describe('mapDbStatus', () => {
  it('should map known db statuses', () => {
    expect(mapDbStatus('otevrena')).toBe('open');
    expect(mapDbStatus('ukoncena')).toBe('closed');
    expect(mapDbStatus('planovana')).toBe('planned');
    expect(mapDbStatus('pozastavena')).toBe('closed');
  });

  it('should default to open for unknown statuses', () => {
    expect(mapDbStatus('unknown')).toBe('open');
    expect(mapDbStatus('')).toBe('open');
    expect(mapDbStatus('random')).toBe('open');
  });
});

describe('formatCastka', () => {
  it('should return dash for null value', () => {
    expect(formatCastka(null)).toBe('—');
  });

  it('should format billions (mld.)', () => {
    expect(formatCastka('1000000000')).toBe('1 mld. Kč');
    expect(formatCastka('2500000000')).toBe('2.5 mld. Kč');
    expect(formatCastka('10000000000')).toBe('10 mld. Kč');
  });

  it('should format millions (mil.)', () => {
    expect(formatCastka('1000000')).toBe('1 mil. Kč');
    expect(formatCastka('2500000')).toBe('2.5 mil. Kč');
    expect(formatCastka('100000000')).toBe('100 mil. Kč');
  });

  it('should format thousands (tis.)', () => {
    expect(formatCastka('1000')).toBe('1 tis. Kč');
    expect(formatCastka('50000')).toBe('50 tis. Kč');
    expect(formatCastka('999000')).toBe('999 tis. Kč');
  });

  it('should format small amounts directly', () => {
    expect(formatCastka('500')).toBe('500 Kč');
    expect(formatCastka('999')).toBe('999 Kč');
    expect(formatCastka('1')).toBe('1 Kč');
  });

  it('should remove trailing .0 from formatted numbers', () => {
    expect(formatCastka('1000000000')).toBe('1 mld. Kč');
    expect(formatCastka('2000000')).toBe('2 mil. Kč');
  });

  it('should return original value for non-numeric strings', () => {
    expect(formatCastka('abc')).toBe('abc');
    expect(formatCastka('unknown')).toBe('unknown');
  });
});

describe('serializeVyzva', () => {
  it('should serialize a vyzva with Date objects', () => {
    const input = {
      id: '1',
      nazev: 'Test',
      zdroj: 'MZE',
      zdrojUrl: 'https://example.com',
      oblasti: ['zemedelstvi'],
      alokace: 1000000n, // BigInt
      minCastka: 10000n,
      maxCastka: 500000n,
      miraSpolufinancovani: 50,
      deadline: new Date('2024-12-31'),
      datumVyhlaseni: new Date('2024-01-01'),
      datumUkonceni: new Date('2024-12-31'),
      popis: 'Test popis',
      plnyText: null,
      status: 'otevrena',
      typZaznamu: 'vyzva',
      hash: 'abc123',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-06-01'),
    };

    const result = serializeVyzva(input);

    expect(result.id).toBe('1');
    expect(result.nazev).toBe('Test');
    expect(result.alokace).toBe('1000000');
    expect(result.minCastka).toBe('10000');
    expect(result.maxCastka).toBe('500000');
    expect(result.deadline).toBe('2024-12-31T00:00:00.000Z');
    expect(result.datumVyhlaseni).toBe('2024-01-01T00:00:00.000Z');
    expect(result.datumUkonceni).toBe('2024-12-31T00:00:00.000Z');
    expect(result.createdAt).toBe('2024-01-01T00:00:00.000Z');
    expect(result.updatedAt).toBe('2024-06-01T00:00:00.000Z');
  });

  it('should handle null date values', () => {
    const input = {
      id: '1',
      nazev: 'Test',
      zdroj: 'MZE',
      zdrojUrl: 'https://example.com',
      oblasti: [],
      alokace: null,
      minCastka: null,
      maxCastka: null,
      miraSpolufinancovani: null,
      deadline: null,
      datumVyhlaseni: null,
      datumUkonceni: null,
      popis: null,
      plnyText: null,
      status: 'otevrena',
      typZaznamu: 'vyzva',
      hash: 'abc123',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-06-01'),
    };

    const result = serializeVyzva(input);

    expect(result.alokace).toBeNull();
    expect(result.minCastka).toBeNull();
    expect(result.maxCastka).toBeNull();
    expect(result.deadline).toBeNull();
    expect(result.datumVyhlaseni).toBeNull();
    expect(result.datumUkonceni).toBeNull();
  });

  it('should handle string date values (already serialized)', () => {
    const input = {
      id: '1',
      nazev: 'Test',
      zdroj: 'MZE',
      zdrojUrl: 'https://example.com',
      oblasti: [],
      alokace: '1000000',
      minCastka: '10000',
      maxCastka: '500000',
      miraSpolufinancovani: 50,
      deadline: '2024-12-31T00:00:00.000Z',
      datumVyhlaseni: '2024-01-01T00:00:00.000Z',
      datumUkonceni: '2024-12-31T00:00:00.000Z',
      popis: 'Test',
      plnyText: null,
      status: 'otevrena',
      typZaznamu: 'vyzva',
      hash: 'abc123',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-06-01T00:00:00.000Z',
    };

    const result = serializeVyzva(input);

    expect(result.deadline).toBe('2024-12-31T00:00:00.000Z');
    expect(result.datumVyhlaseni).toBe('2024-01-01T00:00:00.000Z');
    expect(result.createdAt).toBe('2024-01-01T00:00:00.000Z');
  });
});
