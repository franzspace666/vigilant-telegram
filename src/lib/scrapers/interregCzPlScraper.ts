import { BaseScraper, type ScrapedVyzva } from "./baseScraper";
import { fetchPage, detectOblastiFromText } from "./utils";
import * as cheerio from "cheerio";

/**
 * Interreg CZ-PL scraper
 * 
 * Přeshraniční spolupráce ČR-Polsko
 * URL: https://www.cz-pl.eu/vyzvy
 */
export class InterregCzPlScraper extends BaseScraper {
  source = "INTERREG_CZ_PL";
  baseUrl = "https://www.cz-pl.eu";

  async scrape(): Promise<ScrapedVyzva[]> {
    const vyzvy: ScrapedVyzva[] = [];

    try {
      const url = "https://www.cz-pl.eu/vyzvy";
      const html = await fetchPage(url);
      const $ = cheerio.load(html);

      // Hledej výzvy
      $("article, .vyzva, .call, table tr, .card, .list-item").each((_, element) => {
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
        
        // Alokace
        const alokaceMatch = parentText.match(/([\d\s,]+)\s*(mil\.?|mld\.?)\s*(EUR|€)?/i);
        let alokace: number | undefined = undefined;
        if (alokaceMatch) {
          const cislo = parseFloat(alokaceMatch[1].replace(/\s/g, '').replace(',', '.'));
          // EUR na CZK (přibližně)
          const kurz = 25;
          if (alokaceMatch[2].includes('mld')) {
            alokace = cislo * 1000000000 * kurz;
          } else {
            alokace = cislo * 1000000 * kurz;
          }
        }

        // Filtrování
        const isRelevant = nazev.length > 5 && 
          (nazev.toLowerCase().includes("výzv") ||
           nazev.toLowerCase().includes("call") ||
           nazev.match(/^\d+\.\s*výzva/i));

        if (nazev && isRelevant) {
          const fullUrl = link ? (link.startsWith("http") ? link : this.resolveUrl(link)) : url;
          
          const existuje = vyzvy.some(v => v.nazev === this.cleanText(nazev) || v.zdrojUrl === fullUrl);
          if (!existuje) {
            vyzvy.push({
              nazev: this.cleanText(nazev),
              zdroj: this.source,
              zdrojUrl: fullUrl,
              oblasti: detectOblastiFromText(nazev + " " + popis + " přeshraniční spolupráce Polsko"),
              deadline: dateMatch ? this.parseDate(dateMatch[dateMatch.length - 1]) : undefined,
              popis: this.cleanText(popis || `Interreg CZ-PL: ${nazev}`),
              status: this.detectStatus(parentText),
              alokace,
            });
          }
        }
      });
    } catch (error) {
      console.error("Interreg CZ-PL scraper error:", error);
    }

    return vyzvy;
  }

  private detectStatus(text: string): "otevrena" | "uzavrena" | "pripravovana" {
    const lower = text.toLowerCase();
    if (lower.includes("ukončen") || lower.includes("uzavřen") || lower.includes("closed")) {
      return "uzavrena";
    }
    if (lower.includes("plánov") || lower.includes("připrav") || lower.includes("planned")) {
      return "pripravovana";
    }
    return "otevrena";
  }
}
