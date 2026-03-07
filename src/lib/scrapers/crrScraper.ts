import { BaseScraper, type ScrapedVyzva } from "./baseScraper";
import { fetchPage, detectOblastiFromText } from "./utils";
import * as cheerio from "cheerio";

/**
 * CRR (Centrum pro regionální rozvoj) scraper
 * 
 * Národní dotace
 * URL: https://crr.gov.cz/narodni-dotace/
 */
export class CrrScraper extends BaseScraper {
  source = "CRR";
  baseUrl = "https://crr.gov.cz";

  async scrape(): Promise<ScrapedVyzva[]> {
    const vyzvy: ScrapedVyzva[] = [];

    try {
      const urls = [
        "https://crr.gov.cz/narodni-dotace/",
        "https://crr.gov.cz/",
      ];

      for (const url of urls) {
        try {
          const html = await fetchPage(url);
          const $ = cheerio.load(html);

          // Hledej dotace a programy
          $("article, .vyzva, .program, table tr, .card, a[href*='dotac'], a[href*='program']").each((_, element) => {
            const $el = $(element);
            
            if ($el.find("th").length > 0) return;
            
            const $link = $el.is("a") ? $el : $el.find("a").first();
            const link = $link.attr("href");
            let nazev = $el.find("h2, h3, h4, .title").first().text().trim();
            if (!nazev) {
              nazev = $link.text().trim();
            }
            
            const popis = $el.find("p, .description").first().text().trim();
            const parentText = $el.text();
            
            // Datum
            const dateMatch = parentText.match(/(\d{1,2}\.\s*\d{1,2}\.\s*\d{4})/g);

            // Filtrování
            const isRelevant = nazev.length > 10 && 
              (nazev.toLowerCase().includes("dotac") ||
               nazev.toLowerCase().includes("program") ||
               nazev.toLowerCase().includes("podpora") ||
               nazev.toLowerCase().includes("výzv") ||
               nazev.toLowerCase().includes("region"));
            
            const isExcluded = 
              nazev.toLowerCase().includes("o nás") ||
              nazev.toLowerCase().includes("kontakt") ||
              nazev.toLowerCase().includes("kariér");

            if (nazev && isRelevant && !isExcluded) {
              const fullUrl = link ? (link.startsWith("http") ? link : this.resolveUrl(link)) : url;
              
              const existuje = vyzvy.some(v => v.nazev === this.cleanText(nazev) || v.zdrojUrl === fullUrl);
              if (!existuje) {
                vyzvy.push({
                  nazev: this.cleanText(nazev),
                  zdroj: this.source,
                  zdrojUrl: fullUrl,
                  oblasti: detectOblastiFromText(nazev + " " + popis + " regionální rozvoj"),
                  deadline: dateMatch ? this.parseDate(dateMatch[dateMatch.length - 1]) : undefined,
                  popis: this.cleanText(popis || `CRR: ${nazev}`),
                  status: this.detectStatus(parentText),
                });
              }
            }
          });
        } catch {
          console.log(`CRR: URL ${url} nedostupná`);
        }
      }
    } catch (error) {
      console.error("CRR scraper error:", error);
    }

    return vyzvy;
  }

  private detectStatus(text: string): "otevrena" | "uzavrena" | "pripravovana" {
    const lower = text.toLowerCase();
    if (lower.includes("ukončen") || lower.includes("uzavřen")) {
      return "uzavrena";
    }
    if (lower.includes("plánov") || lower.includes("připrav")) {
      return "pripravovana";
    }
    return "otevrena";
  }
}
