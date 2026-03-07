import { BaseScraper, type ScrapedVyzva } from "./baseScraper";
import { fetchPage, detectOblastiFromText } from "./utils";
import * as cheerio from "cheerio";

/**
 * NPŽP (Národní program životního prostředí) scraper
 * Dotace na životní prostředí – zateplení, energie, odpady, voda
 * URL: https://www.narodniprogramzp.cz/nabidka-dotaci/
 */
export class NpzpScraper extends BaseScraper {
  source = "NPZP";
  baseUrl = "https://www.narodniprogramzp.cz";

  async scrape(): Promise<ScrapedVyzva[]> {
    const vyzvy: ScrapedVyzva[] = [];

    const urls = [
      "https://www.narodniprogramzp.cz/nabidka-dotaci/",
      "https://www.narodniprogramzp.cz/",
    ];

    for (const url of urls) {
      try {
        const html = await fetchPage(url);
        const $ = cheerio.load(html);

        $("article, .card, .dotace-item, .vyzva, table tr, li.dotace, .program-item").each((_, el) => {
          const $el = $(el);
          if ($el.find("th").length > 0) return;

          const $link = $el.find("a").first();
          const link = $link.attr("href");
          let nazev = $el.find("h2, h3, h4, .title, .nazev").first().text().trim();
          if (!nazev) nazev = $link.text().trim();

          const popis = $el.find("p, .popis, .excerpt").first().text().trim();
          const parentText = $el.text();

          const dateMatch = parentText.match(/(\d{1,2}\.\s*\d{1,2}\.\s*\d{4})/g);
          const alokaceMatch = parentText.match(/([\d\s,]+)\s*(mil\.?|mld\.?)\s*Kč/i);
          let alokace: number | undefined;
          if (alokaceMatch) {
            const num = parseFloat(alokaceMatch[1].replace(/\s/g, "").replace(",", "."));
            alokace = alokaceMatch[2].toLowerCase().includes("mld") ? num * 1e9 : num * 1e6;
          }

          const isRelevant =
            nazev.length > 10 &&
            !nazev.toLowerCase().includes("menu") &&
            !nazev.toLowerCase().includes("kontakt") &&
            !nazev.toLowerCase().includes("aktualit");

          if (nazev && isRelevant) {
            const fullUrl = link
              ? link.startsWith("http") ? link : this.resolveUrl(link)
              : url;
            if (!vyzvy.some((v) => v.nazev === this.cleanText(nazev))) {
              vyzvy.push({
                nazev: this.cleanText(nazev),
                zdroj: this.source,
                zdrojUrl: fullUrl,
                oblasti: detectOblastiFromText(
                  nazev + " " + popis + " životní prostředí energie zateplení odpad voda"
                ),
                deadline: dateMatch ? this.parseDate(dateMatch[dateMatch.length - 1]) : undefined,
                popis: popis ? this.cleanText(popis) : undefined,
                status: this.detectStatus(parentText),
                alokace,
              });
            }
          }
        });

        if (vyzvy.length > 0) break;
      } catch {
        // URL nedostupná
      }
    }

    return vyzvy;
  }

  private detectStatus(text: string): string {
    const lower = text.toLowerCase();
    if (lower.includes("ukončen") || lower.includes("uzavřen")) return "uzavrena";
    if (lower.includes("plánov") || lower.includes("připrav")) return "pripravovana";
    return "otevrena";
  }
}
