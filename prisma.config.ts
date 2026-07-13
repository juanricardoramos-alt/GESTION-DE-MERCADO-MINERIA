import "dotenv/config";

import { defineConfig } from "prisma/config";

/**
 * Configuración de Prisma 7: la URL de conexión vive aquí (y en el adapter
 * del cliente, ver src/lib/db.ts), ya no en el datasource del schema.
 *
 * Convención Neon: DATABASE_URL es la URL con pooler (runtime de la app);
 * DIRECT_URL es la URL directa, requerida por `prisma migrate` (advisory
 * locks que PgBouncer no soporta). En local ambas pueden ser la misma.
 */
const migrateUrl = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
if (!migrateUrl) {
  throw new Error("Define DATABASE_URL (y DIRECT_URL para Neon) en .env");
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: migrateUrl,
  },
});
