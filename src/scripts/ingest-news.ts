import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

import { ingestNews } from "../lib/news-ingest";

/**
 * Ingesta manual de noticias por RSS: `npm run ingest:news`.
 * En producción corre además cada 6 horas vía /api/cron/ingest-news.
 */

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const results = await ingestNews(prisma);
  let failures = 0;
  for (const result of results) {
    if (result.error) {
      failures += 1;
      console.error(`✗ ${result.source}: ${result.error}`);
    } else {
      console.log(
        `✓ ${result.source}: +${result.added} nuevas (${result.duplicated} ya existentes)`,
      );
    }
  }
  console.log(
    `Ingesta terminada: ${results.length - failures}/${results.length} fuentes OK, ` +
      `${results.reduce((sum, r) => sum + r.added, 0)} artículos nuevos`,
  );
  // Fallos parciales no rompen el cron; solo falla si NINGUNA fuente respondió.
  if (results.length > 0 && failures === results.length) {
    process.exitCode = 1;
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
