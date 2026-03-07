import { BaseScraper, type ScrapedVyzva } from "./baseScraper";
import { fetchPage, detectOblastiFromText } from "./utils";
import * as cheerio from "cheerio";

/**
 * SFZP (Státní fond životního prostředí) scraper
 * 
 * Hlavní zdroje:
 * - Modernizační fond: https://www.sfzp.cz/dotace-a-pujcky/modernizacni-fond/vyzvy/
 * - NPŽP: https://www.narodniprogramzp.cz/nabidka-dotaci/
 */
export class SfzpScraper extends BaseScraper {
  source = "SFZP";
  baseUrl = "https://www.sfzp.cz";

  async scrape(): Promise<ScrapedVyzva[]> {
    const vyzvy: ScrapedVyzva[] = [];

    try {
      // SFZP programy - správné URL
      const urls = [
        "https://www.sfzp.cz/dotace-a-pujcky/modernizacni-fond/vyzvy/",
        "https://www.narodniprogramzp.cz/nabidka-dotaci/",
        "https://www.sfzp.cz/dotace-a-pujcky/",
      ];

      for (const url of urls) {
        try {
          const html = await fetchPage(url);
          const $ = cheerio.load(html);

          // Hledej výzvy - různé selektory pro různé weby
          $("article, .vyzva, .call-item, .card, a[href*='detail-vyzvy'], a[href*='dotace']").each(
            (_, element) => {
              const $el = $(element);
              
              // Získej odkaz a název
              const $link = $el.is("a") ? $el : $el.find("a").first();
              const link = $link.attr("href");
              
              // Najdi název výzvy
              let nazev = $el.find("h2, h3, h4, .title, strong").first().text().trim();
              if (!nazev) {
                nazev = $link.text().trim();
              }
              
              // Vyčisti název od HTML entit
              nazev = nazev.replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();

              // Získej popis
              const popis = $el.find(".description, .perex, p").first().text().trim();
              const parentText = $el.text();

              // Hledej datumy
              const dateMatch = parentText.match(/(\d{1,2}\.\s*\d{1,2}\.\s*\d{4})/g);
              
              // Hledej alokaci
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

              // Filtruj pouze relevantní položky
              const isRelevant = nazev.length > 10 && 
                (nazev.toLowerCase().includes("výzv") ||
                 nazev.toLowerCase().includes("dotac") ||
                 nazev.toLowerCase().includes("program") ||
                 nazev.toLowerCase().includes("podpora") ||
                 nazev.toLowerCase().includes("nová zelená") ||
                 nazev.toLowerCase().includes("res+") ||
                 nazev.toLowerCase().includes("smartnet") ||
                 nazev.toLowerCase().includes("komunerg") ||
                 nazev.toLowerCase().includes("heat") ||
                 nazev.toLowerCase().includes("trans"));

              // Vylučující slova
              const isExcluded = 
                nazev.toLowerCase().includes("přihlás") ||
                nazev.toLowerCase().includes("kontakt") ||
                nazev.toLowerCase().includes("o nás") ||
                nazev.toLowerCase().includes("aktualit") ||
                nazev.toLowerCase().includes("archiv") ||
                nazev.toLowerCase().includes("cookies");

              if (nazev && isRelevant && !isExcluded && link) {
                let fullUrl = link;
                if (!link.startsWith("http")) {
                  // Určení správné base URL podle zdroje
                  if (url.includes("narodniprogramzp")) {
                    fullUrl = `https://www.narodniprogramzp.cz${link.startsWith('/') ? '' : '/'}${link}`;
                  } else {
                    fullUrl = this.resolveUrl(link);
                  }
                }
                
                // Zkontroluj duplicity
                const existuje = vyzvy.some(v => v.zdrojUrl === fullUrl || v.nazev === this.cleanText(nazev));
                if (!existuje) {
                  vyzvy.push({
                    nazev: this.cleanText(nazev),
                    zdroj: this.source,
                    zdrojUrl: fullUrl,
                    oblasti: detectOblastiFromText(nazev + " " + popis + " životní prostředí energie"),
                    deadline: dateMatch ? this.parseDate(dateMatch[dateMatch.length - 1]) : undefined,
                    popis: this.cleanText(popis || `Program SFŽP: ${nazev}`),
                    status: this.detectStatus(parentText),
                    alokace,
                  });
                }
              }
            }
          );

          // Alternativní selektor pro seznamy výzev
          $("ul li a, .list-item a").each((_, element) => {
            const $el = $(element);
            const link = $el.attr("href");
            const nazev = $el.text().trim();
            
            const isVyzva = nazev.length > 10 && 
              (link?.includes("vyzv") || 
               link?.includes("dotace") ||
               nazev.toLowerCase().includes("výzva"));
            
            if (isVyzva && link) {
              let fullUrl = link;
              if (!link.startsWith("http")) {
                if (url.includes("narodniprogramzp")) {
                  fullUrl = `https://www.narodniprogramzp.cz${link.startsWith('/') ? '' : '/'}${link}`;
                } else {
                  fullUrl = this.resolveUrl(link);
                }
              }
              
              const existuje = vyzvy.some(v => v.zdrojUrl === fullUrl);
              if (!existuje) {
                vyzvy.push({
                  nazev: this.cleanText(nazev),
                  zdroj: this.source,
                  zdrojUrl: fullUrl,
                  oblasti: detectOblastiFromText(nazev + " životní prostředí"),
                  popis: `Výzva SFŽP: ${nazev}`,
                  status: "otevrena",
                });
              }
            }
          });
        } catch {
          console.log(`SFZP: URL ${url} nedostupná`);
          // Pokračuj s dalšími URL
        }
      }
    } catch (error) {
      console.error("SFZP scraper error:", error);
    }

    return vyzvy;
  }

  private detectStatus(text: string): "otevrena" | "uzavrena" | "pripravovana" {
    const lower = text.toLowerCase();
    if (lower.includes("ukončen") || lower.includes("uzavřen") || lower.includes("vyčerpán")) {
      return "uzavrena";
    }
    if (lower.includes("plánov") || lower.includes("připrav") || lower.includes("avízo")) {
      return "pripravovana";
    }
    return "otevrena";
  }
}
