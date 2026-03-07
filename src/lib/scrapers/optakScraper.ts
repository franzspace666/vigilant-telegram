import { BaseScraper, type ScrapedVyzva } from "./baseScraper";
import { fetchPage, detectOblastiFromText } from "./utils";
import * as cheerio from "cheerio";

/**
 * OP TAK (Operační program Technologie a aplikace pro konkurenceschopnost) scraper
 * 
 * Dotace pro malé a střední podniky, inovace, digitalizace
 * URL: https://www.agentura-api.org/cs/podporovane-aktivity-optak/
 */
export class OptakScraper extends BaseScraper {
  source = "OPTAK";
  baseUrl = "https://www.agentura-api.org";

  async scrape(): Promise<ScrapedVyzva[]> {
    const vyzvy: ScrapedVyzva[] = [];

    try {
      const urls = [
        "https://www.agentura-api.org/cs/podporovane-aktivity-optak/",
        "https://www.agentura-api.org/cs/",
        "https://www.agentura-api.org/cs/op-tak/",
      ];

      for (const url of urls) {
        try {
          const html = await fetchPage(url);
          const $ = cheerio.load(html);

          // Hledej výzvy
          $("article, .vyzva, .call, table tr, .card, a[href*='vyzv']").each((_, element) => {
            const $el = $(element);
            
            if ($el.find("th").length > 0) return;
            
            const $link = $el.is("a") ? $el : $el.find("a").first();
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
              (nazev.toLowerCase().includes("výzv") ||
               nazev.toLowerCase().includes("program") ||
               nazev.toLowerCase().includes("inovac") ||
               nazev.toLowerCase().includes("technolog") ||
               nazev.toLowerCase().includes("digitali") ||
               nazev.toLowerCase().includes("podnik"));
            
            const isExcluded = 
              nazev.toLowerCase().includes("menu") ||
              nazev.toLowerCase().includes("kontakt") ||
              nazev.toLowerCase().includes("přihlášení");

            if (nazev && isRelevant && !isExcluded) {
              const fullUrl = link ? (link.startsWith("http") ? link : this.resolveUrl(link)) : url;
              
              const existuje = vyzvy.some(v => v.nazev === this.cleanText(nazev) || v.zdrojUrl === fullUrl);
              if (!existuje) {
                vyzvy.push({
                  nazev: this.cleanText(nazev),
                  zdroj: this.source,
                  zdrojUrl: fullUrl,
                  oblasti: detectOblastiFromText(nazev + " " + popis + " inovace technologie podnikání"),
                  deadline: dateMatch ? this.parseDate(dateMatch[dateMatch.length - 1]) : undefined,
                  popis: this.cleanText(popis || `OP TAK výzva: ${nazev}`),
                  status: this.detectStatus(parentText),
                  alokace,
                });
              }
            }
          });
        } catch {
          console.log(`OP TAK: URL ${url} nedostupná`);
        }
      }
    } catch (error) {
      console.error("OP TAK scraper error:", error);
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
