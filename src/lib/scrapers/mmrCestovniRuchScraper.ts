import { BaseScraper, type ScrapedVyzva } from "./baseScraper";
import { fetchPage, detectOblastiFromText } from "./utils";
import * as cheerio from "cheerio";

/**
 * MMR Cestovní ruch scraper
 * 
 * Ministerstvo pro místní rozvoj - dotace na cestovní ruch
 * URL: https://mmr.gov.cz/cs/narodni-dotace/cestovni-ruch
 */
export class MmrCestovniRuchScraper extends BaseScraper {
  source = "MMR_CESTOVNI_RUCH";
  baseUrl = "https://mmr.gov.cz";

  async scrape(): Promise<ScrapedVyzva[]> {
    const vyzvy: ScrapedVyzva[] = [];

    try {
      const urls = [
        "https://mmr.gov.cz/cs/narodni-dotace/cestovni-ruch",
        "https://mmr.gov.cz/cs/narodni-dotace",
      ];

      for (const url of urls) {
        try {
          const html = await fetchPage(url);
          const $ = cheerio.load(html);

          // Hledej programy a výzvy
          $("article, .program, .vyzva, table tr, a[href*='dotac'], a[href*='program']").each((_, element) => {
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
               nazev.toLowerCase().includes("cestovn") ||
               nazev.toLowerCase().includes("turistik") ||
               nazev.toLowerCase().includes("ubytov"));
            
            const isExcluded = 
              nazev.toLowerCase().includes("archiv") ||
              nazev.toLowerCase().includes("kontakt") ||
              nazev.toLowerCase().includes("legislativ");

            if (nazev && isRelevant && !isExcluded) {
              const fullUrl = link ? (link.startsWith("http") ? link : this.resolveUrl(link)) : url;
              
              const existuje = vyzvy.some(v => v.nazev === this.cleanText(nazev) || v.zdrojUrl === fullUrl);
              if (!existuje) {
                vyzvy.push({
                  nazev: this.cleanText(nazev),
                  zdroj: this.source,
                  zdrojUrl: fullUrl,
                  oblasti: detectOblastiFromText(nazev + " " + popis + " cestovní ruch turismus"),
                  deadline: dateMatch ? this.parseDate(dateMatch[dateMatch.length - 1]) : undefined,
                  popis: this.cleanText(popis || `MMR Cestovní ruch: ${nazev}`),
                  status: this.detectStatus(parentText),
                });
              }
            }
          });
        } catch {
          console.log(`MMR: URL ${url} nedostupná`);
        }
      }
    } catch (error) {
      console.error("MMR Cestovni ruch scraper error:", error);
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
