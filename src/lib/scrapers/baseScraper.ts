import crypto from "crypto";

export interface ScrapedVyzva {
  nazev: string;
  zdroj: string;
  zdrojUrl: string;
  oblasti: string[];
  alokace?: number;
  minCastka?: number;
  maxCastka?: number;
  miraSpolufinancovani?: number;
  deadline?: Date;
  datumVyhlaseni?: Date;
  popis?: string;
  plnyText?: string;
  zdrojDokumentace?: string;
  status: string;
}

export abstract class BaseScraper {
  abstract source: string;
  abstract baseUrl: string;

  abstract scrape(): Promise<ScrapedVyzva[]>;

  generateHash(vyzva: ScrapedVyzva): string {
    const data = JSON.stringify({
      nazev: vyzva.nazev,
      deadline: vyzva.deadline,
      alokace: vyzva.alokace,
      status: vyzva.status,
    });
    return crypto.createHash("md5").update(data).digest("hex");
  }

  parseDate(dateStr: string): Date | undefined {
    if (!dateStr) return undefined;

    // DD.MM.YYYY
    const dotMatch = dateStr.match(/(\d{1,2})\.(\d{1,2})\.(\d{4})/);
    if (dotMatch) {
      return new Date(
        parseInt(dotMatch[3]),
        parseInt(dotMatch[2]) - 1,
        parseInt(dotMatch[1])
      );
    }

    // YYYY-MM-DD
    const isoMatch = dateStr.match(/(\d{4})-(\d{2})-(\d{2})/);
    if (isoMatch) {
      return new Date(
        parseInt(isoMatch[1]),
        parseInt(isoMatch[2]) - 1,
        parseInt(isoMatch[3])
      );
    }

    try {
      const d = new Date(dateStr);
      return isNaN(d.getTime()) ? undefined : d;
    } catch {
      return undefined;
    }
  }

  parseAmount(amountStr: string): number | undefined {
    if (!amountStr) return undefined;

    // Handle "mil." / "mld." multipliers
    const lower = amountStr.toLowerCase();
    let multiplier = 1;
    if (lower.includes("mld")) multiplier = 1_000_000_000;
    else if (lower.includes("mil")) multiplier = 1_000_000;
    else if (lower.includes("tis")) multiplier = 1_000;

    // Extract numeric part (handles both comma and dot decimals)
    const numMatch = amountStr.match(/[\d\s]+[.,]?\d*/);
    if (!numMatch) return undefined;

    const cleaned = numMatch[0].replace(/\s/g, "").replace(",", ".");
    const num = parseFloat(cleaned);
    return isNaN(num) ? undefined : Math.round(num * multiplier);
  }

  cleanText(text: string): string {
    return text.replace(/\s+/g, " ").trim();
  }

  resolveUrl(link: string): string {
    if (link.startsWith("http")) return link;
    return this.baseUrl + (link.startsWith("/") ? "" : "/") + link;
  }
}
