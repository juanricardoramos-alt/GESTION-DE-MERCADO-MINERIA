import "dotenv/config";

import { defineConfig, env } from "prisma/config";

/**
 * Configuración de Prisma 7: la URL de conexión vive aquí (y en el adapter
 * del cliente, ver src/lib/db.ts), ya no en el datasource del schema.
 */
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
