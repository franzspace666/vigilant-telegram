import { describe, it, expect } from 'vitest';
import { detectOblastiFromText, parseStatus, delay } from '../utils';

describe('detectOblastiFromText', () => {
  it('should detect zemedelstvi from agriculture keywords', () => {
    expect(detectOblastiFromText('zemědělství')).toContain('zemedelstvi');
    // 'agrár' pattern
    expect(detectOblastiFromText('agrární sektor')).toContain('zemedelstvi');
    expect(detectOblastiFromText('farmáři')).toContain('zemedelstvi');
    expect(detectOblastiFromText('hospodářství')).toContain('zemedelstvi');
  });

  it('should detect zpracovani from food processing keywords', () => {
    expect(detectOblastiFromText('potraviny')).toContain('zpracovani');
    expect(detectOblastiFromText('zpracování produktů')).toContain('zpracovani');
    expect(detectOblastiFromText('mlékárna')).toContain('zpracovani');
    expect(detectOblastiFromText('sýrárna')).toContain('zpracovani');
    expect(detectOblastiFromText('masokombinát')).toContain('zpracovani');
  });

  it('should detect lesnictvi from forestry keywords', () => {
    expect(detectOblastiFromText('lesů obnova')).toContain('lesnictvi');
    expect(detectOblastiFromText('dřevozpracování')).toContain('lesnictvi');
    expect(detectOblastiFromText('těžba dřeva')).toContain('lesnictvi');
  });

  it('should detect energetika from energy keywords', () => {
    expect(detectOblastiFromText('energie')).toContain('energetika');
    expect(detectOblastiFromText('fotovoltaika')).toContain('energetika');
    expect(detectOblastiFromText('bioplynová stanice')).toContain('energetika');
    expect(detectOblastiFromText('biomasa')).toContain('energetika');
    expect(detectOblastiFromText('tepelné čerpadlo')).toContain('energetika');
  });

  it('should detect cestovni-ruch from tourism keywords', () => {
    expect(detectOblastiFromText('turismus')).toContain('cestovni-ruch');
    expect(detectOblastiFromText('penzion')).toContain('cestovni-ruch');
    expect(detectOblastiFromText('ubytování')).toContain('cestovni-ruch');
    expect(detectOblastiFromText('hotel')).toContain('cestovni-ruch');
    expect(detectOblastiFromText('rekreace')).toContain('cestovni-ruch');
  });

  it('should detect zivotni-prostredi from environment keywords', () => {
    expect(detectOblastiFromText('ekologie')).toContain('zivotni-prostredi');
    expect(detectOblastiFromText('životní prostředí')).toContain('zivotni-prostredi');
    expect(detectOblastiFromText('biodiverzita')).toContain('zivotni-prostredi');
    expect(detectOblastiFromText('krajina')).toContain('zivotni-prostredi');
    expect(detectOblastiFromText('přírodní rezervace')).toContain('zivotni-prostredi');
  });

  it('should detect uspory-energie from energy saving keywords', () => {
    expect(detectOblastiFromText('zateplení budov')).toContain('uspory-energie');
    expect(detectOblastiFromText('úspory energie')).toContain('uspory-energie');
    expect(detectOblastiFromText('izolace domu')).toContain('uspory-energie');
  });

  it('should detect odpady from waste keywords', () => {
    expect(detectOblastiFromText('odpadové hospodářství')).toContain('odpady');
    expect(detectOblastiFromText('recyklace')).toContain('odpady');
    expect(detectOblastiFromText('cirkulární ekonomika')).toContain('odpady');
  });

  it('should detect voda from water keywords', () => {
    expect(detectOblastiFromText('vodovod')).toContain('voda');
    expect(detectOblastiFromText('kanalizace')).toContain('voda');
    expect(detectOblastiFromText('čistička odpadních vod')).toContain('voda');
  });

  it('should detect ovzdusi from air quality keywords', () => {
    expect(detectOblastiFromText('ovzduší')).toContain('ovzdusi');
    expect(detectOblastiFromText('emise')).toContain('ovzdusi');
  });

  it('should detect regionalni-produkt from regional keywords', () => {
    expect(detectOblastiFromText('regionální produkt')).toContain('regionalni-produkt');
    expect(detectOblastiFromText('místní produkce')).toContain('regionalni-produkt');
    expect(detectOblastiFromText('lokální potraviny')).toContain('regionalni-produkt');
    expect(detectOblastiFromText('venkovský rozvoj')).toContain('regionalni-produkt');
  });

  it('should detect rozvoj-obci from municipal keywords', () => {
    // 'obec' pattern matches exactly 'obec'
    expect(detectOblastiFromText('obec Horní')).toContain('rozvoj-obci');
    expect(detectOblastiFromText('infrastruktura')).toContain('rozvoj-obci');
    expect(detectOblastiFromText('komunální služby')).toContain('rozvoj-obci');
  });

  it('should detect multiple oblasti from complex text', () => {
    // Use keywords that match actual patterns
    const text = 'Podpora zemědělství a turismu v regionální oblasti s důrazem na energii';
    const oblasti = detectOblastiFromText(text);
    expect(oblasti).toContain('zemedelstvi');
    expect(oblasti).toContain('cestovni-ruch'); // matches 'turis'
    expect(oblasti).toContain('energetika'); // matches 'energi'
    expect(oblasti).toContain('regionalni-produkt'); // matches 'region'
  });

  it('should return ["ostatni"] when no keywords match', () => {
    expect(detectOblastiFromText('abc xyz')).toEqual(['ostatni']);
    expect(detectOblastiFromText('')).toEqual(['ostatni']);
    expect(detectOblastiFromText('random text without keywords')).toEqual(['ostatni']);
  });

  it('should not duplicate oblasti', () => {
    const text = 'zemědělství agrární farma farmáři';
    const oblasti = detectOblastiFromText(text);
    const zemedelstviCount = oblasti.filter(o => o === 'zemedelstvi').length;
    expect(zemedelstviCount).toBe(1);
  });

  it('should be case insensitive', () => {
    expect(detectOblastiFromText('ZEMĚDĚLSTVÍ')).toContain('zemedelstvi');
    expect(detectOblastiFromText('Turismus')).toContain('cestovni-ruch');
  });
});

