import axios, { type AxiosRequestConfig } from "axios";

const DEFAULT_HEADERS = {
  "User-Agent": "Mozilla/5.0 (compatible; DotacniHlidac/1.0)",
  Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Accept-Language": "cs,en;q=0.5",
};

export async function fetchPage(
  url: string,
  options?: AxiosRequestConfig
): Promise<string> {
  const response = await axios.get(url, {
    headers: DEFAULT_HEADERS,
    timeout: 30_000,
    ...options,
  });
  return response.data;
}

/**
 * Detect oblasti (areas/sectors) from text content.
 * Shared across scrapers for consistent categorization.
 */
export function detectOblastiFromText(text: string): string[] {
  const oblasti: string[] = [];
  const lower = text.toLowerCase();

  const patterns: [RegExp, string][] = [
    [/zem[eě]d[eě]lst|agrár|farm|hospodář/i, "zemedelstvi"],
    [/potraviny|zpracován[ií]|ml[eé]k|sýr|maso/i, "zpracovani"],
    [/les[ůu]?[^n]|dřev|těžb/i, "lesnictvi"],
    [/energi[ie]|fotovoltai|bioplyn|biomasa|tepeln/i, "energetika"],
    [/turis[mt]|penzion|ubytov|hotel|rekrea/i, "cestovni-ruch"],
    [/ekolog|životn[ií]|biodiverzit|krajin|přír/i, "zivotni-prostredi"],
    [/zateplen|[úu]spor.*energ|izolac/i, "uspory-energie"],
    [/odpad|recykl|cirkulár/i, "odpady"],
    [/voda|kanalizac|čističk|vodovod/i, "voda"],
    [/ovzduš|emis/i, "ovzdusi"],
    [/region|místn[ií]|lokáln[ií]|venkov/i, "regionalni-produkt"],
    [/obec|infrastruktur|komunál/i, "rozvoj-obci"],
  ];

  for (const [regex, oblast] of patterns) {
    if (regex.test(lower) && !oblasti.includes(oblast)) {
      oblasti.push(oblast);
    }
  }

  return oblasti.length > 0 ? oblasti : ["ostatni"];
}

export function parseStatus(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes("otevřen") || lower.includes("příjem") || lower.includes("aktivn"))
    return "otevrena";
  if (lower.includes("uzavřen") || lower.includes("ukončen") || lower.includes("zavřen"))
    return "uzavrena";
  if (lower.includes("zrušen")) return "zrusena";
  return "otevrena";
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
