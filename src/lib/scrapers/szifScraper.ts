import { BaseScraper, type ScrapedVyzva } from "./baseScraper";
import { fetchPage, detectOblastiFromText } from "./utils";
import * as cheerio from "cheerio";

export class SzifScraper extends BaseScraper {
  source = "SZIF";
  baseUrl = "https://szif.gov.cz";

  async scrape(): Promise<ScrapedVyzva[]> {
    const vyzvy: ScrapedVyzva[] = [];

    try {
      // Hlavní stránky SZIF dotací
      const urls = [
        "https://szif.gov.cz/cs/szp23-proj",
        "https://szif.gov.cz/cs/nd-dotacni-programy",
      ];

      for (const url of urls) {
        try {
          const html = await fetchPage(url);
          const $ = cheerio.load(html);

          // Scrape zpravodajství - seznam aktuálních zpráv o intervencích
          $("ul li, .news-item, article").each((_, element) => {
            const $el = $(element);

            // Hledáme odkazy na PDF dokumenty nebo detailní stránky intervencí
            const $link = $el.find("a[href*='/cs/CmDocument'], a[href*='szp23-'], a[href*='nd-']").first();
            if (!$link.length) return;

            const nazev = $link.text().trim();
            const link = $link.attr("href");

            // Získej datum z okolního textu
            const parentText = $el.text();
            const dateMatch = parentText.match(/(\d{1,2}\.\d{1,2}\.\d{4})/);

            // Filtruj pouze relevantní zprávy (schválené žádosti, výzvy, intervence)
            const isRelevant = nazev.toLowerCase().includes("schválen") ||
                              nazev.toLowerCase().includes("intervenc") ||
                              nazev.toLowerCase().includes("výzv") ||
                              nazev.toLowerCase().includes("žádost") ||
                              nazev.toLowerCase().includes("kol") ||
                              nazev.toLowerCase().includes("dotac");

            if (nazev && link && nazev.length > 20 && isRelevant) {
              const fullUrl = link.startsWith("http") ? link : this.resolveUrl(link);
              const existuje = vyzvy.some(v => v.zdrojUrl === fullUrl);
              if (!existuje) {
                vyzvy.push({
                  nazev: this.cleanText(nazev),
                  zdroj: this.source,
                  zdrojUrl: fullUrl,
                  oblasti: detectOblastiFromText(nazev),
                  deadline: dateMatch ? this.parseDate(dateMatch[1]) : undefined,
                  popis: this.cleanText(parentText.substring(0, 300)),
                  status: this.detectStatus(nazev),
                });
              }
            }
          });

          // Také scrape odkazy na jednotlivé intervence z navigace
          $('a[href*="szp23-"], a[href*="nd-"]').each((_, element) => {
            const $el = $(element);
            const nazev = $el.text().trim();
            const link = $el.attr("href");

            // Filtruj navigační odkazy na konkrétní intervence
            const isIntervence = link && (
              link.includes("investice") ||
              link.includes("zahajeni") ||
              link.includes("techno") ||
              link.includes("leader") ||
              link.includes("poradenstvi") ||
              link.includes("dotacni-programy")
            );

            if (nazev && link && isIntervence && nazev.length > 5) {
              const fullUrl = link.startsWith("http") ? link : this.resolveUrl(link);
              const existuje = vyzvy.some(v => v.nazev === this.cleanText(nazev) || v.zdrojUrl === fullUrl);
              if (!existuje) {
                vyzvy.push({
                  nazev: this.cleanText(nazev),
                  zdroj: this.source,
                  zdrojUrl: fullUrl,
                  oblasti: detectOblastiFromText(nazev),
                  popis: `Intervence SP SZP 2023-2027: ${nazev}`,
                  status: "otevrena",
                });
              }
            }
          });
        } catch {
          console.log(`SZIF: URL ${url} nedostupná`);
        }
      }
    } catch (error) {
      console.error("SZIF scraper error:", error);
    }

    return vyzvy;
  }

  private detectStatus(text: string): "otevrena" | "uzavrena" | "pripravovana" {
    const lower = text.toLowerCase();
    if (lower.includes("schválen") || lower.includes("doporučen")) {
      return "otevrena"; // Schválené = aktivní
    }
    if (lower.includes("ukončen") || lower.includes("uzavřen")) {
      return "uzavrena";
    }
    if (lower.includes("plánov") || lower.includes("připrav")) {
      return "pripravovana";
    }
    return "otevrena";
  }
}
