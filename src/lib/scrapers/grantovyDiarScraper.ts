import { BaseScraper, type ScrapedVyzva } from "./baseScraper";
import { fetchPage, detectOblastiFromText } from "./utils";
import * as cheerio from "cheerio";

/**
 * Grantový diář scraper
 * 
 * Sekundární zdroj - agregátor dotací
 * URL: https://grantovydiar.cz/
 */
export class GrantovyDiarScraper extends BaseScraper {
  source = "GRANTOVY_DIAR";
  baseUrl = "https://grantovydiar.cz";

  async scrape(): Promise<ScrapedVyzva[]> {
    const vyzvy: ScrapedVyzva[] = [];

    try {
      const urls = [
        "https://grantovydiar.cz/",
        "https://grantovydiar.cz/vyzvy/",
        "https://grantovydiar.cz/aktualni-vyzvy/",
      ];

      for (const url of urls) {
        try {
          const html = await fetchPage(url);
          const $ = cheerio.load(html);

          // Hledej výzvy
          $("article, .vyzva, .grant, .call, .post, .card").each((_, element) => {
            const $el = $(element);
            
            const $link = $el.find("a").first();
            const link = $link.attr("href");
            let nazev = $el.find("h2, h3, h4, .title, .entry-title").first().text().trim();
            if (!nazev) {
              nazev = $link.text().trim();
            }
            
            const popis = $el.find("p, .excerpt, .entry-content").first().text().trim();
            const parentText = $el.text();
            
            // Datum
            const dateMatch = parentText.match(/(\d{1,2}\.\s*\d{1,2}\.\s*\d{4})/g);
            
            // Alokace
            const alokaceMatch = parentText.match(/([\d\s,]+)\s*(mil\.?|mld\.?)\s*(Kč|CZK|EUR|€)?/i);
            let alokace: number | undefined = undefined;
            if (alokaceMatch) {
              let cislo = parseFloat(alokaceMatch[1].replace(/\s/g, '').replace(',', '.'));
              // Pokud je EUR, převeď na CZK
              if (alokaceMatch[3] && (alokaceMatch[3].includes('EUR') || alokaceMatch[3].includes('€'))) {
                cislo *= 25;
              }
              if (alokaceMatch[2].includes('mld')) {
                alokace = cislo * 1000000000;
              } else {
                alokace = cislo * 1000000;
              }
            }

            // Filtrování
            const isRelevant = nazev.length > 15;
            const isExcluded = 
              nazev.toLowerCase().includes("přihlásit") ||
              nazev.toLowerCase().includes("kontakt") ||
              nazev.toLowerCase().includes("o nás") ||
              nazev.toLowerCase().includes("reklama");

            if (nazev && isRelevant && !isExcluded) {
              const fullUrl = link ? (link.startsWith("http") ? link : this.resolveUrl(link)) : url;
              
              const existuje = vyzvy.some(v => v.nazev === this.cleanText(nazev) || v.zdrojUrl === fullUrl);
              if (!existuje) {
                vyzvy.push({
                  nazev: this.cleanText(nazev),
                  zdroj: this.source,
                  zdrojUrl: fullUrl,
                  oblasti: detectOblastiFromText(nazev + " " + popis),
                  deadline: dateMatch ? this.parseDate(dateMatch[dateMatch.length - 1]) : undefined,
                  popis: this.cleanText(popis || `Grantový diář: ${nazev}`),
                  status: this.detectStatus(parentText),
                  alokace,
                });
              }
            }
          });
        } catch {
          console.log(`Grantový diář: URL ${url} nedostupná`);
        }
      }
    } catch (error) {
      console.error("Grantovy diar scraper error:", error);
    }

    return vyzvy;
  }

  private detectStatus(text: string): "otevrena" | "uzavrena" | "pripravovana" {
    const lower = text.toLowerCase();
    if (lower.includes("ukončen") || lower.includes("uzavřen")) {
      return "uzavrena";
    }
    if (lower.includes("plánov") || lower.includes("připrav") || lower.includes("brzy")) {
      return "pripravovana";
    }
    return "otevrena";
  }
}