describe('parseStatus', () => {
  it('should parse open statuses', () => {
    expect(parseStatus('otevřená výzva')).toBe('otevrena');
    expect(parseStatus('příjem žádostí')).toBe('otevrena');
    expect(parseStatus('aktivní')).toBe('otevrena');
  });

  it('should parse closed statuses', () => {
    expect(parseStatus('uzavřená')).toBe('uzavrena');
    expect(parseStatus('ukončena')).toBe('uzavrena');
    expect(parseStatus('zavřena')).toBe('uzavrena');
  });

  it('should parse cancelled status', () => {
    expect(parseStatus('zrušena')).toBe('zrusena');
    expect(parseStatus('výzva byla zrušena')).toBe('zrusena');
  });

  it('should default to otevrena for unknown statuses', () => {
    expect(parseStatus('neznámý stav')).toBe('otevrena');
    expect(parseStatus('')).toBe('otevrena');
    expect(parseStatus('abc')).toBe('otevrena');
  });

  it('should be case insensitive', () => {
    expect(parseStatus('OTEVŘENÁ')).toBe('otevrena');
    expect(parseStatus('UZAVŘENÁ')).toBe('uzavrena');
    expect(parseStatus('ZRUŠENA')).toBe('zrusena');
  });
});

describe('delay', () => {
  it('should delay for the specified time', async () => {
    const start = Date.now();
    await delay(50);
    const elapsed = Date.now() - start;
    expect(elapsed).toBeGreaterThanOrEqual(45); // Allow small timing variance
    expect(elapsed).toBeLessThan(100);
  });

  it('should resolve without value', async () => {
    const result = await delay(1);
    expect(result).toBeUndefined();
  });
});
