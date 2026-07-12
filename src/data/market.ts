import type {
  AnnualProjection,
  EnergyMixPoint,
  MonthlyMarketPoint,
} from "@/types";

/**
 * Series de mercado de ejemplo (enero 2024 – junio 2026).
 * Elaboradas a mano para que las tendencias sean verosímiles:
 * cobre al alza con estacionalidad, litio recuperándose tras la baja de 2024.
 */
export const MONTHLY_MARKET: MonthlyMarketPoint[] = [
  { date: "2024-01", copperKt: 426, lithiumKtLce: 19.2, copperUsdLb: 3.86, lithiumUsdT: 13500 },
  { date: "2024-02", copperKt: 411, lithiumKtLce: 18.7, copperUsdLb: 3.79, lithiumUsdT: 13100 },
  { date: "2024-03", copperKt: 438, lithiumKtLce: 19.9, copperUsdLb: 3.97, lithiumUsdT: 12600 },
  { date: "2024-04", copperKt: 432, lithiumKtLce: 20.1, copperUsdLb: 4.18, lithiumUsdT: 12100 },
  { date: "2024-05", copperKt: 445, lithiumKtLce: 20.6, copperUsdLb: 4.61, lithiumUsdT: 11800 },
  { date: "2024-06", copperKt: 441, lithiumKtLce: 20.3, copperUsdLb: 4.42, lithiumUsdT: 11400 },
  { date: "2024-07", copperKt: 449, lithiumKtLce: 20.9, copperUsdLb: 4.24, lithiumUsdT: 11000 },
  { date: "2024-08", copperKt: 452, lithiumKtLce: 21.2, copperUsdLb: 4.11, lithiumUsdT: 10800 },
  { date: "2024-09", copperKt: 446, lithiumKtLce: 21.0, copperUsdLb: 4.33, lithiumUsdT: 10600 },
  { date: "2024-10", copperKt: 458, lithiumKtLce: 21.6, copperUsdLb: 4.38, lithiumUsdT: 10700 },
  { date: "2024-11", copperKt: 462, lithiumKtLce: 21.9, copperUsdLb: 4.12, lithiumUsdT: 10500 },
  { date: "2024-12", copperKt: 471, lithiumKtLce: 22.4, copperUsdLb: 4.05, lithiumUsdT: 10400 },
  { date: "2025-01", copperKt: 444, lithiumKtLce: 21.7, copperUsdLb: 4.15, lithiumUsdT: 10600 },
  { date: "2025-02", copperKt: 429, lithiumKtLce: 21.1, copperUsdLb: 4.28, lithiumUsdT: 10800 },
  { date: "2025-03", copperKt: 455, lithiumKtLce: 22.3, copperUsdLb: 4.41, lithiumUsdT: 11000 },
  { date: "2025-04", copperKt: 451, lithiumKtLce: 22.6, copperUsdLb: 4.35, lithiumUsdT: 11200 },
  { date: "2025-05", copperKt: 464, lithiumKtLce: 23.1, copperUsdLb: 4.52, lithiumUsdT: 11500 },
  { date: "2025-06", copperKt: 459, lithiumKtLce: 22.8, copperUsdLb: 4.47, lithiumUsdT: 11400 },
  { date: "2025-07", copperKt: 467, lithiumKtLce: 23.4, copperUsdLb: 4.58, lithiumUsdT: 11700 },
  { date: "2025-08", copperKt: 470, lithiumKtLce: 23.7, copperUsdLb: 4.49, lithiumUsdT: 11900 },
  { date: "2025-09", copperKt: 463, lithiumKtLce: 23.5, copperUsdLb: 4.55, lithiumUsdT: 12000 },
  { date: "2025-10", copperKt: 474, lithiumKtLce: 24.0, copperUsdLb: 4.63, lithiumUsdT: 12200 },
  { date: "2025-11", copperKt: 478, lithiumKtLce: 24.3, copperUsdLb: 4.71, lithiumUsdT: 12100 },
  { date: "2025-12", copperKt: 486, lithiumKtLce: 24.8, copperUsdLb: 4.66, lithiumUsdT: 12300 },
  { date: "2026-01", copperKt: 459, lithiumKtLce: 24.1, copperUsdLb: 4.72, lithiumUsdT: 12500 },
  { date: "2026-02", copperKt: 447, lithiumKtLce: 23.6, copperUsdLb: 4.68, lithiumUsdT: 12400 },
  { date: "2026-03", copperKt: 472, lithiumKtLce: 24.6, copperUsdLb: 4.75, lithiumUsdT: 12700 },
  { date: "2026-04", copperKt: 469, lithiumKtLce: 24.9, copperUsdLb: 4.81, lithiumUsdT: 12900 },
  { date: "2026-05", copperKt: 481, lithiumKtLce: 25.4, copperUsdLb: 4.79, lithiumUsdT: 13000 },
  { date: "2026-06", copperKt: 476, lithiumKtLce: 25.1, copperUsdLb: 4.87, lithiumUsdT: 13100 },
];

/** Proyección anual de producción, escenario base 2024–2030. */
export const ANNUAL_PROJECTIONS: AnnualProjection[] = [
  { year: 2024, copperKt: 5330, lithiumKtLce: 249 },
  { year: 2025, copperKt: 5520, lithiumKtLce: 277 },
  { year: 2026, copperKt: 5690, lithiumKtLce: 302 },
  { year: 2027, copperKt: 5810, lithiumKtLce: 335 },
  { year: 2028, copperKt: 5960, lithiumKtLce: 388 },
  { year: 2029, copperKt: 6040, lithiumKtLce: 442 },
  { year: 2030, copperKt: 6150, lithiumKtLce: 505 },
];

/** Índice del primer año proyectado (2026 en adelante es proyección). */
export const PROJECTION_FROM_YEAR = 2026;

/** Mix de generación eléctrica nacional, TWh por año. */
export const ENERGY_MIX: EnergyMixPoint[] = [
  { year: 2019, solar: 6.7, wind: 4.1, hydro: 21.1, thermal: 44.3 },
  { year: 2020, solar: 8.4, wind: 5.6, hydro: 19.8, thermal: 43.6 },
  { year: 2021, solar: 10.9, wind: 7.3, hydro: 17.9, thermal: 44.9 },
  { year: 2022, solar: 14.2, wind: 8.9, hydro: 18.3, thermal: 40.6 },
  { year: 2023, solar: 17.8, wind: 10.2, hydro: 21.4, thermal: 35.1 },
  { year: 2024, solar: 21.6, wind: 11.5, hydro: 22.0, thermal: 31.7 },
  { year: 2025, solar: 25.9, wind: 12.8, hydro: 21.2, thermal: 28.4 },
];
