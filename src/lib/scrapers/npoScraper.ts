import { BaseScraper, type ScrapedVyzva } from "./baseScraper";
import { fetchPage, detectOblastiFromText } from "./utils";
import * as cheerio from "cheerio";

/**
 * NPO (Národní plán obnovy) scraper
 * Vyhlášené výzvy z plánu obnovy
 * URL: https://planobnovy.gov.cz/vyhlasene-vyzvy/
 */
export class NpoScraper extends BaseScraper {
  source = "NPO";
  baseUrl = "https://planobnovy.gov.cz";

  async scrape(): Promise<ScrapedVyzva[]> {
    const vyzvy: ScrapedVyzva[] = [];

    const urls = [
      "https://planobnovy.gov.cz/vyhlasene-vyzvy/",
      "https://planobnovy.gov.cz/",
      // záloha
      "https://www.planobnovycr.cz/vyhlasene-vyzvy",
    ];

    for (const url of urls) {
      try {
        const html = await fetchPage(url);
        const $ = cheerio.load(html);

        $("article, .vyzva, .call-item, .post, table tr, .card, .item").each((_, el) => {
          const $el = $(el);
          if ($el.find("th").length > 0) return;

          const $link = $el.find("a").first();
          const link = $link.attr("href");
          let nazev = $el.find("h2, h3, h4, .title, td:first-child").first().text().trim();
          if (!nazev) nazev = $link.text().trim();

          const popis = $el.find("p, .excerpt, .description").first().text().trim();
          const parentText = $el.text();

          const dateMatch = parentText.match(/(\d{1,2}\.\s*\d{1,2}\.\s*\d{4})/g);
          const alokaceMatch = parentText.match(/([\d\s,]+)\s*(mil\.?|mld\.?)\s*(Kč|CZK|EUR)?/i);
          let alokace: number | undefined;
          if (alokaceMatch) {
            const num = parseFloat(alokaceMatch[1].replace(/\s/g, "").replace(",", "."));
            const isEur = alokaceMatch[3]?.toUpperCase() === "EUR";
            const mult = alokaceMatch[2].toLowerCase().includes("mld") ? 1e9 : 1e6;
            alokace = Math.round(num * mult * (isEur ? 25 : 1));
          }

          const isRelevant =
            nazev.length > 10 &&
            !nazev.toLowerCase().includes("menu") &&
            !nazev.toLowerCase().includes("navigace") &&
            !nazev.toLowerCase().includes("kontakt");

          if (nazev && isRelevant) {
            const fullUrl = link
              ? link.startsWith("http") ? link : this.resolveUrl(link)
              : url;
            if (!vyzvy.some((v) => v.nazev === this.cleanText(nazev))) {
              vyzvy.push({
                nazev: this.cleanText(nazev),
                zdroj: this.source,
                zdrojUrl: fullUrl,
                oblasti: detectOblastiFromText(nazev + " " + popis + " obnova"),
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
