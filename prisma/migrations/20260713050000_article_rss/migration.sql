-- Extiende Article para el agregador RSS, preservando los datos existentes
-- (renombres en lugar de drop/add).

ALTER TABLE "Article" RENAME COLUMN "source" TO "sourceName";
ALTER TABLE "Article" RENAME COLUMN "date" TO "publishedAt";
ALTER INDEX "Article_date_idx" RENAME TO "Article_publishedAt_idx";

ALTER TABLE "Article" ADD COLUMN "sourceUrl" TEXT;
ALTER TABLE "Article" ADD COLUMN "originalUrl" TEXT;
ALTER TABLE "Article" ADD COLUMN "imageUrl" TEXT;
ALTER TABLE "Article" ADD COLUMN "isExternal" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Article" ADD COLUMN "summary" VARCHAR(250);

CREATE UNIQUE INDEX "Article_originalUrl_key" ON "Article"("originalUrl");
CREATE INDEX "Article_isExternal_idx" ON "Article"("isExternal");
