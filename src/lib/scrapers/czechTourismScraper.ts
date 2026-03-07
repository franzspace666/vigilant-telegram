import { BaseScraper, type ScrapedVyzva } from "./baseScraper";
import { fetchPage, detectOblastiFromText } from "./utils";
import * as cheerio from "cheerio";

/**
 * CzechTourism scraper
 * Dotace a granty pro rozvoj cestovního ruchu
 * URL: https://www.czechtourism.cz/
 */
export class CzechTourismScraper extends BaseScraper {
  source = "CZECH_TOURISM";
  baseUrl = "https://www.czechtourism.cz";

  async scrape(): Promise<ScrapedVyzva[]> {
    const vyzvy: ScrapedVyzva[] = [];

    const urls = [
      "https://www.czechtourism.cz/dotace/",
      "https://www.czechtourism.cz/granty/",
      "https://www.czechtourism.cz/o-nas/dotace-granty/",
      "https://www.czechtourism.cz/",
    ];

    for (const url of urls) {
      try {
        const html = await fetchPage(url);
        const $ = cheerio.load(html);

        $("article, .card, .post, .grant-item, .dotace-item, table tr, li.item").each((_, el) => {
          const $el = $(el);
          if ($el.find("th").length > 0) return;

          const $link = $el.find("a").first();
          const link = $link.attr("href");
          let nazev = $el.find("h2, h3, h4, .title, .heading").first().text().trim();
          if (!nazev) nazev = $link.text().trim();

          const popis = $el.find("p, .excerpt, .description, .perex").first().text().trim();
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
            (nazev.toLowerCase().includes("dotac") ||
              nazev.toLowerCase().includes("výzv") ||
              nazev.toLowerCase().includes("grant") ||
              nazev.toLowerCase().includes("program") ||
              nazev.toLowerCase().includes("turistik") ||
              nazev.toLowerCase().includes("turis") ||
              nazev.toLowerCase().includes("cestov") ||
              nazev.toLowerCase().includes("podpora")) &&
            !nazev.toLowerCase().includes("menu") &&
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
                oblasti: detectOblastiFromText(
                  nazev + " " + popis + " cestovní ruch turistika ubytování"
                ),
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
