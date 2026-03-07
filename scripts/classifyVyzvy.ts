import { config } from "dotenv";
config({ path: ".env.local" });

async function main() {
  const { PrismaClient } = await import("@prisma/client");
  const { PrismaPg } = await import("@prisma/adapter-pg");
  const { Pool } = await import("pg");
  const { classifyVyzva } = await import("../src/lib/relevance.js");

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  const all = await prisma.vyzva.findMany({ select: { id: true, nazev: true } });
  console.log(`Celkem záznamů: ${all.length}`);

  let docs = 0;
  let grants = 0;
  const batchSize = 100;

  for (let i = 0; i < all.length; i += batchSize) {
    const batch = all.slice(i, i + batchSize);
    await Promise.all(
      batch.map(async ({ id, nazev }) => {
        const typ = classifyVyzva(nazev);
        await prisma.vyzva.update({
          where: { id },
          data: { typZaznamu: typ },
        });
        if (typ === "dokument") docs++;
        else grants++;
      })
    );
    process.stdout.write(`\r${i + batch.length}/${all.length}`);
  }

  console.log(`\nHotovo: ${grants} výzev, ${docs} dokumentů`);
  await prisma.$disconnect();
  process.exit(0);
}

main().catch(console.error);
