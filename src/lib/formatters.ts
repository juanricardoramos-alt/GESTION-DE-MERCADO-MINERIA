import type { LocalizedText } from "@/types";

/** Devuelve la variante del texto según el locale activo (es/en). */
export function pickText(text: LocalizedText, locale: string): string {
  return locale === "en" ? text.en : text.es;
}

/** Formatea una fecha ISO como "12 jul 2026" / "Jul 12, 2026". */
export function formatDate(iso: string, locale: string): string {
  return new Intl.DateTimeFormat(locale === "en" ? "en-US" : "es-CL", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${iso}T12:00:00`));
}

/** Formatea un mes YYYY-MM como "jul 26" / "Jul 26" (ticks de ejes). */
export function formatMonth(yyyyMm: string, locale: string): string {
  const [y, m] = yyyyMm.split("-").map(Number);
  return new Intl.DateTimeFormat(locale === "en" ? "en-US" : "es-CL", {
    month: "short",
    year: "2-digit",
  }).format(new Date(y, m - 1, 15));
}

/** Formatea un mes YYYY-MM como "junio de 2026" / "June 2026". */
export function formatMonthLong(yyyyMm: string, locale: string): string {
  const [y, m] = yyyyMm.split("-").map(Number);
  return new Intl.DateTimeFormat(locale === "en" ? "en-US" : "es-CL", {
    month: "long",
    year: "numeric",
  }).format(new Date(y, m - 1, 15));
}

/** Número con separadores del locale y decimales opcionales. */
export function formatNumber(
  value: number,
  locale: string,
  options?: Intl.NumberFormatOptions,
): string {
  return new Intl.NumberFormat(
    locale === "en" ? "en-US" : "es-CL",
    options,
  ).format(value);
}

/** Inversión en millones de USD: "US$ 2.300 M". */
export function formatUsdM(value: number, locale: string): string {
  return `US$ ${formatNumber(value, locale)} M`;
}
