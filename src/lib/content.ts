import type {
  Article as DbArticle,
  Company as DbCompany,
  Executive as DbExecutive,
  Prisma,
  Project as DbProject,
  Study as DbStudy,
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
    source: row.source,
    date: toIsoDate(row.date),
    readingMinutes: row.readingMinutes,
    featured: row.featured,
    premium: row.premium,
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

function mapStudy(row: DbStudy): Report {
  return {
    id: row.id,
    title: toLocalized(row.title),
    summary: toLocalized(row.summary),
    sector: row.sector,
    pages: row.pages,
    date: toIsoDate(row.date),
    premium: row.premium,
  };
}

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

export async function getArticles(): Promise<NewsArticle[]> {
  const rows = await prisma.article.findMany({ orderBy: { date: "desc" } });
  return rows.map(mapArticle);
}

export async function getFeaturedArticles(limit = 3): Promise<NewsArticle[]> {
  const rows = await prisma.article.findMany({
    where: { featured: true },
    orderBy: { date: "desc" },
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

export async function getStudies(): Promise<Report[]> {
  const rows = await prisma.study.findMany({ orderBy: { date: "desc" } });
  return rows.map(mapStudy);
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
