import cron from "node-cron";
import { runAllScrapers } from "../scrapers";

export function startScheduler() {
  console.log("Starting cron scheduler...");

  // Every 4 hours
  cron.schedule("0 */4 * * *", async () => {
    console.log("Scheduled scraper run starting...");
    try {
      await runAllScrapers();
    } catch (error) {
      console.error("Scheduled scraper run failed:", error);
    }
  });

  console.log("Cron scheduler started. Scraping every 4 hours.");
}
