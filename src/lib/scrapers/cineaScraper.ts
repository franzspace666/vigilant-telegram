import { BaseScraper, type ScrapedVyzva } from "./baseScraper";
import { fetchPage, detectOblastiFromText } from "./utils";
import * as cheerio from "cheerio";

/**
 * CINEA (European Climate, Infrastructure and Environment Executive Agency) scraper
 * EU programy: LIFE, CEF, Horizon Europe, Creative Europe
 * URL: https://cinea.ec.europa.eu/funding-opportunities/calls-proposals_en
 */
export class CineaScraper extends BaseScraper {
  source = "CINEA";
  baseUrl = "https://cinea.ec.europa.eu";

  async scrape(): Promise<ScrapedVyzva[]> {
    const vyzvy: ScrapedVyzva[] = [];

    const urls = [
      "https://cinea.ec.europa.eu/funding-opportunities/calls-proposals_en",
      "https://cinea.ec.europa.eu/programmes/life_en",
    ];

    for (const url of urls) {
      try {
        const html = await fetchPage(url);
        const $ = cheerio.load(html);

        $(
          "article, .call-item, .views-row, li.ecl-list__item, .ecl-card, .field-item"
        ).each((_, el) => {
          const $el = $(el);
          const $link = $el.find("a").first();
          const link = $link.attr("href");
          let nazev = $el
            .find("h2, h3, h4, .ecl-card__title, .call-title, .views-field-title")
            .first()
            .text()
            .trim();
          if (!nazev) nazev = $link.text().trim();

          const popis = $el
            .find("p, .ecl-card__description, .call-description, .views-field-body")
            .first()
            .text()
            .trim();
          const parentText = $el.text();

          const dateMatch = parentText.match(
            /(\d{4}-\d{2}-\d{2}|\d{1,2}\s+\w+\s+\d{4}|\d{1,2}\.\d{1,2}\.\d{4})/
          );

          const isRelevant =
            nazev.length > 10 &&
            !nazev.toLowerCase().includes("menu") &&
            !nazev.toLowerCase().includes("contact") &&
            !nazev.toLowerCase().includes("cookie");

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
                  nazev + " " + popis + " životní prostředí energetika ekologie"
                ),
                deadline: dateMatch ? this.parseDate(dateMatch[0]) : undefined,
                popis: popis ? this.cleanText(popis) : undefined,
                status: this.detectStatus(parentText),
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
    if (lower.includes("closed") || lower.includes("deadline passed")) return "uzavrena";
    if (lower.includes("forthcoming") || lower.includes("upcoming")) return "pripravovana";
    return "otevrena";
  }
}
