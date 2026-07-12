import { z } from "zod";

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

/** Credenciales de inicio de sesión (provider credentials de Auth.js). */
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
