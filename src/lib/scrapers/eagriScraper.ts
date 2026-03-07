import { BaseScraper, type ScrapedVyzva } from "./baseScraper";
import { fetchPage, detectOblastiFromText } from "./utils";
import * as cheerio from "cheerio";

/**
 * EAGRI / MZe scraper
 * 
 * Portál eAGRI přesměrovává na mze.gov.cz
 * Většina dotací PRV je nyní na SZIF, takže tento scraper slouží jako doplněk
 */
export class EagriScraper extends BaseScraper {
  source = "MZE";
  baseUrl = "https://mze.gov.cz";

  async scrape(): Promise<ScrapedVyzva[]> {
    const vyzvy: ScrapedVyzva[] = [];

    try {
      // Stránka s dotacemi MZE - opravené URL (bez /public/web/)
      const urls = [
        "https://mze.gov.cz/public/portal/mze/dotace",
        "https://mze.gov.cz/public/portal/mze/dotace/szp-pro-obdobi-2021-2027",
      ];

      for (const url of urls) {
        try {
          const html = await fetchPage(url);
          const $ = cheerio.load(html);

          // Hledej pouze specifické odkazy na dotační programy nebo výzvy
          $("a").each((_, element) => {
            const $el = $(element);
            const link = $el.attr("href");
            const nazev = $el.text().trim();
            
            // Striktní filtr - pouze položky obsahující klíčová slova pro výzvy
            const isVyzva = nazev.length > 15 && 
              (nazev.toLowerCase().includes("výzv") ||
               nazev.toLowerCase().includes("příjem žádostí") ||
               nazev.toLowerCase().includes("harmonogram") ||
               nazev.toLowerCase().includes("dotač") ||
               (nazev.toLowerCase().includes("kolo") && nazev.toLowerCase().includes("dotac")));
            
            // Vylučující slova
            const isExcluded = 
              nazev.toLowerCase().includes("archiv") ||
              nazev.toLowerCase().includes("historie") ||
              nazev.toLowerCase().includes("kontakt") ||
              nazev.toLowerCase().includes("mapa stránek") ||
              nazev.toLowerCase().includes("cookies") ||
              nazev.toLowerCase().includes("prohlášení") ||
              nazev.toLowerCase().includes("english") ||
              nazev.toLowerCase().includes("newsletter") ||
              nazev.toLowerCase().includes("přihlásit");

            if (isVyzva && !isExcluded && link) {
              let fullUrl = link;
              if (!link.startsWith("http")) {
                fullUrl = `https://mze.gov.cz${link.startsWith('/') ? '' : '/'}${link}`;
              }
              
              // Zkontroluj duplicity
              const existuje = vyzvy.some(v => 
                v.nazev === this.cleanText(nazev) || 
                v.zdrojUrl === fullUrl
              );
              
              if (!existuje) {
                vyzvy.push({
                  nazev: this.cleanText(nazev),
                  zdroj: this.source,
                  zdrojUrl: fullUrl,
                  oblasti: detectOblastiFromText(nazev),
                  deadline: undefined,
                  popis: `Dotační program MZe: ${nazev}`,
                  status: "otevrena",
                });
              }
            }
          });

          // Také hledej v navigačním menu a sekcích
          $(".menu a, nav a, .ea-portal-nav a").each((_, element) => {
            const $el = $(element);
            const link = $el.attr("href");
            const nazev = $el.text().trim();
            
            // Hledáme odkazy na dotační sekce
            const isDotace = link && (
              link.includes("/dotace") ||
              link.includes("/szp") ||
              link.includes("/prv")
            ) && nazev.length > 5;
            
            if (isDotace) {
              let fullUrl = link;
              if (!link.startsWith("http")) {
                fullUrl = `https://mze.gov.cz${link.startsWith('/') ? '' : '/'}${link}`;
              }
              
              const existuje = vyzvy.some(v => v.zdrojUrl === fullUrl);
              if (!existuje && !nazev.toLowerCase().includes("přihlásit")) {
                vyzvy.push({
                  nazev: this.cleanText(nazev),
                  zdroj: this.source,
                  zdrojUrl: fullUrl,
                  oblasti: detectOblastiFromText(nazev),
                  deadline: undefined,
                  popis: `Dotační sekce MZe: ${nazev}`,
                  status: "otevrena",
                });
              }
            }
          });
        } catch {
          console.log(`MZe: URL ${url} nedostupná`);
        }
      }
    } catch (error) {
      console.error("MZe/eAGRI scraper error:", error);
    }

    return vyzvy;
  }
}
