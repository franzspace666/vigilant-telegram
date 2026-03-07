export interface VyzvaFromAPI {
  id: string;
  nazev: string;
  zdroj: string;
  zdrojUrl: string;
  oblasti: string[];
  alokace: string | null;
  minCastka: string | null;
  maxCastka: string | null;
  miraSpolufinancovani: number | null;
  deadline: string | null;
  datumVyhlaseni: string | null;
  datumUkonceni: string | null;
  popis: string | null;
  plnyText: string | null;
  status: string;
  hash: string;
  createdAt: string;
  updatedAt: string;
  // Optional extended fields
  typZadatele?: string[];
  cisloVyzvy?: string | null;
  kolo?: string | null;
  podminkyUrl?: string | null;
}

// DB status -> UI status key
export const statusMap: Record<string, string> = {
  otevrena: "open",
  ukoncena: "closed",
  planovana: "planned",
  pozastavena: "closed",
};

// UI status key -> Czech label
export const statusLabels: Record<string, string> = {
  open: "Otevřená",
  closing: "Končí brzy",
  planned: "Plánovaná",
  closed: "Uzavřená",
};

export function mapDbStatus(dbStatus: string): string {
  return statusMap[dbStatus] ?? "open";
}

export function formatCastka(value: string | null): string {
  if (!value) return "—";
  const num = Number(value);
  if (isNaN(num)) return value;
  if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(1).replace(".0", "")} mld. Kč`;
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1).replace(".0", "")} mil. Kč`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(0)} tis. Kč`;
  return `${num} Kč`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function serializeVyzva(v: any): VyzvaFromAPI {
  return {
    ...v,
    alokace: v.alokace?.toString() ?? null,
    minCastka: v.minCastka?.toString() ?? null,
    maxCastka: v.maxCastka?.toString() ?? null,
    deadline: v.deadline?.toISOString?.() ?? v.deadline ?? null,
    datumVyhlaseni: v.datumVyhlaseni?.toISOString?.() ?? v.datumVyhlaseni ?? null,
    datumUkonceni: v.datumUkonceni?.toISOString?.() ?? v.datumUkonceni ?? null,
    createdAt: v.createdAt?.toISOString?.() ?? v.createdAt,
    updatedAt: v.updatedAt?.toISOString?.() ?? v.updatedAt,
  };
}
