import { BaseScraper, type ScrapedVyzva } from "./baseScraper";
import { fetchPage, detectOblastiFromText } from "./utils";
import * as cheerio from "cheerio";

/**
 * AOPK (Agentura ochrany přírody a krajiny) scraper
 * 
 * AOPK administruje část OPŽP (ZMV - zjednodušené metody vykazování)
 * Poznámka: SSL certifikát na dotace.nature.cz má problém s www subdoménou
 */
export class AopkScraper extends BaseScraper {
  source = "AOPK";
  baseUrl = "https://www.ochranaprirody.cz";

  async scrape(): Promise<ScrapedVyzva[]> {
    const vyzvy: ScrapedVyzva[] = [];

    try {
      // Různé URL pro AOPK dotace - bez problematické domény
      const urls = [
        "https://www.ochranaprirody.cz/dotace/",
        "https://www.ochranaprirody.cz/",
      ];

      for (const url of urls) {
        try {
          const html = await fetchPage(url);
          const $ = cheerio.load(html);

          // Hledej výzvy na stránce
          $("a[href*='vyzva'], a[href*='vyzev'], a[href*='dotac'], .vyzva, article, .call-item, .dotace-item").each((_, element) => {
            const $el = $(element);
            
            const $link = $el.is("a") ? $el : $el.find("a").first();
            const link = $link.attr("href");
            let nazev = $el.find("h2, h3, h4, .title").first().text().trim();
            if (!nazev) {
              nazev = $link.text().trim();
            }
            
            const popis = $el.find(".description, .perex, p").first().text().trim();
            const parentText = $el.text();
            
            // Hledej datumy v textu
            const dateMatch = parentText.match(/(\d{1,2}\.\s*\d{1,2}\.\s*\d{4})/g);
            
            // Filtrování
            const isRelevant = nazev.length > 10 && 
              (nazev.toLowerCase().includes("výzv") ||
               nazev.toLowerCase().includes("dotac") ||
               nazev.toLowerCase().includes("podpora") ||
               nazev.toLowerCase().includes("opžp") ||
               nazev.toLowerCase().includes("krajin") ||
               nazev.toLowerCase().includes("příroda"));
            
            const isExcluded = 
              nazev.toLowerCase().includes("kontakt") ||
              nazev.toLowerCase().includes("o nás") ||
              nazev.toLowerCase().includes("mapa");
            
            if (nazev && isRelevant && !isExcluded) {
              let fullUrl = link || url;
              if (link && !link.startsWith("http")) {
                const baseUrl = new URL(url);
                fullUrl = new URL(link, baseUrl.origin).href;
              }
              
              // Zkontroluj duplicity
              const existuje = vyzvy.some(v => v.nazev === this.cleanText(nazev) || v.zdrojUrl === fullUrl);
              if (!existuje) {
                vyzvy.push({
                  nazev: this.cleanText(nazev),
                  zdroj: this.source,
                  zdrojUrl: fullUrl,
                  oblasti: detectOblastiFromText(nazev + " " + popis + " příroda krajina ochrana"),
                  deadline: dateMatch ? this.parseDate(dateMatch[dateMatch.length - 1]) : undefined,
                  popis: this.cleanText(popis || `Výzva AOPK: ${nazev}`),
                  status: this.detectStatus(parentText),
                });
              }
            }
          });

          // Pokud jsme našli něco, přestaň zkoušet další URL
          if (vyzvy.length > 0) break;
        } catch {
          console.log(`AOPK: URL ${url} nedostupná`);
          // Pokračuj s další URL
        }
      }
    } catch (error) {
      console.error("AOPK scraper error:", error);
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
