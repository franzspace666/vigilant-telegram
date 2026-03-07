import { BaseScraper, type ScrapedVyzva } from "./baseScraper";
import { fetchPage, detectOblastiFromText } from "./utils";
import * as cheerio from "cheerio";

/**
 * DotaceEU.cz scraper
 * 
 * Hlavní portál pro všechny EU dotace v ČR
 * URL: https://www.dotaceeu.cz/cs/jak-ziskat-dotaci/vyzvy
 */
export class DotaceEuScraper extends BaseScraper {
  source = "DOTACE_EU";
  baseUrl = "https://www.dotaceeu.cz";

  async scrape(): Promise<ScrapedVyzva[]> {
    const vyzvy: ScrapedVyzva[] = [];

    try {
      const url = "https://www.dotaceeu.cz/cs/jak-ziskat-dotaci/vyzvy";
      const html = await fetchPage(url);
      const $ = cheerio.load(html);

      // Hledej výzvy v tabulce nebo seznamu
      $("table tr, .vyzva-item, article, .call-item, .list-item").each((_, element) => {
        const $el = $(element);
        
        // Přeskočit hlavičku tabulky
        if ($el.find("th").length > 0) return;
        
        const $link = $el.find("a").first();
        const link = $link.attr("href");
        let nazev = $link.text().trim();
        
        if (!nazev) {
          nazev = $el.find("td").first().text().trim();
        }
        
        // Získej další informace z buněk tabulky
        // const cells = $el.find("td");
        const parentText = $el.text();
        
        // Hledej datum
        const dateMatch = parentText.match(/(\d{1,2}\.\s*\d{1,2}\.\s*\d{4})/g);
        
        // Hledej alokaci
        // const alokaceMatch = parentText.match(/([\d\s,]+)\s*(mil\.?|mld\.?|Kč|CZK|EUR)/i);
        
        if (nazev && nazev.length > 10) {
          const fullUrl = link ? (link.startsWith("http") ? link : this.resolveUrl(link)) : url;
          
          // Duplicity check
          const existuje = vyzvy.some(v => v.nazev === this.cleanText(nazev) || v.zdrojUrl === fullUrl);
          if (!existuje) {
            vyzvy.push({
              nazev: this.cleanText(nazev),
              zdroj: this.source,
              zdrojUrl: fullUrl,
              oblasti: detectOblastiFromText(nazev + " " + parentText),
              deadline: dateMatch ? this.parseDate(dateMatch[dateMatch.length - 1]) : undefined,
              popis: this.cleanText(parentText.substring(0, 500)),
              status: this.detectStatus(parentText),
            });
          }
        }
      });

      // Alternativní selektor pro karty výzev
      if (vyzvy.length === 0) {
        $("a[href*='vyzv'], a[href*='call'], .card, .tile").each((_, element) => {
          const $el = $(element);
          const $link = $el.is("a") ? $el : $el.find("a").first();
          const link = $link.attr("href");
          const nazev = $el.find("h2, h3, h4, .title").first().text().trim() || $link.text().trim();
          const popis = $el.find("p, .description").first().text().trim();
          
          if (nazev && nazev.length > 10 && link) {
            const fullUrl = link.startsWith("http") ? link : this.resolveUrl(link);
            const existuje = vyzvy.some(v => v.zdrojUrl === fullUrl);
            if (!existuje) {
              vyzvy.push({
                nazev: this.cleanText(nazev),
                zdroj: this.source,
                zdrojUrl: fullUrl,
                oblasti: detectOblastiFromText(nazev + " " + popis),
                popis: this.cleanText(popis || `Výzva DotaceEU: ${nazev}`),
                status: "otevrena",
              });
            }
          }
        });
      }
    } catch (error) {
      console.error("DotaceEU scraper error:", error);
    }

    return vyzvy;
  }

  private detectStatus(text: string): "otevrena" | "uzavrena" | "pripravovana" {
    const lower = text.toLowerCase();
    if (lower.includes("ukončen") || lower.includes("uzavřen")) {
      return "uzavrena";
    }
    if (lower.includes("plánov") || lower.includes("připrav") || lower.includes("avízo")) {
      return "pripravovana";
    }
    return "otevrena";
  }
}
