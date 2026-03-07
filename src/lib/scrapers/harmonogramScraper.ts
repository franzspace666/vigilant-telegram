import { BaseScraper, type ScrapedVyzva } from "./baseScraper";
import { fetchPage, detectOblastiFromText } from "./utils";
import * as cheerio from "cheerio";

/**
 * Harmonogram dotací 2021-2027 scraper
 * 
 * Přehledový harmonogram všech operačních programů
 * URL: https://dotace2021-2027.cz/harmonogram/
 */
export class HarmonogramScraper extends BaseScraper {
  source = "HARMONOGRAM_2021_2027";
  baseUrl = "https://dotace2021-2027.cz";

  async scrape(): Promise<ScrapedVyzva[]> {
    const vyzvy: ScrapedVyzva[] = [];

    try {
      const url = "https://dotace2021-2027.cz/harmonogram/";
      const html = await fetchPage(url);
      const $ = cheerio.load(html);

      // Hledej výzvy v harmonogramu (tabulka nebo seznam)
      $("table tr, .vyzva, .harmonogram-item, article, .card").each((_, element) => {
        const $el = $(element);
        
        if ($el.find("th").length > 0) return;
        
        const $link = $el.find("a").first();
        const link = $link.attr("href");
        
        // Získej data z buněk tabulky
        const cells = $el.find("td");
        let nazev = "";
        let program = "";
        
        if (cells.length >= 2) {
          program = cells.eq(0).text().trim();
          nazev = cells.eq(1).text().trim();
        } else {
          nazev = $el.find("h2, h3, h4, .title").first().text().trim() || $link.text().trim();
        }
        
        if (!nazev && cells.length > 0) {
          nazev = cells.first().text().trim();
        }
        
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

        // Detekce operačního programu
        const detectOP = (text: string): string => {
          const lower = text.toLowerCase();
          if (lower.includes("opžp") || lower.includes("životní prostředí")) return "OPZP";
          if (lower.includes("optak") || lower.includes("technologie")) return "OPTAK";
          if (lower.includes("irop") || lower.includes("regionální")) return "IROP";
          if (lower.includes("opz") || lower.includes("zaměstnanost")) return "OPZ";
          if (lower.includes("op st") || lower.includes("spravedlivá transformace")) return "OPST";
          if (lower.includes("prv") || lower.includes("rozvoj venkova")) return "PRV";
          return "";
        };

        // Filtrování
        const isRelevant = nazev.length > 10;
        const isExcluded = 
          nazev.toLowerCase().includes("legenda") ||
          nazev.toLowerCase().includes("poznámka");

        if (nazev && isRelevant && !isExcluded) {
          const fullUrl = link ? (link.startsWith("http") ? link : this.resolveUrl(link)) : url;
          const op = detectOP(program + " " + nazev);
          
          const existuje = vyzvy.some(v => v.nazev === this.cleanText(nazev));
          if (!existuje) {
            vyzvy.push({
              nazev: this.cleanText(op ? `[${op}] ${nazev}` : nazev),
              zdroj: this.source,
              zdrojUrl: fullUrl,
              oblasti: detectOblastiFromText(nazev + " " + program),
              deadline: dateMatch ? this.parseDate(dateMatch[dateMatch.length - 1]) : undefined,
              popis: this.cleanText(`Harmonogram 2021-2027: ${program ? program + " - " : ""}${nazev}`),
              status: this.detectStatus(parentText),
              alokace,
            });
          }
        }
      });
    } catch (error) {
      console.error("Harmonogram scraper error:", error);
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
