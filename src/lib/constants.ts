import type { ProjectStatus, SectorId } from "@/types";

/**
 * Identidad del sitio. Cambiar aquí el nombre de marca y datos de contacto;
 * los textos descriptivos viven en `messages/{es,en}.json`.
 */
export const SITE = {
  name: "AndesIntel",
  contactEmail: "contacto@andesintel.cl",
  phone: "+56 2 2440 8100",
  address: "Av. Apoquindo 4501, Of. 1203, Las Condes, Santiago",
  twitter: "https://twitter.com/andesintel",
  linkedin: "https://www.linkedin.com/company/andesintel",
} as const;

/**
 * Sectores activos de la plataforma. Este arreglo alimenta las categorías de
 * noticias, los filtros del mapa, los rubros del directorio y los dashboards.
 * Para sumar un sector: agregarlo aquí, en el tipo `SectorId` y en las
 * traducciones (`sectors.*`).
 */
export const SECTORS: SectorId[] = [
  "mineria",
  "energia",
  "litio",
  "hidrogeno",
  "desalinizacion",
];

/** Clases de badge por sector (fondo suave + texto oscuro del mismo matiz). */
export const SECTOR_BADGE: Record<SectorId, string> = {
  mineria: "border-indigo-200 bg-indigo-50 text-indigo-700",
  energia: "border-amber-200 bg-amber-50 text-amber-700",
  litio: "border-teal-200 bg-teal-50 text-teal-700",
  hidrogeno: "border-sky-200 bg-sky-50 text-sky-700",
  desalinizacion: "border-blue-200 bg-blue-50 text-blue-700",
};

/** Orden canónico de estados de proyecto. */
export const PROJECT_STATUSES: ProjectStatus[] = [
  "operation",
  "construction",
  "approved",
  "evaluation",
];

/** Color de marcador en el mapa por estado (con leyenda y ficha como refuerzo). */
export const STATUS_COLOR: Record<ProjectStatus, string> = {
  operation: "#0CA30C",
  construction: "#4F46E5",
  approved: "#0D9488",
  evaluation: "#D97706",
};

/** Clases de badge por estado de proyecto. */
export const STATUS_BADGE: Record<ProjectStatus, string> = {
  operation: "border-green-200 bg-green-50 text-green-700",
  construction: "border-indigo-200 bg-indigo-50 text-indigo-700",
  approved: "border-teal-200 bg-teal-50 text-teal-700",
  evaluation: "border-amber-200 bg-amber-50 text-amber-700",
};

/**
 * Paleta categórica para gráficos, validada para visión de color deficiente
 * (ΔE adyacente ≥ 31) y contraste ≥ 3:1 sobre superficie blanca.
 * Asignación fija por serie — nunca reciclar según el orden de llegada.
 */
export const CHART = {
  indigo: "#4F46E5", // serie 1 / marca
  teal: "#0D9488", // serie 2 / acento de datos
  amber: "#D97706", // serie 3
  rose: "#E11D48", // serie 4
  neutral: "#64748B", // categoría residual (p. ej. térmica)
  grid: "#E2E8F0",
  axis: "#64748B",
} as const;

/** Regiones de Chile presentes en la cartera de proyectos de ejemplo. */
export const REGIONS = [
  "Arica y Parinacota",
  "Tarapacá",
  "Antofagasta",
  "Atacama",
  "Coquimbo",
  "Valparaíso",
  "Metropolitana",
  "O'Higgins",
  "Biobío",
  "Magallanes",
] as const;
