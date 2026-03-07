import { BaseScraper, type ScrapedVyzva } from "./baseScraper";
import { fetchPage, detectOblastiFromText } from "./utils";
import * as cheerio from "cheerio";

/**
 * API Agentura (Agentura pro podnikání a inovace) scraper
 * Výzvy zaměřené na MSP, inovace, export
 * URL: https://apiagentura.gov.cz/cs/
 */
export class ApiAgenturaScraper extends BaseScraper {
  source = "API_AGENTURA";
  baseUrl = "https://apiagentura.gov.cz";

  async scrape(): Promise<ScrapedVyzva[]> {
    const vyzvy: ScrapedVyzva[] = [];

    const urls = [
      "https://apiagentura.gov.cz/cs/vyzvy/",
      "https://apiagentura.gov.cz/cs/",
      "https://apiagentura.gov.cz/cs/programy/",
      "https://www.agentura-api.org/cs/",
    ];

    for (const url of urls) {
      try {
        const html = await fetchPage(url);
        const $ = cheerio.load(html);

        $("article, .vyzva, .call, .card, table tr, .program").each((_, el) => {
          const $el = $(el);
          if ($el.find("th").length > 0) return;

          const $link = $el.find("a").first();
          const link = $link.attr("href");
          let nazev = $el.find("h2, h3, h4, .title").first().text().trim();
          if (!nazev) nazev = $link.text().trim();

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
              nazev.toLowerCase().includes("program") ||
              nazev.toLowerCase().includes("podnik") ||
              nazev.toLowerCase().includes("inovac") ||
              nazev.toLowerCase().includes("dotac") ||
              nazev.toLowerCase().includes("export") ||
              nazev.toLowerCase().includes("rozvoj"));
          const isExcluded =
            nazev.toLowerCase().includes("menu") || nazev.toLowerCase().includes("kontakt");

          if (nazev && isRelevant && !isExcluded) {
            const baseForUrl = url.startsWith("https://apiagentura")
              ? "https://apiagentura.gov.cz"
              : "https://www.agentura-api.org";
            const fullUrl = link
              ? link.startsWith("http") ? link : baseForUrl + link
              : url;
            if (!vyzvy.some((v) => v.nazev === this.cleanText(nazev))) {
              vyzvy.push({
                nazev: this.cleanText(nazev),
                zdroj: this.source,
                zdrojUrl: fullUrl,
                oblasti: detectOblastiFromText(nazev + " " + popis + " podnikání inovace"),
                deadline: dateMatch ? this.parseDate(dateMatch[dateMatch.length - 1]) : undefined,
                popis: popis ? this.cleanText(popis) : undefined,
                status: this.detectStatus(parentText),
                alokace,
              });
            }
          }
        });
        if (vyzvy.length > 0) break;
      } catch {
        // URL nedostupná
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
