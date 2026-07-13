import { z } from "zod";

/**
 * Schemas Zod de los formularios del panel admin. Los campos bilingües
 * llegan como pares <name>_es / <name>_en (tabs es/en del formulario) y
 * se transforman aquí al Json { es, en } que persiste la base.
 */

const requiredText = z.string().trim().min(1).max(500);
const longText = z.string().trim().min(1).max(5000);

const sectorSchema = z.enum([
  "mineria",
  "energia",
  "litio",
  "hidrogeno",
  "desalinizacion",
]);

const statusSchema = z.enum([
  "operation",
  "construction",
  "approved",
  "evaluation",
]);

/** "2026-07-12" (input type=date) → Date válida. */
const dateField = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .transform((value) => new Date(`${value}T12:00:00Z`));

const checkbox = z
  .union([z.literal("on"), z.null(), z.undefined()])
  .transform((value) => value === "on");

export const articleFormSchema = z.object({
  title_es: requiredText,
  title_en: requiredText,
  excerpt_es: longText,
  excerpt_en: longText,
  sector: sectorSchema,
  sourceName: requiredText.pipe(z.string().max(120)),
  date: dateField,
  readingMinutes: z.coerce.number().int().min(1).max(120),
  featured: checkbox,
  premium: checkbox,
});

export const studyFormSchema = z.object({
  title_es: requiredText,
  title_en: requiredText,
  summary_es: longText,
  summary_en: longText,
  sector: sectorSchema,
  pages: z.coerce.number().int().min(1).max(2000),
  date: dateField,
  premium: checkbox,
});

/** Textareas de servicios: una línea por servicio, pareadas por índice. */
const servicesPair = z
  .object({
    services_es: z.string().trim().max(4000),
    services_en: z.string().trim().max(4000),
  })
  .transform(({ services_es, services_en }) => {
    const toLines = (raw: string) =>
      raw
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);
    return { es: toLines(services_es), en: toLines(services_en) };
  })
  .refine(
    ({ es, en }) => es.length === en.length && es.length > 0,
    "services_mismatch",
  )
  .transform(({ es, en }) => es.map((line, i) => ({ es: line, en: en[i] })));

const executiveRow = z.object({
  name: requiredText.pipe(z.string().max(120)),
  roleEs: requiredText.pipe(z.string().max(120)),
  roleEn: requiredText.pipe(z.string().max(120)),
  email: z.string().trim().toLowerCase().email(),
});

/** Los ejecutivos viajan como JSON en un input oculto del formulario. */
const executivesField = z
  .string()
  .transform((raw, ctx) => {
    try {
      return JSON.parse(raw) as unknown;
    } catch {
      ctx.addIssue({ code: "custom", message: "invalid_json" });
      return z.NEVER;
    }
  })
  .pipe(z.array(executiveRow).max(20));

export const companyFormSchema = z.object({
  name: requiredText.pipe(z.string().max(160)),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9-]*$/)
    .max(160),
  sectors: z.array(sectorSchema).min(1),
  industry_es: requiredText,
  industry_en: requiredText,
  description_es: longText,
  description_en: longText,
  services: servicesPair,
  website: z.string().trim().url().max(300),
  email: z.string().trim().toLowerCase().email(),
  phone: requiredText.pipe(z.string().max(40)),
  city: requiredText.pipe(z.string().max(80)),
  employees: requiredText.pipe(z.string().max(40)),
  founded: z.coerce.number().int().min(1800).max(2100),
  executives: executivesField,
});

export const projectFormSchema = z.object({
  name: requiredText.pipe(z.string().max(200)),
  companyName: requiredText.pipe(z.string().max(160)),
  sector: sectorSchema,
  status: statusSchema,
  region: requiredText.pipe(z.string().max(80)),
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  investmentUsdM: z.coerce.number().min(0).max(1_000_000),
  startYear: z.coerce.number().int().min(2000).max(2100),
  description_es: longText,
  description_en: longText,
});

export type ArticleFormData = z.infer<typeof articleFormSchema>;
export type StudyFormData = z.infer<typeof studyFormSchema>;
export type CompanyFormData = z.infer<typeof companyFormSchema>;
export type ProjectFormData = z.infer<typeof projectFormSchema>;
