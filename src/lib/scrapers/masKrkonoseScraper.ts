import { BaseScraper, type ScrapedVyzva } from "./baseScraper";
import { fetchPage, detectOblastiFromText } from "./utils";
import * as cheerio from "cheerio";

/**
 * MAS Krkonoše scraper
 * 
 * MAS (Místní akční skupina) Krkonoše
 * Výzvy MAS jsou typicky publikovány přes SZIF LEADER program
 * Struktura webu: /operacni-programy, /irop, /prv, /opz-plus, /maly-leader
 */
export class MasKrkonoseScraper extends BaseScraper {
  source = "MAS_KRKONOSE";
  baseUrl = "https://www.maskrkonose.cz";

  async scrape(): Promise<ScrapedVyzva[]> {
    const vyzvy: ScrapedVyzva[] = [];

    try {
      // Opravené URL dle struktury webu
      const urls = [
        `${this.baseUrl}/`,
        `${this.baseUrl}/operacni-programy`,
        `${this.baseUrl}/rozvijejte-s-nami`,
        `${this.baseUrl}/irop`,
        `${this.baseUrl}/prv/vyzva`,
        `${this.baseUrl}/opz-plus`,
        `${this.baseUrl}/maly-leader`,
        `${this.baseUrl}/op-tak/harmonogram-vyzev`,
      ];

      for (const url of urls) {
        try {
          const html = await fetchPage(url);
          const $ = cheerio.load(html);

          // Hledej výzvy nebo dotační příležitosti v menu a obsahu
          $("a[href*='vyzva'], a[href*='vyzev'], .menu a, nav a, article, .post").each((_, element) => {
            const $el = $(element);
            
            const $link = $el.is("a") ? $el : $el.find("a").first();
            const link = $link.attr("href");
            let nazev = $el.find("h2, h3, h4, .entry-title, .title").first().text().trim();
            if (!nazev) {
              nazev = $link.text().trim();
            }
            
            const popis = $el.find(".excerpt, .entry-content p, .perex").first().text().trim();

            // Filtruj pouze relevantní položky
            const isRelevant = nazev.length > 3 && 
              (nazev.toLowerCase().includes("výzv") ||
               nazev.toLowerCase().includes("kolo") ||
               nazev.toLowerCase().includes("příjem žádostí") ||
               (nazev.match(/^\d+\.\s*výzva/i) !== null));

            // Vylučující slova
            const isExcluded = 
              nazev.toLowerCase().includes("archiv") ||
              nazev.toLowerCase().includes("faq") ||
              nazev.toLowerCase().includes("školení") ||
              nazev.toLowerCase().includes("kontakt");

            if (nazev && isRelevant && !isExcluded) {
              const fullUrl = link ? (link.startsWith("http") ? link : this.resolveUrl(link)) : url;
              
              // Zkontroluj duplicity
              const existuje = vyzvy.some(v => v.nazev === this.cleanText(nazev) || v.zdrojUrl === fullUrl);
              if (!existuje) {
                vyzvy.push({
                  nazev: this.cleanText(nazev),
                  zdroj: this.source,
                  zdrojUrl: fullUrl,
                  oblasti: detectOblastiFromText(nazev + " " + popis + " Krkonoše venkov"),
                  popis: this.cleanText(popis || `MAS Krkonoše: ${nazev}`),
                  status: "otevrena",
                });
              }
            }
          });

          // Také hledej sekce s operačními programy
          $("a[href*='irop'], a[href*='prv'], a[href*='opz'], a[href*='op-tak'], a[href*='leader']").each((_, element) => {
            const $el = $(element);
            const link = $el.attr("href");
            const nazev = $el.text().trim();

            // Filtruj na relevantní sekce
            const isSection = nazev.length > 2 && 
              (nazev.toUpperCase().includes("IROP") ||
               nazev.toUpperCase().includes("PRV") ||
               nazev.toUpperCase().includes("OPZ") ||
               nazev.toUpperCase().includes("OP TAK") ||
               nazev.toUpperCase().includes("LEADER"));

            if (isSection && link) {
              const fullUrl = link.startsWith("http") ? link : this.resolveUrl(link);
              const existuje = vyzvy.some(v => v.zdrojUrl === fullUrl);
              if (!existuje) {
                vyzvy.push({
                  nazev: `${nazev} - MAS Krkonoše`,
                  zdroj: this.source,
                  zdrojUrl: fullUrl,
                  oblasti: detectOblastiFromText(nazev + " venkov Krkonoše"),
                  popis: `Operační program ${nazev} - MAS Krkonoše`,
                  status: "otevrena",
                });
              }
            }
          });
        } catch {
          // URL neexistuje nebo je nedostupná, pokračuj
          console.log(`MAS Krkonose: URL ${url} nedostupná`);
        }
      }
    } catch (error) {
      console.error("MAS Krkonose scraper error:", error);
    }

    return vyzvy;
  }
}
