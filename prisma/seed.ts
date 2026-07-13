import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

import { COMPANIES } from "../src/data/companies";
import { NEWS } from "../src/data/news";
import { PROJECTS } from "../src/data/projects";
import { REPORTS } from "../src/data/reports";
import type { LocalizedText } from "../src/types";

/**
 * Seed idempotente: migra TODO el contenido de src/data/*.ts a Postgres
 * conservando los ids originales (c01, p01, n01, r01…), por lo que puede
 * correrse las veces que haga falta sin duplicar registros.
 */

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

/** Los interfaces no son asignables a InputJsonValue; el spread los convierte. */
const json = (value: LocalizedText) => ({ ...value });
const jsonList = (values: LocalizedText[]) => values.map((v) => ({ ...v }));

async function seedCompanies() {
  for (const company of COMPANIES) {
    const data = {
      slug: company.slug,
      name: company.name,
      sectors: company.sectors,
      industry: json(company.industry),
      description: json(company.description),
      services: jsonList(company.services),
      website: company.website,
      email: company.email,
      phone: company.phone,
      city: company.city,
      employees: company.employees,
      founded: company.founded,
    };
    await prisma.company.upsert({
      where: { id: company.id },
      create: { id: company.id, ...data },
      update: data,
    });

    // Los ejecutivos no tienen clave natural: se recrean con ids deterministas.
    await prisma.executive.deleteMany({ where: { companyId: company.id } });
    await prisma.executive.createMany({
      data: company.executives.map((executive, index) => ({
        id: `${company.id}-e${index + 1}`,
        companyId: company.id,
        name: executive.name,
        role: json(executive.role),
        email: executive.email,
        order: index,
      })),
    });
  }
}

async function seedProjects() {
  const companyIdByName = new Map(COMPANIES.map((c) => [c.name, c.id]));
  for (const project of PROJECTS) {
    const data = {
      name: project.name,
      sector: project.sector,
      status: project.status,
      region: project.region,
      companyName: project.company,
      companyId: companyIdByName.get(project.company) ?? null,
      lat: project.lat,
      lng: project.lng,
      investmentUsdM: project.investmentUsdM,
      startYear: project.startYear,
      description: json(project.description),
    };
    await prisma.project.upsert({
      where: { id: project.id },
      create: { id: project.id, ...data },
      update: data,
    });
  }
}

async function seedArticles() {
  for (const article of NEWS) {
    const data = {
      title: json(article.title),
      excerpt: json(article.excerpt),
      sector: article.sector,
      sourceName: article.source,
      publishedAt: new Date(article.date),
      readingMinutes: article.readingMinutes,
      featured: article.featured ?? false,
      premium: article.premium ?? false,
      isExternal: false,
    };
    await prisma.article.upsert({
      where: { id: article.id },
      create: { id: article.id, ...data },
      update: data,
    });
  }
}

async function seedStudies() {
  for (const report of REPORTS) {
    const data = {
      title: json(report.title),
      summary: json(report.summary),
      sector: report.sector,
      pages: report.pages,
      date: new Date(report.date),
      premium: report.premium,
    };
    await prisma.study.upsert({
      where: { id: report.id },
      create: { id: report.id, ...data },
      update: data,
    });
  }
}

/** Cuenta ADMIN inicial, solo si ADMIN_EMAIL y ADMIN_PASSWORD están definidas. */
async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    console.log("Admin: ADMIN_EMAIL/ADMIN_PASSWORD no definidas, se omite");
    return;
  }
  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.upsert({
    where: { email },
    create: { email, name: "Admin", passwordHash, role: "ADMIN" },
    update: { role: "ADMIN" },
  });
  console.log(`Admin listo: ${email}`);
}

async function main() {
  await seedCompanies();
  await seedProjects();
  await seedArticles();
  await seedStudies();
  await seedAdmin();

  const [companies, executives, projects, articles, studies] =
    await Promise.all([
      prisma.company.count(),
      prisma.executive.count(),
      prisma.project.count(),
      prisma.article.count(),
      prisma.study.count(),
    ]);

  const expected = {
    companies: COMPANIES.length,
    projects: PROJECTS.length,
    articles: NEWS.length,
    studies: REPORTS.length,
  };
  console.log(
    `Seed OK — empresas: ${companies}/${expected.companies}, ejecutivos: ${executives}, ` +
      `proyectos: ${projects}/${expected.projects}, noticias: ${articles}/${expected.articles}, ` +
      `estudios: ${studies}/${expected.studies}`,
  );
  if (
    companies < expected.companies ||
    projects < expected.projects ||
    articles < expected.articles ||
    studies < expected.studies
  ) {
    throw new Error("El seed no migró todos los registros esperados");
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
