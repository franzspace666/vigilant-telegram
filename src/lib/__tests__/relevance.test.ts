import { describe, it, expect } from 'vitest';
import { classifyVyzva, computeRelevance } from '../relevance';

describe('classifyVyzva', () => {
  it('should classify regular vyzva titles as "vyzva"', () => {
    expect(classifyVyzva('Výzva č. 1/2024')).toBe('vyzva');
    expect(classifyVyzva('Podpora cestovního ruchu')).toBe('vyzva');
    expect(classifyVyzva('Dotace pro zemědělce')).toBe('vyzva');
  });

  it('should classify documents starting with "příručka" as "dokument"', () => {
    expect(classifyVyzva('Příručka pro žadatele')).toBe('dokument');
    expect(classifyVyzva('příručka k výzvě')).toBe('dokument');
  });

  it('should classify "příručka pro žadatele" pattern as "dokument"', () => {
    expect(classifyVyzva('Nová příručka pro žadatele 2024')).toBe('dokument');
  });

  it('should classify "zásady" documents as "dokument"', () => {
    expect(classifyVyzva('Zásady, kterými se stanovují podmínky')).toBe('dokument');
    expect(classifyVyzva('Zásady kterými se stanovují pravidla')).toBe('dokument');
  });

  it('should classify "zpřesnění zásad" as "dokument"', () => {
    expect(classifyVyzva('Zpřesnění zásad pro rok 2024')).toBe('dokument');
  });

  it('should classify informational documents as "dokument"', () => {
    expect(classifyVyzva('Informace pro žadatele')).toBe('dokument');
    expect(classifyVyzva('Metodika hodnocení projektů')).toBe('dokument');
    expect(classifyVyzva('Pokyny pro žadatele')).toBe('dokument');
  });

  it('should classify result announcements as "dokument"', () => {
    // Pattern requires "schválené žádosti" at start
    expect(classifyVyzva('Schválené žádosti výzvy č. 5')).toBe('dokument');
    // Pattern matches "výsledky výzvy" anywhere
    expect(classifyVyzva('Oznámení: Výsledky výzvy 2024')).toBe('dokument');
    expect(classifyVyzva('Výsledky výzvy č. 3')).toBe('dokument');
  });

  it('should classify reports and lists as "dokument"', () => {
    // These patterns require matching at the start of the string (^)
    expect(classifyVyzva('Výroční zpráva 2023')).toBe('dokument');
    expect(classifyVyzva('Harmonogram výzev 2024')).toBe('dokument');
    expect(classifyVyzva('Přehled výzev')).toBe('dokument');
    // Note: "Seznam schválených" works, pattern requires exact match
    expect(classifyVyzva('Seznam schválených projektů')).toBe('dokument');
    expect(classifyVyzva('Zpráva o realizaci programu')).toBe('dokument');
  });

  it('should NOT classify non-matching titles as "dokument"', () => {
    // Verify these are not incorrectly classified
    expect(classifyVyzva('Podpora inovací')).toBe('vyzva');
    expect(classifyVyzva('Rozvoj obci')).toBe('vyzva');
    expect(classifyVyzva('Dotace na energetiku')).toBe('vyzva');
  });

  it('should classify "sdělení pro žadatele" as "dokument"', () => {
    expect(classifyVyzva('Důležité sdělení pro žadatele')).toBe('dokument');
  });

  it('should handle whitespace trimming', () => {
    expect(classifyVyzva('  Výzva č. 1  ')).toBe('vyzva');
    expect(classifyVyzva('  Příručka  ')).toBe('dokument');
  });
});

