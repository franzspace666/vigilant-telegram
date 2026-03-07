import { BaseScraper, type ScrapedVyzva } from "./baseScraper";
import { fetchPage, detectOblastiFromText } from "./utils";
import * as cheerio from "cheerio";

/**
 * SZIF MAS výzvy scraper
 * 
 * Výzvy místních akčních skupin na SZIF
 * URL: https://szif.gov.cz/cs/szp23-vyzvy-mas
 */
export class SzifMasScraper extends BaseScraper {
  source = "SZIF_MAS";
  baseUrl = "https://szif.gov.cz";

  async scrape(): Promise<ScrapedVyzva[]> {
    const vyzvy: ScrapedVyzva[] = [];

    try {
      const urls = [
        "https://szif.gov.cz/cs/szp23-vyzvy-mas",
        "https://szif.gov.cz/cs/leader",
      ];

      for (const url of urls) {
        try {
          const html = await fetchPage(url);
          const $ = cheerio.load(html);

          // Hledej výzvy MAS
          $("table tr, article, .vyzva, .list-item, ul li").each((_, element) => {
            const $el = $(element);
            
            if ($el.find("th").length > 0) return;
            
            const $link = $el.find("a").first();
            const link = $link.attr("href");
            let nazev = $link.text().trim();
            
            if (!nazev) {
              nazev = $el.find("td:first-child, .title").first().text().trim();
            }
            
            const parentText = $el.text();
            
            // Hledej MAS název v textu
            // const masMatch = nazev.match(/MAS\s+[^,\-]+/i);
            
            // Datum
            const dateMatch = parentText.match(/(\d{1,2}\.\s*\d{1,2}\.\s*\d{4})/g);
            
            // Filtrování - pouze MAS výzvy
            const isMasVyzva = nazev.length > 5 && 
              (nazev.toLowerCase().includes("mas") ||
               nazev.toLowerCase().includes("výzva") ||
               nazev.toLowerCase().includes("leader") ||
               link?.includes("mas") ||
               link?.includes("leader"));

            if (isMasVyzva && nazev) {
              const fullUrl = link ? (link.startsWith("http") ? link : this.resolveUrl(link)) : url;
              
              const existuje = vyzvy.some(v => v.nazev === this.cleanText(nazev) || v.zdrojUrl === fullUrl);
              if (!existuje) {
                vyzvy.push({
                  nazev: this.cleanText(nazev),
                  zdroj: this.source,
                  zdrojUrl: fullUrl,
                  oblasti: detectOblastiFromText(nazev + " MAS venkov LEADER"),
                  deadline: dateMatch ? this.parseDate(dateMatch[dateMatch.length - 1]) : undefined,
                  popis: `MAS výzva SZIF: ${nazev}`,
                  status: this.detectStatus(parentText),
                });
              }
            }
          });
        } catch {
          console.log(`SZIF MAS: URL ${url} nedostupná`);
        }
      }
    } catch (error) {
      console.error("SZIF MAS scraper error:", error);
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
