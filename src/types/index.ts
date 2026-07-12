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

/** Artículo del feed de noticias. */
export interface NewsArticle {
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
  summary: LocalizedText;
  sector: SectorId;
  pages: number;
  date: string; // ISO 8601
  /** true = exclusivo para miembros (paywall visual). */
  premium: boolean;
}

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
