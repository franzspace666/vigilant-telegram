import { BaseScraper, type ScrapedVyzva } from "./baseScraper";
import { fetchPage, detectOblastiFromText } from "./utils";
import * as cheerio from "cheerio";

/**
 * Národní plán obnovy (NPO) scraper
 * 
 * Vyhlášené výzvy z plánu obnovy
 * URL: https://www.planobnovycr.cz/vyhlasene-vyzvy
 */
export class NpoScraper extends BaseScraper {
  source = "NPO";
  baseUrl = "https://www.planobnovycr.cz";

  async scrape(): Promise<ScrapedVyzva[]> {
    const vyzvy: ScrapedVyzva[] = [];

    try {
      const url = "https://www.planobnovycr.cz/vyhlasene-vyzvy";
      const html = await fetchPage(url);
      const $ = cheerio.load(html);

      // Hledej výzvy na stránce
      $("article, .vyzva, .call-item, .post, table tr, .card").each((_, element) => {
        const $el = $(element);
        
        // Přeskočit hlavičky
        if ($el.find("th").length > 0) return;
        
        const $link = $el.find("a").first();
        const link = $link.attr("href");
        let nazev = $el.find("h2, h3, h4, .title, td:first-child").first().text().trim();
        if (!nazev) {
          nazev = $link.text().trim();
        }
        
        const popis = $el.find("p, .excerpt, .description").first().text().trim();
        const parentText = $el.text();
        
        // Datum
        const dateMatch = parentText.match(/(\d{1,2}\.\s*\d{1,2}\.\s*\d{4})/g);
        
        // Alokace
        const alokaceMatch = parentText.match(/([\d\s,]+)\s*(mil\.?|mld\.?)\s*(Kč|CZK)?/i);
        let alokace: number | undefined = undefined;
        if (alokaceMatch) {
          const cislo = parseFloat(alokaceMatch[1].replace(/\s/g, '').replace(',', '.'));
          if (alokaceMatch[2].includes('mld')) {
            alokace = cislo * 1000000000;
          } else {
            alokace = cislo * 1000000;
          }
        }

        // Filtrování
        const isRelevant = nazev.length > 10 && 
          !nazev.toLowerCase().includes("menu") &&
          !nazev.toLowerCase().includes("navigace");

        if (nazev && isRelevant) {
          const fullUrl = link ? (link.startsWith("http") ? link : this.resolveUrl(link)) : url;
          
          const existuje = vyzvy.some(v => v.nazev === this.cleanText(nazev) || v.zdrojUrl === fullUrl);
          if (!existuje) {
            vyzvy.push({
              nazev: this.cleanText(nazev),
              zdroj: this.source,
              zdrojUrl: fullUrl,
              oblasti: detectOblastiFromText(nazev + " " + popis + " obnova"),
              deadline: dateMatch ? this.parseDate(dateMatch[dateMatch.length - 1]) : undefined,
              popis: this.cleanText(popis || `NPO výzva: ${nazev}`),
              status: this.detectStatus(parentText),
              alokace,
            });
          }
        }
      });
    } catch (error) {
      console.error("NPO scraper error:", error);
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
