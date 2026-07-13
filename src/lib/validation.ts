import { z } from "zod";

import { CONTACT_TOPICS } from "@/lib/constants";

/** Normaliza un searchParam de Next (string | string[] | undefined). */
export function firstParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

/**
 * Schemas Zod compartidos. Toda entrada externa (formularios, API routes,
 * campos Json de la base) se valida con schemas de este módulo.
 */

/** Texto bilingüe { es, en } — formato canónico de los campos Json. */
export const localizedTextSchema = z.object({
  es: z.string(),
  en: z.string(),
});

export const localizedTextListSchema = z.array(localizedTextSchema);

export const emailSchema = z.string().trim().toLowerCase().email();

/** Alta al boletín (usado por el API route del newsletter). */
export const newsletterSubscribeSchema = z.object({
  email: emailSchema,
  locale: z.enum(["es", "en"]).default("es"),
});

/**
 * SearchParams de las páginas con filtros server-side. `.catch()` hace que
 * un parámetro basura degrade al valor por defecto en vez de romper la página.
 */
const sectorParam = z
  .enum(["mineria", "energia", "litio", "hidrogeno", "desalinizacion"])
  .optional()
  .catch(undefined);

const pageParam = z.coerce.number().int().min(1).max(1000).catch(1).default(1);

const queryParam = z
  .string()
  .trim()
  .max(120)
  .optional()
  .catch(undefined)
  .transform((value) => (value ? value : undefined));

export const listSearchParamsSchema = z.object({
  sector: sectorParam,
  q: queryParam,
  page: pageParam,
});

/** /noticias agrega el filtro de origen (propio vs. agregado por RSS). */
export const newsSearchParamsSchema = listSearchParamsSchema.extend({
  origin: z.enum(["own", "external"]).optional().catch(undefined),
});

export const mapSearchParamsSchema = z.object({
  sector: sectorParam,
  region: queryParam,
  status: z
    .enum(["operation", "construction", "approved", "evaluation"])
    .optional()
    .catch(undefined),
});

/** Valida un RUT chileno (formato flexible + dígito verificador módulo 11). */
export function isValidRut(rut: string): boolean {
  const clean = rut.replace(/\./g, "").replace(/-/g, "").toUpperCase();
  if (!/^\d{7,8}[\dK]$/.test(clean)) return false;
  const body = clean.slice(0, -1);
  const dv = clean.slice(-1);
  let sum = 0;
  let multiplier = 2;
  for (let i = body.length - 1; i >= 0; i -= 1) {
    sum += Number(body[i]) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }
  const rest = 11 - (sum % 11);
  const expected = rest === 11 ? "0" : rest === 10 ? "K" : String(rest);
  return dv === expected;
}

const rutField = z
  .string()
  .trim()
  .max(15)
  .optional()
  .transform((value) => (value ? value : undefined))
  .refine((value) => value === undefined || isValidRut(value), "invalid_rut");

/** Lead del formulario de contacto de la portada (POST /api/contact). */
export const contactLeadSchema = z.object({
  name: z.string().trim().min(2).max(120),
  company: z.string().trim().min(2).max(160),
  email: emailSchema,
  personRut: rutField,
  companyRut: rutField,
  phone: z
    .string()
    .trim()
    .max(25)
    .regex(/^[+0-9 ()-]*$/)
    .optional()
    .transform((value) => (value ? value : undefined)),
  topics: z.array(z.enum(CONTACT_TOPICS)).min(1).max(CONTACT_TOPICS.length),
  locale: z.enum(["es", "en"]).default("es"),
});
export const credentialsSchema = z.object({
  email: emailSchema,
  // bcrypt trunca a 72 bytes: se rechazan contraseñas más largas.
  password: z.string().min(8).max(72),
});

/** Registro de cuenta nueva (POST /api/auth/register). */
export const registerSchema = credentialsSchema.extend({
  name: z.string().trim().min(2).max(120),
  company: z
    .string()
    .trim()
    .max(120)
    .optional()
    .transform((value) => (value ? value : undefined)),
});
