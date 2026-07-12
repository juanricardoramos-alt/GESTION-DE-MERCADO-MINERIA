-- Índices de búsqueda y filtros server-side.

-- Filtro de empresas por sector (array): índice GIN de contención.
CREATE INDEX "Company_sectors_gin" ON "Company" USING GIN ("sectors");

-- Full-text de artículos: un índice por idioma sobre título+bajada+fuente.
CREATE INDEX "Article_fts_es" ON "Article" USING GIN (
  to_tsvector(
    'spanish',
    coalesce("title"->>'es', '') || ' ' ||
    coalesce("excerpt"->>'es', '') || ' ' ||
    coalesce("source", '')
  )
);
CREATE INDEX "Article_fts_en" ON "Article" USING GIN (
  to_tsvector(
    'english',
    coalesce("title"->>'en', '') || ' ' ||
    coalesce("excerpt"->>'en', '') || ' ' ||
    coalesce("source", '')
  )
);

-- Full-text de empresas: nombre, ciudad, rubro, descripción y servicios.
-- services es una lista Json [{es,en}]: se indexa su texto completo.
CREATE INDEX "Company_fts_es" ON "Company" USING GIN (
  to_tsvector(
    'spanish',
    "name" || ' ' || "city" || ' ' ||
    coalesce("industry"->>'es', '') || ' ' ||
    coalesce("description"->>'es', '') || ' ' ||
    coalesce("services"::text, '')
  )
);
CREATE INDEX "Company_fts_en" ON "Company" USING GIN (
  to_tsvector(
    'english',
    "name" || ' ' || "city" || ' ' ||
    coalesce("industry"->>'en', '') || ' ' ||
    coalesce("description"->>'en', '') || ' ' ||
    coalesce("services"::text, '')
  )
);
