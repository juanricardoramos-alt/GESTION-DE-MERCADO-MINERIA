import type { Report } from "@/types";

/** Biblioteca de estudios de ejemplo. `premium: true` activa el paywall visual. */
export const REPORTS: Report[] = [
  {
    id: "r01",
    title: {
      es: "Catastro de inversiones mineras 2026–2035",
      en: "Mining investment survey 2026–2035",
    },
    summary: {
      es: "Cartera de 18 proyectos estructurales: montos, cronogramas, titulares y probabilidad de ejecución por región.",
      en: "Pipeline of 18 structural projects: amounts, timelines, owners and execution probability by region.",
    },
    sector: "mineria",
    pages: 84,
    date: "2026-06-15",
    premium: true,
  },
  {
    id: "r02",
    title: {
      es: "Panorama del litio: oferta, demanda y precios al 2030",
      en: "Lithium outlook: supply, demand and prices to 2030",
    },
    summary: {
      es: "Balance global de mercado, curva de costos de salmueras vs. roca dura y escenarios de precio para carbonato e hidróxido.",
      en: "Global market balance, brine vs. hard-rock cost curve and price scenarios for carbonate and hydroxide.",
    },
    sector: "litio",
    pages: 62,
    date: "2026-05-30",
    premium: true,
  },
  {
    id: "r03",
    title: {
      es: "Guía de permisos para proyectos de hidrógeno verde",
      en: "Permitting guide for green hydrogen projects",
    },
    summary: {
      es: "Mapa regulatorio paso a paso: evaluación ambiental, concesiones marítimas, cambio de uso de suelo y plazos observados.",
      en: "Step-by-step regulatory map: environmental review, maritime concessions, land-use change and observed timelines.",
    },
    sector: "hidrogeno",
    pages: 45,
    date: "2026-05-12",
    premium: false,
  },
  {
    id: "r04",
    title: {
      es: "Desalinización en Chile: capacidad instalada y proyectada 2026",
      en: "Desalination in Chile: installed and projected capacity 2026",
    },
    summary: {
      es: "Inventario de plantas en operación y construcción, modelos contractuales multicliente y costos nivelados del agua.",
      en: "Inventory of operating and under-construction plants, multi-client contract models and levelized water costs.",
    },
    sector: "desalinizacion",
    pages: 38,
    date: "2026-04-28",
    premium: false,
  },
  {
    id: "r05",
    title: {
      es: "Precios de la energía: contratos PPA y tendencias 2026",
      en: "Energy prices: PPA contracts and 2026 trends",
    },
    summary: {
      es: "Benchmark de precios PPA solares y eólicos, primas por bloques 24/7 y efecto del almacenamiento en los contratos.",
      en: "Benchmark of solar and wind PPA prices, 24/7 block premiums and the effect of storage on contracts.",
    },
    sector: "energia",
    pages: 51,
    date: "2026-04-10",
    premium: true,
  },
  {
    id: "r06",
    title: {
      es: "Proveedores mineros: oportunidades de encadenamiento local",
      en: "Mining suppliers: local value-chain opportunities",
    },
    summary: {
      es: "Demanda proyectada de bienes y servicios de la cartera 2026–2030 y brechas de oferta local por categoría.",
      en: "Projected goods and services demand from the 2026–2030 pipeline and local supply gaps by category.",
    },
    sector: "mineria",
    pages: 47,
    date: "2026-03-25",
    premium: false,
  },
  {
    id: "r07",
    title: {
      es: "Agua y minería: estrategias de abastecimiento al 2030",
      en: "Water and mining: supply strategies to 2030",
    },
    summary: {
      es: "Matriz hídrica por faena, contratos de agua desalada, costos de impulsión y metas de recirculación del sector.",
      en: "Water matrix by operation, desalinated water contracts, pumping costs and sector recirculation targets.",
    },
    sector: "desalinizacion",
    pages: 56,
    date: "2026-03-08",
    premium: true,
  },
  {
    id: "r08",
    title: {
      es: "Radiografía del empleo en energías renovables",
      en: "Renewable energy employment snapshot",
    },
    summary: {
      es: "Dotaciones por tecnología, brechas de capital humano y remuneraciones de referencia en construcción y O&M.",
      en: "Headcount by technology, human capital gaps and reference salaries in construction and O&M.",
    },
    sector: "energia",
    pages: 33,
    date: "2026-02-20",
    premium: false,
  },
];
