"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";

import { assertAdmin } from "@/lib/admin/guard";
import {
  articleFormSchema,
  companyFormSchema,
  projectFormSchema,
  studyFormSchema,
} from "@/lib/admin/schemas";
import { deleteUpload, saveUpload, UploadError } from "@/lib/admin/uploads";
import { prisma } from "@/lib/db";

/** Estado devuelto a useFormState: null = sin error. */
export interface ActionState {
  error: string | null;
}

function zodError(issues: { path: PropertyKey[]; message: string }[]): string {
  return issues
    .slice(0, 5)
    .map((issue) => `${issue.path.join(".") || "form"}: ${issue.message}`)
    .join(" · ");
}

function isUniqueViolation(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  );
}

/** Invalida todo el árbol: el contenido editado aparece en el sitio al tiro. */
function flush(): void {
  revalidatePath("/", "layout");
}

// ---------------------------------------------------------------------------
// Noticias
// ---------------------------------------------------------------------------

export async function saveArticle(
  locale: string,
  id: string | null,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await assertAdmin();

  const parsed = articleFormSchema.safeParse({
    title_es: formData.get("title_es"),
    title_en: formData.get("title_en"),
    excerpt_es: formData.get("excerpt_es"),
    excerpt_en: formData.get("excerpt_en"),
    sector: formData.get("sector"),
    source: formData.get("source"),
    date: formData.get("date"),
    readingMinutes: formData.get("readingMinutes"),
    featured: formData.get("featured"),
    premium: formData.get("premium"),
  });
  if (!parsed.success) return { error: zodError(parsed.error.issues) };

  const d = parsed.data;
  const data = {
    title: { es: d.title_es, en: d.title_en },
    excerpt: { es: d.excerpt_es, en: d.excerpt_en },
    sector: d.sector,
    source: d.source,
    date: d.date,
    readingMinutes: d.readingMinutes,
    featured: d.featured,
    premium: d.premium,
  };

  if (id) {
    await prisma.article.update({ where: { id }, data });
  } else {
    await prisma.article.create({ data });
  }
  flush();
  redirect(`/${locale}/admin/noticias`);
}

export async function deleteArticle(locale: string, id: string): Promise<void> {
  await assertAdmin();
  await prisma.article.delete({ where: { id } });
  flush();
  redirect(`/${locale}/admin/noticias`);
}

// ---------------------------------------------------------------------------
// Estudios (con PDF y portada)
// ---------------------------------------------------------------------------

export async function saveStudy(
  locale: string,
  id: string | null,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await assertAdmin();

  const parsed = studyFormSchema.safeParse({
    title_es: formData.get("title_es"),
    title_en: formData.get("title_en"),
    summary_es: formData.get("summary_es"),
    summary_en: formData.get("summary_en"),
    sector: formData.get("sector"),
    pages: formData.get("pages"),
    date: formData.get("date"),
    premium: formData.get("premium"),
  });
  if (!parsed.success) return { error: zodError(parsed.error.issues) };

  const d = parsed.data;
  const data = {
    title: { es: d.title_es, en: d.title_en },
    summary: { es: d.summary_es, en: d.summary_en },
    sector: d.sector,
    pages: d.pages,
    date: d.date,
    premium: d.premium,
  };

  const study = id
    ? await prisma.study.update({ where: { id }, data })
    : await prisma.study.create({ data });

  // Archivos opcionales: se guardan tras conocer el id definitivo.
  const pdf = formData.get("pdf");
  const cover = formData.get("cover");
  try {
    const uploads: { fileUrl?: string; coverImageUrl?: string } = {};
    if (pdf instanceof File && pdf.size > 0) {
      uploads.fileUrl = await saveUpload(pdf, "pdf", study.id);
    }
    if (cover instanceof File && cover.size > 0) {
      uploads.coverImageUrl = await saveUpload(cover, "image", study.id);
    }
    if (Object.keys(uploads).length > 0) {
      await prisma.study.update({ where: { id: study.id }, data: uploads });
    }
  } catch (error) {
    if (error instanceof UploadError) {
      return { error: `archivo: ${error.message}` };
    }
    throw error;
  }

  flush();
  redirect(`/${locale}/admin/estudios`);
}

