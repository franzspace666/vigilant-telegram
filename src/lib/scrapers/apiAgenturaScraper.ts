import { BaseScraper, type ScrapedVyzva } from "./baseScraper";
import { fetchPage, detectOblastiFromText } from "./utils";
import * as cheerio from "cheerio";

/**
 * API Agentura scraper
 * 
 * Agentura pro podnikání a inovace
 * URL: https://www.agentura-api.org/cs/
 */
export class ApiAgenturaScraper extends BaseScraper {
  source = "API_AGENTURA";
  baseUrl = "https://www.agentura-api.org";

  async scrape(): Promise<ScrapedVyzva[]> {
    const vyzvy: ScrapedVyzva[] = [];

    try {
      const urls = [
        "https://www.agentura-api.org/cs/",
        "https://www.agentura-api.org/cs/podporovane-aktivity-optak/",
        "https://www.agentura-api.org/cs/programy-podpory/",
      ];

      for (const url of urls) {
        try {
          const html = await fetchPage(url);
          const $ = cheerio.load(html);

          // Hledej výzvy a programy
          $("article, .vyzva, .call, .program, table tr, .card").each((_, element) => {
            const $el = $(element);
            
            if ($el.find("th").length > 0) return;
            
            const $link = $el.find("a").first();
            const link = $link.attr("href");
            let nazev = $el.find("h2, h3, h4, .title").first().text().trim();
            if (!nazev) {
              nazev = $link.text().trim();
            }
            
            const popis = $el.find("p, .description, .excerpt").first().text().trim();
            const parentText = $el.text();
            
            // Datum
            const dateMatch = parentText.match(/(\d{1,2}\.\s*\d{1,2}\.\s*\d{4})/g);

            // Filtrování
            const isRelevant = nazev.length > 10 && 
              (nazev.toLowerCase().includes("výzv") ||
               nazev.toLowerCase().includes("program") ||
               nazev.toLowerCase().includes("podnik") ||
               nazev.toLowerCase().includes("inovac") ||
               nazev.toLowerCase().includes("dotac"));

            if (nazev && isRelevant) {
              const fullUrl = link ? (link.startsWith("http") ? link : this.resolveUrl(link)) : url;
              
              const existuje = vyzvy.some(v => v.nazev === this.cleanText(nazev) || v.zdrojUrl === fullUrl);
              if (!existuje) {
                vyzvy.push({
                  nazev: this.cleanText(nazev),
                  zdroj: this.source,
                  zdrojUrl: fullUrl,
                  oblasti: detectOblastiFromText(nazev + " " + popis + " podnikání inovace"),
                  deadline: dateMatch ? this.parseDate(dateMatch[dateMatch.length - 1]) : undefined,
                  popis: this.cleanText(popis || `API Agentura: ${nazev}`),
                  status: this.detectStatus(parentText),
                });
              }
            }
          });
        } catch {
          console.log(`API Agentura: URL ${url} nedostupná`);
        }
      }
    } catch (error) {
      console.error("API Agentura scraper error:", error);
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
