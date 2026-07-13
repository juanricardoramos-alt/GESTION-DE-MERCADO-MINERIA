import {
  Prisma,
  type Article as DbArticle,
  type Company as DbCompany,
  type Executive as DbExecutive,
  type Project as DbProject,
  type ProjectStatus,
  type Study as DbStudy,
} from "@prisma/client";

import { prisma } from "@/lib/db";
import {
  localizedTextListSchema,
  localizedTextSchema,
} from "@/lib/validation";
import type {
  Company,
  Executive,
  LocalizedText,
  NewsArticle,
  Project,
  Report,
  SectorId,
} from "@/types";

/**
 * Capa de lectura de contenido: queries de Prisma + mapeo de las filas a los
 * tipos de dominio que consumen los componentes. Los campos Json bilingües se
 * validan con Zod al salir de la base, de modo que un registro malformado
 * falle ruidosamente aquí y no en el render.
 */

function toLocalized(value: Prisma.JsonValue): LocalizedText {
  return localizedTextSchema.parse(value);
}

function toLocalizedList(value: Prisma.JsonValue): LocalizedText[] {
  return localizedTextListSchema.parse(value);
}

/** Fecha ISO (YYYY-MM-DD), formato que esperan los formatters de la UI. */
function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

// ---------------------------------------------------------------------------
// Mappers
// ---------------------------------------------------------------------------

function mapArticle(row: DbArticle): NewsArticle {
  return {
    id: row.id,
    title: toLocalized(row.title),
    excerpt: toLocalized(row.excerpt),
    sector: row.sector,
    sourceName: row.sourceName,
    date: toIsoDate(row.publishedAt),
    readingMinutes: row.readingMinutes,
    featured: row.featured,
    premium: row.premium,
    isExternal: row.isExternal,
    originalUrl: row.originalUrl,
    sourceUrl: row.sourceUrl,
    imageUrl: row.imageUrl,
    summary: row.summary,
  };
}

function mapExecutive(row: DbExecutive): Executive {
  return {
    name: row.name,
    role: toLocalized(row.role),
    email: row.email,
  };
}

function mapCompany(row: DbCompany & { executives: DbExecutive[] }): Company {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    sectors: row.sectors,
    industry: toLocalized(row.industry),
    description: toLocalized(row.description),
    services: toLocalizedList(row.services),
    website: row.website,
    email: row.email,
    phone: row.phone,
    city: row.city,
    employees: row.employees,
    founded: row.founded,
    executives: row.executives.map(mapExecutive),
  };
}

function mapProject(row: DbProject): Project {
  return {
    id: row.id,
    name: row.name,
    company: row.companyName,
    sector: row.sector,
    status: row.status,
    region: row.region,
    lat: row.lat,
    lng: row.lng,
    investmentUsdM: row.investmentUsdM,
    startYear: row.startYear,
    description: toLocalized(row.description),
  };
}

/**
 * PAYWALL SERVER-SIDE: cuando el estudio es premium y `revealPremium` es
 * false, el resumen se descarta aquí — nunca se serializa hacia el cliente.
 */
function mapStudy(row: DbStudy, revealPremium: boolean): Report {
  const locked = row.premium && !revealPremium;
  return {
    id: row.id,
    title: toLocalized(row.title),
    summary: locked ? null : toLocalized(row.summary),
    sector: row.sector,
    pages: row.pages,
    date: toIsoDate(row.date),
    premium: row.premium,
    locked,
    fileUrl: locked ? null : row.fileUrl,
  };
}

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

export async function getArticles(): Promise<NewsArticle[]> {
  const rows = await prisma.article.findMany({
    orderBy: { publishedAt: "desc" },
  });
  return rows.map(mapArticle);
}

export async function getFeaturedArticles(limit = 3): Promise<NewsArticle[]> {
  const rows = await prisma.article.findMany({
    where: { featured: true },
    orderBy: { publishedAt: "desc" },
    take: limit,
  });
  return rows.map(mapArticle);
}

export async function getCompanies(): Promise<Company[]> {
  const rows = await prisma.company.findMany({
    orderBy: { name: "asc" },
    include: { executives: { orderBy: { order: "asc" } } },
  });
  return rows.map(mapCompany);
}

export async function getCompanyBySlug(slug: string): Promise<Company | null> {
  const row = await prisma.company.findUnique({
    where: { slug },
    include: { executives: { orderBy: { order: "asc" } } },
  });
  return row ? mapCompany(row) : null;
}

export async function getProjects(): Promise<Project[]> {
  const rows = await prisma.project.findMany({ orderBy: { name: "asc" } });
  return rows.map(mapProject);
}

/** Proyectos del titular, enlazados por relación o por nombre publicado. */
export async function getProjectsByCompany(
  companyId: string,
  companyName: string,
): Promise<Project[]> {
  const rows = await prisma.project.findMany({
    where: { OR: [{ companyId }, { companyName }] },
    orderBy: { investmentUsdM: "desc" },
  });
  return rows.map(mapProject);
}

