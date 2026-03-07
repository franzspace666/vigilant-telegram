import { BaseScraper, type ScrapedVyzva } from "./baseScraper";
import { fetchPage, detectOblastiFromText } from "./utils";
import * as cheerio from "cheerio";

/**
 * EU Funding & Tenders Portal (FTOP) scraper
 * Otevřené výzvy EU pro Českou republiku (REST API)
 * URL: https://ec.europa.eu/info/funding-tenders/opportunities/portal/
 */
export class FtopScraper extends BaseScraper {
  source = "FTOP";
  baseUrl = "https://ec.europa.eu";

  async scrape(): Promise<ScrapedVyzva[]> {
    const vyzvy: ScrapedVyzva[] = [];

    // FTOP REST API – otevřené výzvy, seřazeno podle data
    const apiUrl =
      "https://api.tech.ec.europa.eu/search-api/prod/rest/search" +
      "?apiKey=SEDIA" +
      "&text=" +
      "&pageSize=20" +
      "&pageNumber=1" +
      "&query=%7B%22bool%22:%7B%22must%22:[%7B%22terms%22:%7B%22type%22:[%22topic%22]%7D%7D,%7B%22terms%22:%7B%22status%22:[%22open%22]%7D%7D]%7D%7D" +
      "&sort=startDate%2BDESC";

    try {
      const rawData = await fetchPage(apiUrl, {
        headers: {
          Accept: "application/json",
        },
      });

      const json = typeof rawData === "string" ? JSON.parse(rawData) : rawData;
      const results: unknown[] = Array.isArray(json?.results) ? json.results : [];

      for (const item of results) {
        const record = item as Record<string, unknown>;
        const metadata = (record.metadata ?? {}) as Record<string, unknown[]>;
        const nazev = ((metadata.title ?? [record.title ?? ""])[0] as string) ?? "";
        const popis = ((metadata.description ?? [])[0] as string) ?? "";
        const deadline = (metadata.deadlineDate ?? [])[0] as string | undefined;
        const startDate = (metadata.startDate ?? [])[0] as string | undefined;
        const programme = ((metadata.programmeName ?? [])[0] as string) ?? "";
        const topicId = (record.id as string) ?? "";
        const link = topicId
          ? `https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/opportunities/topic-details/${topicId}`
          : "https://ec.europa.eu/info/funding-tenders/opportunities/portal/";

        if (!nazev || nazev.length <= 10) continue;

        if (!vyzvy.some((v) => v.nazev === this.cleanText(nazev))) {
          vyzvy.push({
            nazev: this.cleanText(nazev),
            zdroj: this.source,
            zdrojUrl: link,
            oblasti: detectOblastiFromText(nazev + " " + popis + " " + programme),
            deadline: deadline ? this.parseDate(deadline) : undefined,
            datumVyhlaseni: startDate ? this.parseDate(startDate) : undefined,
            popis: popis ? this.cleanText(popis.substring(0, 500)) : undefined,
            status: "otevrena",
          });
        }
      }
    } catch {
      // API nedostupné – záloha přes HTML portál
      try {
        const html = await fetchPage(
          "https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/opportunities/topic-search"
        );
        const $ = cheerio.load(html);
        $("h3, h4, .eui-card__title, .topic-title").each((_, el) => {
          const $el = $(el);
          const nazev = $el.text().trim();
          if (nazev.length > 10 && !vyzvy.some((v) => v.nazev === this.cleanText(nazev))) {
            vyzvy.push({
              nazev: this.cleanText(nazev),
              zdroj: this.source,
              zdrojUrl: "https://ec.europa.eu/info/funding-tenders/opportunities/portal/",
              oblasti: detectOblastiFromText(nazev),
              status: "otevrena",
            });
          }
        });
      } catch {
        // ignoruj
      }
    }

    return vyzvy;
  }
}
