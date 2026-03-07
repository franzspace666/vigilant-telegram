import { config } from 'dotenv';
config();

import { runAllScrapers } from '../src/lib/scrapers/index.js';

async function main() {
  console.log('Manual scraper run...');
  await runAllScrapers();
  console.log('Done!');
  process.exit(0);
}

main().catch(console.error);