export async function getStudies({
  revealPremium,
}: {
  /** true solo si el usuario ya fue autorizado (ver src/lib/access.ts). */
  revealPremium: boolean;
}): Promise<Report[]> {
  const rows = await prisma.study.findMany({ orderBy: { date: "desc" } });
  return rows.map((row) => mapStudy(row, revealPremium));
}

// ---------------------------------------------------------------------------
// Búsqueda y filtros server-side (Fase 6)
// ---------------------------------------------------------------------------

export interface PagedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageCount: number;
}

/**
 * Convierte el texto del usuario en una tsquery de prefijos ("cobr:* & verd:*"),
 * para que la búsqueda coincida mientras se escribe, usando el índice GIN.
 */
function buildPrefixTsquery(q: string): string | null {
  const terms = q
    .split(/\s+/)
    .map((term) => term.replace(/[^\p{L}\p{N}]/gu, ""))
    .filter(Boolean)
    .slice(0, 8);
  if (terms.length === 0) return null;
  return terms.map((term) => `${term}:*`).join(" & ");
}

/** Config regconfig por locale (los índices FTS existen para ambos). */
function ftsLanguage(locale: "es" | "en"): string {
  return locale === "en" ? "english" : "spanish";
}

/** Expresión indexada por Article_fts_{es,en} — mantener en sincronía. */
function articleVector(locale: "es" | "en"): Prisma.Sql {
  return locale === "en"
    ? Prisma.sql`to_tsvector('english', coalesce("title"->>'en','') || ' ' || coalesce("excerpt"->>'en','') || ' ' || coalesce("sourceName",''))`
    : Prisma.sql`to_tsvector('spanish', coalesce("title"->>'es','') || ' ' || coalesce("excerpt"->>'es','') || ' ' || coalesce("sourceName",''))`;
}

/** Expresión indexada por Company_fts_{es,en} — mantener en sincronía. */
function companyVector(locale: "es" | "en"): Prisma.Sql {
  return locale === "en"
    ? Prisma.sql`to_tsvector('english', "name" || ' ' || "city" || ' ' || coalesce("industry"->>'en','') || ' ' || coalesce("description"->>'en','') || ' ' || coalesce("services"::text,''))`
    : Prisma.sql`to_tsvector('spanish', "name" || ' ' || "city" || ' ' || coalesce("industry"->>'es','') || ' ' || coalesce("description"->>'es','') || ' ' || coalesce("services"::text,''))`;
}

export interface ArticleSearchParams {
  locale: "es" | "en";
  sector?: SectorId;
  q?: string;
  /** "own" = contenido propio, "external" = agregado por RSS. */
  origin?: "own" | "external";
  page: number;
  pageSize: number;
}