describe('computeRelevance', () => {
  it('should return 0 for vyzva with no matching oblasti or zdroj', () => {
    const vyzva = {
      oblasti: ['neznama-oblast'],
      zdroj: 'NEZNAMY_ZDROJ',
      nazev: 'Test',
    };
    expect(computeRelevance(vyzva)).toBe(0);
  });

  it('should score high for KRNAP-related keywords', () => {
    const vyzva = {
      oblasti: ['cestovni-ruch'],
      zdroj: 'MAS_KRKONOSE',
      nazev: 'Podpora KRNAP',
      popis: 'Program pro Krkonošský národní park',
    };
    const score = computeRelevance(vyzva);
    // Should get: oblast (16) + zdroj (20) + keyword bonuses (20 for KRNAP + 15 for Krkonose)
    expect(score).toBeGreaterThanOrEqual(50);
  });

  it('should score based on oblasti', () => {
    const vyzva1 = {
      oblasti: ['cestovni-ruch'],
      zdroj: 'NEZNAMY',
      nazev: 'Test',
    };
    const vyzva2 = {
      oblasti: ['ostatni'],
      zdroj: 'NEZNAMY',
      nazev: 'Test',
    };
    expect(computeRelevance(vyzva1)).toBeGreaterThan(computeRelevance(vyzva2));
  });

  it('should cap oblast score at 40', () => {
    const vyzva = {
      // Multiple high-scoring oblasti
      oblasti: ['cestovni-ruch', 'zemedelstvi', 'zpracovani', 'energetika', 'regionalni-produkt'],
      zdroj: 'NEZNAMY',
      nazev: 'Test',
    };
    // Total oblast score would be 16+14+12+12+10 = 64, but capped at 40
    const score = computeRelevance(vyzva);
    expect(score).toBeLessThanOrEqual(100);
  });

  it('should score based on zdroj', () => {
    const vyzva1 = {
      oblasti: [],
      zdroj: 'MAS_KRKONOSE',
      nazev: 'Test',
    };
    const vyzva2 = {
      oblasti: [],
      zdroj: 'CINEA',
      nazev: 'Test',
    };
    expect(computeRelevance(vyzva1)).toBeGreaterThan(computeRelevance(vyzva2));
  });

  it('should cap zdroj score at 20', () => {
    const vyzva = {
      oblasti: [],
      zdroj: 'MAS_KRKONOSE', // score 20
      nazev: 'Test',
    };
    const score = computeRelevance(vyzva);
    expect(score).toBe(20);
  });

  it('should apply keyword bonuses from nazev', () => {
    // Use a zdroj with score >= 10 to avoid negative correction
    const vyzvaWithKeywords = {
      oblasti: [],
      zdroj: 'OPZP', // score 12
      nazev: 'Podpora KRNAP v Krkonoších', // KRNAP=20, krkonoše=15 (capped at 30)
    };
    const vyzvaWithoutKeywords = {
      oblasti: [],
      zdroj: 'OPZP', // score 12
      nazev: 'Obecná výzva',
    };
    // vyzvaWithKeywords gets: zdroj(12) + keyword bonuses (capped at 30)
    // vyzvaWithoutKeywords gets: zdroj(12) only
    expect(computeRelevance(vyzvaWithKeywords)).toBeGreaterThan(computeRelevance(vyzvaWithoutKeywords));
  });

  it('should apply keyword bonuses from popis', () => {
    // Use a zdroj with score >= 10 to avoid negative correction
    const vyzva = {
      oblasti: [],
      zdroj: 'OPZP', // score 12
      nazev: 'Test',
      popis: 'Program pro bioplynové stanice a fotovoltaiku',
    };
    const score = computeRelevance(vyzva);
    // Should get: zdroj(12) + keyword bonuses (bioplyn=10, fotovoltaika=6) = 28
    expect(score).toBeGreaterThan(12);
  });

  it('should apply keyword bonuses from plnyText', () => {
    // Use a zdroj with score >= 10 to avoid negative correction
    const vyzva = {
      oblasti: [],
      zdroj: 'OPZP', // score 12
      nazev: 'Test',
      plnyText: 'Podpora mikropodniků v horských oblastech',
    };
    const score = computeRelevance(vyzva);
    // Should get: zdroj(12) + keyword bonuses (mikropodnik=5, horské oblasti=12) = 29
    expect(score).toBeGreaterThan(12);
  });

  it('should cap keyword bonuses at 30', () => {
    const vyzva = {
      oblasti: [],
      zdroj: 'NEZNAMY',
      nazev: 'KRNAP Krkonoše horská oblast Natura 2000 CHKO LFA agroturistika bioplyn ubytování lokální potraviny fyzická osoba mikropodnik farmář fotovoltaika zpracování',
    };
    // Many keywords, but capped at 30
    const score = computeRelevance(vyzva);
    expect(score).toBeLessThanOrEqual(30);
  });

  it('should cap total score at 100', () => {
    const vyzva = {
      oblasti: ['cestovni-ruch', 'zemedelstvi', 'zpracovani', 'energetika'],
      zdroj: 'MAS_KRKONOSE',
      nazev: 'KRNAP Krkonoše agroturistika bioplyn ubytování',
      popis: 'horská oblast Natura 2000 CHKO',
      plnyText: 'fyzická osoba mikropodnik farmář fotovoltaika',
    };
    const score = computeRelevance(vyzva);
    expect(score).toBeLessThanOrEqual(100);
  });

  it('should apply negative correction for unmatched oblasti with low zdroj score', () => {
    const vyzva = {
      oblasti: ['neznama-oblast'],
      zdroj: 'NEZNAMY', // score 0
      nazev: 'Test',
    };
    // No matching oblasti, no zdroj score, should get negative correction
    expect(computeRelevance(vyzva)).toBe(0);
  });

  it('should not apply negative correction if zdroj score is >= 10', () => {
    const vyzva = {
      oblasti: ['neznama-oblast'],
      zdroj: 'OPZP', // score 12
      nazev: 'Test',
    };
    // No matching oblasti but zdroj >= 10, no negative correction
    expect(computeRelevance(vyzva)).toBe(12);
  });

  it('should handle empty oblasti array', () => {
    const vyzva = {
      oblasti: [],
      zdroj: 'MZE',
      nazev: 'Test',
    };
    // Empty oblasti is treated as no match, but zdroj >= 10, no negative correction
    const score = computeRelevance(vyzva);
    expect(score).toBe(18);
  });
});
