import { config } from 'dotenv';
config({ path: '.env.local' });

async function main() {
  const { runAllScrapers } = await import('../src/lib/scrapers/index.js');
  console.log('Manual scraper run...');
  await runAllScrapers();
  console.log('Done!');
  process.exit(0);
}

main().catch(console.error);