export async function searchArticles(
  params: ArticleSearchParams,
): Promise<PagedResult<NewsArticle>> {
  const { locale, sector, q, origin, page, pageSize } = params;
  const tsquery = q ? buildPrefixTsquery(q) : null;
  const isExternal =
    origin === "external" ? true : origin === "own" ? false : undefined;

  if (!tsquery) {
    const where = {
      ...(sector ? { sector } : {}),
      ...(isExternal === undefined ? {} : { isExternal }),
    };
    const [total, rows] = await Promise.all([
      prisma.article.count({ where }),
      prisma.article.findMany({
        where,
        orderBy: { publishedAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);
    return paged(rows.map(mapArticle), total, page, pageSize);
  }

  const lang = ftsLanguage(locale);
  const vector = articleVector(locale);
  const query = Prisma.sql`to_tsquery(${lang}::regconfig, ${tsquery})`;
  const sectorCond = sector
    ? Prisma.sql`AND "sector" = ${sector}::"Sector"`
    : Prisma.empty;
  const originCond =
    isExternal === undefined
      ? Prisma.empty
      : Prisma.sql`AND "isExternal" = ${isExternal}`;

  const [rows, countRows] = await Promise.all([
    prisma.$queryRaw<DbArticle[]>(Prisma.sql`
      SELECT * FROM "Article"
      WHERE ${vector} @@ ${query} ${sectorCond} ${originCond}
      ORDER BY ts_rank(${vector}, ${query}) DESC, "publishedAt" DESC
      LIMIT ${pageSize} OFFSET ${(page - 1) * pageSize}
    `),
    prisma.$queryRaw<Array<{ count: bigint }>>(Prisma.sql`
      SELECT count(*)::bigint AS count FROM "Article"
      WHERE ${vector} @@ ${query} ${sectorCond} ${originCond}
    `),
  ]);
  const total = Number(countRows[0]?.count ?? 0);
  return paged(rows.map(mapArticle), total, page, pageSize);
}

export interface CompanySearchParams {
  locale: "es" | "en";
  sector?: SectorId;
  q?: string;
  page: number;
  pageSize: number;
}

export async function searchCompanies(
  params: CompanySearchParams,
): Promise<PagedResult<Company>> {
  const { locale, sector, q, page, pageSize } = params;
  const tsquery = q ? buildPrefixTsquery(q) : null;

  if (!tsquery) {
    const where = sector ? { sectors: { has: sector } } : {};
    const [total, rows] = await Promise.all([
      prisma.company.count({ where }),
      prisma.company.findMany({
        where,
        orderBy: { name: "asc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: { executives: { orderBy: { order: "asc" } } },
      }),
    ]);
    return paged(rows.map(mapCompany), total, page, pageSize);
  }

  const lang = ftsLanguage(locale);
  const vector = companyVector(locale);
  const query = Prisma.sql`to_tsquery(${lang}::regconfig, ${tsquery})`;
  const sectorCond = sector
    ? Prisma.sql`AND ${sector}::"Sector" = ANY("sectors")`
    : Prisma.empty;

  // El ranking sale de SQL crudo; los ejecutivos, del include de Prisma.
  const [idRows, countRows] = await Promise.all([
    prisma.$queryRaw<Array<{ id: string }>>(Prisma.sql`
      SELECT id FROM "Company"
      WHERE ${vector} @@ ${query} ${sectorCond}
      ORDER BY ts_rank(${vector}, ${query}) DESC, "name" ASC
      LIMIT ${pageSize} OFFSET ${(page - 1) * pageSize}
    `),
    prisma.$queryRaw<Array<{ count: bigint }>>(Prisma.sql`
      SELECT count(*)::bigint AS count FROM "Company"
      WHERE ${vector} @@ ${query} ${sectorCond}
    `),
  ]);

  const ids = idRows.map((row) => row.id);
  const rows = await prisma.company.findMany({
    where: { id: { in: ids } },
    include: { executives: { orderBy: { order: "asc" } } },
  });
  const byId = new Map(rows.map((row) => [row.id, row]));
  const ordered = ids
    .map((id) => byId.get(id))
    .filter((row): row is NonNullable<typeof row> => row !== undefined);

  const total = Number(countRows[0]?.count ?? 0);
  return paged(ordered.map(mapCompany), total, page, pageSize);
}

export interface ProjectFilterParams {
  sector?: SectorId;
  region?: string;
  status?: ProjectStatus;
}

/** Filtro del mapa: sin paginación (los marcadores se muestran completos). */
export async function filterProjects(
  params: ProjectFilterParams,
): Promise<Project[]> {
  const rows = await prisma.project.findMany({
    where: {
      ...(params.sector ? { sector: params.sector } : {}),
      ...(params.region ? { region: params.region } : {}),
      ...(params.status ? { status: params.status } : {}),
    },
    orderBy: { name: "asc" },
  });
  return rows.map(mapProject);
}

/** Proyectos destacados por inversión (pines del mapa de la portada). */
export async function getTopProjects(limit = 8): Promise<Project[]> {
  const rows = await prisma.project.findMany({
    orderBy: { investmentUsdM: "desc" },
    take: limit,
  });
  return rows.map(mapProject);
}

/** Regiones presentes en la cartera (para el select del mapa). */
export async function getProjectRegions(): Promise<string[]> {
  const rows = await prisma.project.findMany({
    distinct: ["region"],
    select: { region: true },
    orderBy: { region: "asc" },
  });
  return rows.map((row) => row.region);
}

function paged<T>(
  items: T[],
  total: number,
  page: number,
  pageSize: number,
): PagedResult<T> {
  return {
    items,
    total,
    page,
    pageCount: Math.max(1, Math.ceil(total / pageSize)),
  };
}

// ---------------------------------------------------------------------------
// Lecturas del panel admin (sin paywall: el acceso lo garantiza requireAdmin)
// ---------------------------------------------------------------------------

export async function getArticleById(id: string): Promise<NewsArticle | null> {
  const row = await prisma.article.findUnique({ where: { id } });
  return row ? mapArticle(row) : null;
}

export async function getStudyByIdAdmin(
  id: string,
): Promise<(Report & { coverImageUrl: string | null }) | null> {
  const row = await prisma.study.findUnique({ where: { id } });
  return row
    ? { ...mapStudy(row, true), coverImageUrl: row.coverImageUrl }
    : null;
}

export async function getCompanyById(id: string): Promise<Company | null> {
  const row = await prisma.company.findUnique({
    where: { id },
    include: { executives: { orderBy: { order: "asc" } } },
  });
  return row ? mapCompany(row) : null;
}

export async function getProjectById(id: string): Promise<Project | null> {
  const row = await prisma.project.findUnique({ where: { id } });
  return row ? mapProject(row) : null;
}

/** Nombres de empresas del directorio (datalist del formulario de proyectos). */
export async function getCompanyNames(): Promise<string[]> {
  const rows = await prisma.company.findMany({
    select: { name: true },
    orderBy: { name: "asc" },
  });
  return rows.map((row) => row.name);
}

/** Agregados de cartera para los KPIs de portada. */
export async function getPortfolioStats(): Promise<{
  totalInvestmentUsdM: number;
  projectCount: number;
}> {
  const result = await prisma.project.aggregate({
    _sum: { investmentUsdM: true },
    _count: true,
  });
  return {
    totalInvestmentUsdM: result._sum.investmentUsdM ?? 0,
    projectCount: result._count,
  };
}
