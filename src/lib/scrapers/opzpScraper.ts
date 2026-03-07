import { BaseScraper, type ScrapedVyzva } from "./baseScraper";
import { fetchPage, detectOblastiFromText } from "./utils";
import * as cheerio from "cheerio";

/**
 * OPZP (Operační program Životní prostředí) scraper
 * 
 * Hlavní stránka: https://opzp.cz/nabidka-dotaci/
 * Jednotlivé výzvy: https://opzp.cz/dotace/XX-vyzva/
 */
export class OpzpScraper extends BaseScraper {
  source = "OPZP";
  baseUrl = "https://opzp.cz";

  async scrape(): Promise<ScrapedVyzva[]> {
    const vyzvy: ScrapedVyzva[] = [];

    try {
      // Hlavní stránka nabídky dotací
      const urls = [
        "https://opzp.cz/nabidka-dotaci/",
        "https://opzp.cz/",
      ];

      for (const url of urls) {
        try {
          const html = await fetchPage(url);
          const $ = cheerio.load(html);

          // Výzvy jsou v odkazech s třídou nebo struktura odkazů na /dotace/XX-vyzva/
          $('a[href*="/dotace/"]').each((_, element) => {
            const $el = $(element);
            const link = $el.attr("href");
            
            // Přeskoč odkazy které nejsou na konkrétní výzvy
            if (!link || !link.match(/\/dotace\/\d+-vyzva/)) return;
            
            // Hledej název výzvy
            let nazev = $el.find("h2, h3, .title, strong").first().text().trim();
            if (!nazev) {
              nazev = $el.text().trim().split('\n')[0].trim();
            }
            
            // Vyčisti název
            nazev = nazev.replace(/\s+/g, ' ').trim();
            
            // Získej celý blok výzvy pro více informací
            const $parent = $el.closest("div, article, section, li");
            const parentText = $parent.length ? $parent.text() : $el.text();
            
            // Získej popis
            const popis = $el.find("p, .description").first().text().trim() ||
                         $parent.find("p").first().text().trim();
            
            // Extrahuj deadline - hledej "Podání žádosti" nebo datum ve formátu DD. M. YYYY
            const deadlineMatch = parentText.match(/(\d{1,2}\.\s*\d{1,2}\.\s*\d{4})\s*[–-]\s*(\d{1,2}\.\s*\d{1,2}\.\s*\d{4})/);
            const singleDateMatch = parentText.match(/(\d{1,2}\.\s*\d{1,2}\.\s*\d{4})/g);
            const deadline = deadlineMatch 
              ? deadlineMatch[2].replace(/\s/g, '') 
              : (singleDateMatch ? singleDateMatch[singleDateMatch.length - 1] : null);
            
            // Extrahuj alokaci
            const alokaceMatch = parentText.match(/([\d\s]+)\s*(000\s*000|mil\.?|mld\.?)\s*(Kč)?/i);
            let alokace: number | undefined = undefined;
            if (alokaceMatch) {
              const cislo = parseInt(alokaceMatch[1].replace(/\s/g, ''));
              if (alokaceMatch[2].includes('mld')) {
                alokace = cislo * 1000000000;
              } else {
                alokace = cislo * 1000000;
              }
            }
            
            // Zjisti stav výzvy
            let status: "otevrena" | "uzavrena" | "pripravovana" = "otevrena";
            const lower = parentText.toLowerCase();
            if (lower.includes("ukončen") || lower.includes("uzavřen")) {
              status = "uzavrena";
            } else if (lower.includes("plánov") || lower.includes("připrav")) {
              status = "pripravovana";
            }

            if (nazev && link && nazev.length > 10) {
              const fullUrl = this.resolveUrl(link);
              
              // Zkontroluj duplicity
              const existuje = vyzvy.some(v => v.zdrojUrl === fullUrl);
              if (!existuje) {
                vyzvy.push({
                  nazev: this.cleanText(nazev),
                  zdroj: this.source,
                  zdrojUrl: fullUrl,
                  oblasti: detectOblastiFromText(nazev + " " + popis + " životní prostředí"),
                  deadline: deadline ? this.parseDate(deadline) : undefined,
                  popis: this.cleanText(popis || `Výzva OPŽP: ${nazev}`),
                  status: status,
                  alokace: alokace,
                });
              }
            }
          });

          // Také hledej v sekci "Aktuální nabídka dotací"
          $("article, .card, .vyzva-item, [class*='vyzva'], [class*='call']").each((_, element) => {
            const $el = $(element);
            const $link = $el.find("a[href*='/dotace/']").first();
            const link = $link.attr("href");
            
            if (!link || !link.match(/\/dotace\/\d+-vyzva/)) return;
            
            const nazev = $el.find("h2, h3, h4, .title").first().text().trim();
            const popis = $el.find("p, .description, .excerpt").first().text().trim();
            
            if (nazev && nazev.length > 10) {
              const fullUrl = link.startsWith("http") ? link : this.resolveUrl(link);
              const existuje = vyzvy.some(v => v.zdrojUrl === fullUrl);
              if (!existuje) {
                vyzvy.push({
                  nazev: this.cleanText(nazev),
                  zdroj: this.source,
                  zdrojUrl: fullUrl,
                  oblasti: detectOblastiFromText(nazev + " " + popis + " životní prostředí"),
                  popis: this.cleanText(popis || `Výzva OPŽP: ${nazev}`),
                  status: "otevrena",
                });
              }
            }
          });
        } catch {
          console.log(`OPZP: URL ${url} nedostupná`);
        }
      }
    } catch (error) {
      console.error("OPZP scraper error:", error);
    }

    return vyzvy;
  }
}
