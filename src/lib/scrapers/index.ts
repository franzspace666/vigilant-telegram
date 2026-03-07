import { prisma } from "../db";
import { SzifScraper } from "./szifScraper";
import { SfzpScraper } from "./sfzpScraper";
import { EagriScraper } from "./eagriScraper";
import { OpzpScraper } from "./opzpScraper";
import { AopkScraper } from "./aopkScraper";
import { MasKrkonoseScraper } from "./masKrkonoseScraper";
import { DotaceEuScraper } from "./dotaceEuScraper";
import { NpoScraper } from "./npoScraper";
import { SzifMasScraper } from "./szifMasScraper";
import { OptakScraper } from "./optakScraper";
import { ApiAgenturaScraper } from "./apiAgenturaScraper";
import { MmrCestovniRuchScraper } from "./mmrCestovniRuchScraper";
import { CrrScraper } from "./crrScraper";
import { InterregCzPlScraper } from "./interregCzPlScraper";
import { HarmonogramScraper } from "./harmonogramScraper";
import { GrantovyDiarScraper } from "./grantovyDiarScraper";
import { NpzpScraper } from "./npzpScraper";
import { CineaScraper } from "./cineaScraper";
import { FtopScraper } from "./ftopScraper";
import { ApicScraper } from "./apicScraper";
import { CzechTourismScraper } from "./czechTourismScraper";
import { type BaseScraper } from "./baseScraper";
import { delay } from "./utils";

/**
 * Seznam aktivních scraperů - rozšířený seznam zdrojů
 * 
 * Hlavní zdroje dotací:
 * - SZIF (Státní zemědělský intervenční fond) - SP SZP 2023-2027, MAS výzvy
 * - OPZP (Operační program Životní prostředí) - environmentální projekty
 * - SFZP (Státní fond životního prostředí) - Modernizační fond, NPŽP
 * - MZE (Ministerstvo zemědělství) - harmonogramy a informace
 * - AOPK (Agentura ochrany přírody a krajiny) - OPŽP ZMV
 * - DotaceEU.cz - hlavní portál EU dotací
 * - NPO (Národní plán obnovy) - obnova po COVID
 * - OP TAK - podnikání, inovace, digitalizace
 * - API Agentura - podnikání a inovace
 * - MMR - cestovní ruch a regionální rozvoj
 * - CRR - národní dotace
 * - Interreg CZ-PL - přeshraniční spolupráce
 * - Harmonogram 2021-2027 - přehled všech OP
 * - Grantový diář - agregátor dotací
 * - MAS Krkonoše - místní akční skupina
 */
const scrapers: BaseScraper[] = [
  // Primární zdroje - státní instituce
  new SzifScraper(),
  new SzifMasScraper(),
  new OpzpScraper(),
  new SfzpScraper(),
  new EagriScraper(),
  new AopkScraper(),
  new DotaceEuScraper(),
  new NpoScraper(),
  new OptakScraper(),
  new ApiAgenturaScraper(),
  new MmrCestovniRuchScraper(),
  new CrrScraper(),
  new InterregCzPlScraper(),
  
  // Harmonogramy a agregátory
  new HarmonogramScraper(),
  new GrantovyDiarScraper(),
  
  // Národní programy životního prostředí
  new NpzpScraper(),

  // EU programy
  new CineaScraper(),
  new FtopScraper(),

  // Podnikání a inovace
  new ApicScraper(),

  // Cestovní ruch
  new CzechTourismScraper(),

  // MAS - Místní akční skupiny
  new MasKrkonoseScraper(),
];

export async function runAllScrapers() {
  console.log("Starting scraper run at", new Date().toISOString());
  console.log(`Running ${scrapers.length} scrapers...`);

  let totalPridano = 0;
  let totalAktualizovano = 0;
  let totalChyb = 0;

  for (const scraper of scrapers) {
    const startedAt = new Date();
    let pridano = 0;
    let aktualizovano = 0;
    let status = "success";
    let message = "";

    try {
      console.log(`Running ${scraper.source} scraper...`);
      const vyzvy = await scraper.scrape();
      console.log(`Found ${vyzvy.length} vyzvy from ${scraper.source}`);

      for (const vyzva of vyzvy) {
        const hash = scraper.generateHash(vyzva);

        const existing = await prisma.vyzva.findUnique({
          where: { hash },
        });

        if (!existing) {
          await prisma.vyzva.create({
            data: {
              nazev: vyzva.nazev,
              zdroj: vyzva.zdroj,
              zdrojUrl: vyzva.zdrojUrl,
              oblasti: vyzva.oblasti,
              alokace: vyzva.alokace ? BigInt(vyzva.alokace) : null,
              minCastka: vyzva.minCastka ? BigInt(vyzva.minCastka) : null,
              maxCastka: vyzva.maxCastka ? BigInt(vyzva.maxCastka) : null,
              miraSpolufinancovani: vyzva.miraSpolufinancovani ?? null,
              deadline: vyzva.deadline ?? null,
              datumVyhlaseni: vyzva.datumVyhlaseni ?? null,
              popis: vyzva.popis ?? null,
              plnyText: vyzva.plnyText ?? null,
              zdrojDokumentace: vyzva.zdrojDokumentace ?? null,
              status: vyzva.status,
              hash,
            },
          });
          pridano++;
        } else {
          await prisma.vyzva.update({
            where: { hash },
            data: {
              status: vyzva.status,
              deadline: vyzva.deadline,
              updatedAt: new Date(),
            },
          });
          aktualizovano++;
        }
      }
    } catch (error) {
      status = "error";
      message = error instanceof Error ? error.message : "Unknown error";
      console.error(`${scraper.source} scraper error:`, error);
      totalChyb++;
    }

    await prisma.scraperLog.create({
      data: {
        zdroj: scraper.source,
        status,
        message,
        vyzevPridano: pridano,
        vyzevAktualizovano: aktualizovano,
        startedAt,
      },
    });

    console.log(
      `${scraper.source}: +${pridano} new, ~${aktualizovano} updated`
    );

    totalPridano += pridano;
    totalAktualizovano += aktualizovano;

    // Be polite between scraper runs
    await delay(2000);
  }

  console.log("Scraper run completed at", new Date().toISOString());
  console.log(`Summary: +${totalPridano} new, ~${totalAktualizovano} updated, ${totalChyb} errors`);
}

export { scrapers };