export async function deleteStudy(locale: string, id: string): Promise<void> {
  await assertAdmin();
  const study = await prisma.study.delete({ where: { id } });
  if (study.fileUrl) await deleteUpload(study.fileUrl);
  if (study.coverImageUrl) await deleteUpload(study.coverImageUrl);
  flush();
  redirect(`/${locale}/admin/estudios`);
}

// ---------------------------------------------------------------------------
// Empresas (con ejecutivos)
// ---------------------------------------------------------------------------

function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function saveCompany(
  locale: string,
  id: string | null,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await assertAdmin();

  const parsed = companyFormSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug") ?? "",
    sectors: formData.getAll("sectors"),
    industry_es: formData.get("industry_es"),
    industry_en: formData.get("industry_en"),
    description_es: formData.get("description_es"),
    description_en: formData.get("description_en"),
    services: {
      services_es: formData.get("services_es"),
      services_en: formData.get("services_en"),
    },
    website: formData.get("website"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    city: formData.get("city"),
    employees: formData.get("employees"),
    founded: formData.get("founded"),
    executives: formData.get("executives"),
  });
  if (!parsed.success) return { error: zodError(parsed.error.issues) };

  const d = parsed.data;
  const data = {
    name: d.name,
    slug: d.slug || slugify(d.name),
    sectors: d.sectors,
    industry: { es: d.industry_es, en: d.industry_en },
    description: { es: d.description_es, en: d.description_en },
    services: d.services,
    website: d.website,
    email: d.email,
    phone: d.phone,
    city: d.city,
    employees: d.employees,
    founded: d.founded,
  };

  try {
    const company = id
      ? await prisma.company.update({ where: { id }, data })
      : await prisma.company.create({ data });

    // Ejecutivos: se recrean completos (sin clave natural estable).
    await prisma.executive.deleteMany({ where: { companyId: company.id } });
    if (d.executives.length > 0) {
      await prisma.executive.createMany({
        data: d.executives.map((executive, index) => ({
          companyId: company.id,
          name: executive.name,
          role: { es: executive.roleEs, en: executive.roleEn },
          email: executive.email,
          order: index,
        })),
      });
    }
  } catch (error) {
    if (isUniqueViolation(error)) {
      return { error: "Ya existe una empresa con ese nombre o slug." };
    }
    throw error;
  }

  flush();
  redirect(`/${locale}/admin/empresas`);
}

export async function deleteCompany(locale: string, id: string): Promise<void> {
  await assertAdmin();
  await prisma.company.delete({ where: { id } });
  flush();
  redirect(`/${locale}/admin/empresas`);
}

// ---------------------------------------------------------------------------
// Proyectos
// ---------------------------------------------------------------------------

export async function saveProject(
  locale: string,
  id: string | null,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await assertAdmin();

  const parsed = projectFormSchema.safeParse({
    name: formData.get("name"),
    companyName: formData.get("companyName"),
    sector: formData.get("sector"),
    status: formData.get("status"),
    region: formData.get("region"),
    lat: formData.get("lat"),
    lng: formData.get("lng"),
    investmentUsdM: formData.get("investmentUsdM"),
    startYear: formData.get("startYear"),
    description_es: formData.get("description_es"),
    description_en: formData.get("description_en"),
  });
  if (!parsed.success) return { error: zodError(parsed.error.issues) };

  const d = parsed.data;
  // Enlaza con la empresa del directorio cuando el nombre coincide.
  const company = await prisma.company.findUnique({
    where: { name: d.companyName },
    select: { id: true },
  });

  const data = {
    name: d.name,
    companyName: d.companyName,
    companyId: company?.id ?? null,
    sector: d.sector,
    status: d.status,
    region: d.region,
    lat: d.lat,
    lng: d.lng,
    investmentUsdM: d.investmentUsdM,
    startYear: d.startYear,
    description: { es: d.description_es, en: d.description_en },
  };

  if (id) {
    await prisma.project.update({ where: { id }, data });
  } else {
    await prisma.project.create({ data });
  }
  flush();
  redirect(`/${locale}/admin/proyectos`);
}

export async function deleteProject(locale: string, id: string): Promise<void> {
  await assertAdmin();
  await prisma.project.delete({ where: { id } });
  flush();
  redirect(`/${locale}/admin/proyectos`);
}
