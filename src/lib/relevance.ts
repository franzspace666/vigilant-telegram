const DOKUMENT_PATTERNS: RegExp[] = [
  /^příručka\b/i,
  /\bpříručka\s+pro\s+žadatele/i,
  /^zásady,?\s+kterými\s+se\s+stanovují/i,
  /^zpřesnění\s+zásad/i,
  /^informace\s+pro\s+žadatele/i,
  /^metodika\b/i,
  /^pokyny\s+pro\s+žadatele/i,
  /\bsdělení\s+pro\s+žadatele/i,
  /^schválené\s+žádosti\b/i,
  /\bvýsledky\s+(výzvy|hodnocení)\b/i,
  /^výroční\s+zpráva\b/i,
  /^harmonogram\s+výzev\b/i,
  /^přehled\s+výzev\b/i,
  /^seznam\s+(příjemců|schválených|podporovaných)\b/i,
  /^zpráva\s+o\s+realizaci\b/i,
];

export function classifyVyzva(nazev: string): "vyzva" | "dokument" {
  const n = nazev.trim();
  for (const pattern of DOKUMENT_PATTERNS) {
    if (pattern.test(n)) return "dokument";
  }
  return "vyzva";
}

const OBLAST_SCORES: Record<string, number> = {
  "cestovni-ruch":   16,
  "zemedelstvi":     14,
  "zpracovani":      12,
  "energetika":      12,
  "uspory-energie":  8,
  "regionalni-produkt": 10,
  "zivotni-prostredi": 6,  // CHKO, Natura 2000
  "rozvoj-obci":     4,
  "voda":            2,
  "lesnictvi":       2,
  "odpady":          1,
  "ovzdusi":         1,
  "ostatni":         0,
};

const ZDROJ_SCORES: Record<string, number> = {
  "MZE":              18,  // eAGRI / MZe – zemědělství
  "SZIF":             18,
  "SZIF_MAS":         18,
  "MAS_KRKONOSE":     20,  // přímo v Krkonoších
  "SFZP":             14,  // SFŽP
  "OPZP":             12,  // OP ŽP
  "AOPK":             16,  // KRNAP / CHKO
  "MMR_CESTOVNI_RUCH":16,  // cestovní ruch
  "CRR":              12,
  "NPZP":             10,
  "DOTACE_EU":        8,
  "CINEA":            4,   // EU programy – méně relevantní pro mikropodnik
};

const KEYWORD_BONUSES: Array<{ pattern: RegExp; score: number }> = [
  { pattern: /krnap|krkonošský\s+národní\s+park/i, score: 20 },
  { pattern: /krkonoše|krkonošsk/i,                score: 15 },
  { pattern: /horská\s+oblast|horské\s+oblasti/i,  score: 12 },
  { pattern: /natura\s+2000/i,                     score: 10 },
  { pattern: /chko\b|chráněná\s+krajinná\s+oblast/i, score: 10 },
  { pattern: /lfa\b|méně\s+příznivé\s+oblasti/i,  score: 8 },
  { pattern: /semily|liberecký\s+kraj|královéhradecký\s+kraj/i, score: 6 },
  { pattern: /agroturistika|farmářský\s+turismus/i, score: 10 },
  { pattern: /bioplyn|bioplynová\s+stanice/i,      score: 10 },
  { pattern: /ubytování|penzion|apartmán|chalup/i, score: 8 },
  { pattern: /lokální\s+potraviny|farmářský\s+prodej|farm\s+shop/i, score: 8 },
  { pattern: /fyzická\s+osoba|drobný\s+podnikatel|soukromý\s+podnikatel/i, score: 8 },
  { pattern: /mikropodnik|malý\s+podnik/i,         score: 5 },
  { pattern: /farmář|zemědělec|zemědělský\s+podnikatel/i, score: 6 },
  { pattern: /obnovitelná\s+energie|fotovoltaika|solární|tepelné\s+čerpadlo/i, score: 6 },
  { pattern: /zpracování\s+zemědělsk|potravinářsk|masna|mlékárna/i, score: 6 },
];

interface VyzvaForScoring {
  oblasti: string[];
  zdroj: string;
  nazev: string;
  popis?: string | null;
  plnyText?: string | null;
}

export function computeRelevance(vyzva: VyzvaForScoring): number {
  let score = 0;

  const oblastScore = vyzva.oblasti.reduce(
    (acc, o) => acc + (OBLAST_SCORES[o] ?? 0),
    0
  );
  score += Math.min(oblastScore, 40);
  score += Math.min(ZDROJ_SCORES[vyzva.zdroj] ?? 0, 20);

  const text = [vyzva.nazev, vyzva.popis ?? "", vyzva.plnyText ?? ""].join(" ");
  let kwScore = 0;
  for (const { pattern, score: s } of KEYWORD_BONUSES) {
    if (pattern.test(text)) kwScore += s;
  }
  score += Math.min(kwScore, 30);

  const hasAnyMatch = vyzva.oblasti.some((o) => (OBLAST_SCORES[o] ?? 0) > 0);
  if (!hasAnyMatch && (ZDROJ_SCORES[vyzva.zdroj] ?? 0) < 10) {
    score = Math.max(score - 15, 0);
  }

  return Math.min(Math.round(score), 100);
}
