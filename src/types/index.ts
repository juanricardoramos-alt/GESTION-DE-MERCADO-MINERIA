/**
 * Tipos de dominio de la plataforma de inteligencia de mercados.
 * Todo el contenido de ejemplo es bilingüe mediante `LocalizedText`.
 */

/** Texto con variante en español e inglés. */
export interface LocalizedText {
  es: string;
  en: string;
}

/**
 * Sectores cubiertos por la plataforma. Para agregar o quitar un sector,
 * editar `SECTORS` en `src/lib/constants.ts` y las traducciones en
 * `messages/{es,en}.json` (namespace `sectors`).
 */
export type SectorId =
  | "mineria"
  | "energia"
  | "litio"
  | "hidrogeno"
  | "desalinizacion";

/** Estado del ciclo de vida de un proyecto de inversión. */
export type ProjectStatus =
  | "operation"
  | "construction"
  | "approved"
  | "evaluation";

/** Artículo del feed de noticias (propio o agregado por RSS). */
export interface NewsArticle {
  id: string;
  title: LocalizedText;
  excerpt: LocalizedText;
  sector: SectorId;
  /** Nombre visible de la fuente. */
  sourceName: string;
  /** Fecha de publicación ISO 8601 (YYYY-MM-DD). */
  date: string;
  readingMinutes: number;
  featured: boolean;
  premium: boolean;
  /** true = agregado por RSS: el click abre el artículo original. */
  isExternal: boolean;
  /** URL del artículo original (solo externos). */
  originalUrl: string | null;
  /** Home del medio externo. */
  sourceUrl: string | null;
  imageUrl: string | null;
  /** Resumen corto del feed (máx. 250 caracteres), solo externos. */
  summary: string | null;
}

/** Forma fuente de una noticia propia (datos de seed). */
export interface ArticleSeed {
  id: string;
  title: LocalizedText;
  excerpt: LocalizedText;
  sector: SectorId;
  source: string;
  date: string; // ISO 8601
  readingMinutes: number;
  featured?: boolean;
  premium?: boolean;
}

/** Proyecto de inversión georreferenciado (para el mapa). */
export interface Project {
  id: string;
  name: string;
  company: string;
  sector: SectorId;
  status: ProjectStatus;
  region: string;
  lat: number;
  lng: number;
  /** Inversión estimada en millones de USD. */
  investmentUsdM: number;
  /** Año estimado de puesta en marcha. */
  startYear: number;
  description: LocalizedText;
}

/** Ejecutivo listado en el perfil de una empresa. */
export interface Executive {
  name: string;
  role: LocalizedText;
  email: string;
}

/** Empresa del directorio. */
export interface Company {
  id: string;
  slug: string;
  name: string;
  sectors: SectorId[];
  /** Rubro o giro principal. */
  industry: LocalizedText;
  description: LocalizedText;
  services: LocalizedText[];
  website: string;
  email: string;
  phone: string;
  city: string;
  employees: string;
  founded: number;
  executives: Executive[];
}

/** Estudio o reporte de la biblioteca. */
export interface Report {
  id: string;
  title: LocalizedText;
  /**
   * Resumen ejecutivo. Es `null` cuando el estudio es premium y el usuario
   * no tiene el plan requerido: el servidor lo retiene y al cliente solo
   * viajan los metadatos públicos (título, sector, páginas, fecha).
   */
  summary: LocalizedText | null;
  sector: SectorId;
  pages: number;
  date: string; // ISO 8601
  /** true = contenido exclusivo para miembros. */
  premium: boolean;
  /** true = el contenido premium fue retenido en el servidor. */
  locked: boolean;
  /** PDF descargable; null si no hay archivo o si el acceso está bloqueado. */
  fileUrl: string | null;
}

/** Estudio tal como lo edita el panel admin (sin paywall, con portada). */
export type AdminStudy = Report & { coverImageUrl: string | null };

/**
 * Forma fuente de un estudio (datos de seed/admin): el resumen siempre
 * existe; `locked` es un derivado de acceso que calcula el servidor.
 */
export type ReportSeed = Omit<Report, "summary" | "locked" | "fileUrl"> & {
  summary: LocalizedText;
};

/** Punto mensual de las series de mercado. */
export interface MonthlyMarketPoint {
  /** Mes en formato YYYY-MM. */
  date: string;
  /** Producción de cobre, miles de toneladas. */
  copperKt: number;
  /** Producción de litio, miles de toneladas LCE. */
  lithiumKtLce: number;
  /** Precio del cobre, USD por libra. */
  copperUsdLb: number;
  /** Precio del carbonato de litio, USD por tonelada. */
  lithiumUsdT: number;
}

/** Proyección anual de producción. */
export interface AnnualProjection {
  year: number;
  copperKt: number;
  lithiumKtLce: number;
}

/** Mix anual de generación eléctrica en TWh. */
export interface EnergyMixPoint {
  year: number;
  solar: number;
  wind: number;
  hydro: number;
  thermal: number;
}

/** Usuario de la sesión tal como lo consume la UI (header, menús). */
export interface SessionUser {
  id: string;
  name: string | null;
  email: string | null;
  tier: "FREE" | "PROFESIONAL" | "CORPORATIVO";
  role: "USER" | "ADMIN";
}

/** Plan de membresía. */
export interface Plan {
  id: string;
  /** Precio mensual en USD (0 = gratis). */
  priceMonthlyUsd: number;
  popular?: boolean;
}
