import { BaseScraper, type ScrapedVyzva } from "./baseScraper";
import { fetchPage, detectOblastiFromText } from "./utils";
import * as cheerio from "cheerio";

/**
 * OP TAK (Operační program Technologie a aplikace pro konkurenceschopnost) scraper
 * Dotace pro MSP, inovace, digitalizaci a VaV
 * URL: https://optak.gov.cz/
 */
export class OptakScraper extends BaseScraper {
  source = "OPTAK";
  baseUrl = "https://optak.gov.cz";

  async scrape(): Promise<ScrapedVyzva[]> {
    const vyzvy: ScrapedVyzva[] = [];

    const urls = [
      "https://optak.gov.cz/vyzvy",
      "https://optak.gov.cz/",
      "https://optak.gov.cz/aplikace/",
    ];

    for (const url of urls) {
      try {
        const html = await fetchPage(url);
        const $ = cheerio.load(html);

        $("article, .vyzva, .call, .card, table tr, li").each((_, el) => {
          const $el = $(el);
          if ($el.find("th").length > 0) return;

          const $link = $el.is("a") ? $el : $el.find("a").first();
          const link = $link.attr("href");
          let nazev = $el.find("h2, h3, h4, .title").first().text().trim();
          if (!nazev) nazev = $el.find("a").first().text().trim();

          const popis = $el.find("p, .excerpt, .description").first().text().trim();
          const parentText = $el.text();

          const dateMatch = parentText.match(/(\d{1,2}\.\s*\d{1,2}\.\s*\d{4})/g);
          const alokaceMatch = parentText.match(/([\d\s,]+)\s*(mil\.?|mld\.?)\s*Kč/i);
          let alokace: number | undefined;
          if (alokaceMatch) {
            const num = parseFloat(alokaceMatch[1].replace(/\s/g, "").replace(",", "."));
            alokace = alokaceMatch[2].toLowerCase().includes("mld") ? num * 1e9 : num * 1e6;
          }

          const isRelevant =
            nazev.length > 10 &&
            (nazev.toLowerCase().includes("výzv") ||
              nazev.toLowerCase().includes("inovac") ||
              nazev.toLowerCase().includes("technolog") ||
              nazev.toLowerCase().includes("digitali") ||
              nazev.toLowerCase().includes("podnik") ||
              nazev.toLowerCase().includes("optak"));
          const isExcluded =
            nazev.toLowerCase().includes("menu") || nazev.toLowerCase().includes("kontakt");

          if (nazev && isRelevant && !isExcluded) {
            const fullUrl = link
              ? link.startsWith("http") ? link : this.resolveUrl(link)
              : url;
            if (!vyzvy.some((v) => v.nazev === this.cleanText(nazev))) {
              vyzvy.push({
                nazev: this.cleanText(nazev),
                zdroj: this.source,
                zdrojUrl: fullUrl,
                oblasti: detectOblastiFromText(nazev + " " + popis + " inovace technologie podnikání digitalizace"),
                deadline: dateMatch ? this.parseDate(dateMatch[dateMatch.length - 1]) : undefined,
                popis: popis ? this.cleanText(popis) : undefined,
                status: this.detectStatus(parentText),
                alokace,
              });
            }
          }
        });
      } catch {
        // URL nedostupná
      }
    }

    // Fallback — API Agentura jako provozovatel OP TAK
    if (vyzvy.length === 0) {
      try {
        const html = await fetchPage("https://www.agentura-api.org/cs/podporovane-aktivity-optak/");
        const $ = cheerio.load(html);
        $("article, .card, h3, h4").each((_, el) => {
          const $el = $(el);
          const link = $el.find("a").first().attr("href");
          const nazev = $el.find("a, h3, h4").first().text().trim();
          if (nazev.length > 10 && !vyzvy.some((v) => v.nazev === this.cleanText(nazev))) {
            vyzvy.push({
              nazev: this.cleanText(nazev),
              zdroj: this.source,
              zdrojUrl: link
                ? link.startsWith("http") ? link : "https://www.agentura-api.org" + link
                : "https://www.agentura-api.org/cs/podporovane-aktivity-optak/",
              oblasti: detectOblastiFromText(nazev + " inovace technologie podnikání"),
              status: "otevrena",
            });
          }
        });
      } catch {
        // ignoruj
      }
    }

    return vyzvy;
  }

  private detectStatus(text: string): string {
    const lower = text.toLowerCase();
    if (lower.includes("ukončen") || lower.includes("uzavřen")) return "uzavrena";
    if (lower.includes("plánov") || lower.includes("připrav")) return "pripravovana";
    return "otevrena";
  }
}
