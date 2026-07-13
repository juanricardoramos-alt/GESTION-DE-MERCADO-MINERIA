import type { PrismaClient } from "@prisma/client";
import Parser from "rss-parser";

import { NEWS_SOURCES, type NewsSource } from "@/lib/constants";
import type { SectorId } from "@/types";

/**
 * Ingesta de noticias por RSS. Somos AGREGADOR: se guarda titular, resumen
 * corto (recortado del propio feed, máx. 250 caracteres), imagen, fecha y
 * fuente. NUNCA el cuerpo del artículo — el link lleva al sitio original.
 */

const USER_AGENT =
  "GestionDeMercadoBot/1.0 (+https://gestion-mercado.cl; agregador RSS)";

export const SUMMARY_MAX_LENGTH = 250;

/** Reglas de clasificación por keywords; la primera que calza gana. */
const SECTOR_KEYWORDS: Array<[SectorId, RegExp]> = [
  ["litio", /\blitio\b|\blithium\b|salar(es)?\b|salmuera/i],
  ["hidrogeno", /hidr[oó]geno|hydrogen|amon[ií]aco|ammonia|\bh2v\b/i],
  [
    "desalinizacion",
    /desalinizaci[oó]n|desalaci[oó]n|desaladora|desalination|agua de mar/i,
  ],
  [
    "energia",
    /\bsolar\b|e[oó]lic|fotovolta|transmisi[oó]n|el[eé]ctric|renovable|almacenamiento|bater[ií]a|\bpmgd\b|hidroel[eé]ctric/i,
  ],
  [
    "mineria",
    /\bcobre\b|\bcopper\b|miner[ií]a|minera\b|\bmina\b|relaves?|molibdeno|concentrado|fundici[oó]n|\btronadura/i,
  ],
];

export function classifySector(text: string, fallback: SectorId): SectorId {
  for (const [sector, pattern] of SECTOR_KEYWORDS) {
    if (pattern.test(text)) return sector;
  }
  return fallback;
}

/** Limpia HTML/espacios del resumen del feed y lo recorta a 250 chars. */
export function toSummary(raw: string | undefined): string | null {
  if (!raw) return null;
  const text = raw
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#0?39;|&apos;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
  if (!text) return null;
  if (text.length <= SUMMARY_MAX_LENGTH) return text;
  return `${text.slice(0, SUMMARY_MAX_LENGTH - 1).trimEnd()}…`;
}

/**
 * Verificación simple de robots.txt (grupos User-agent * o del bot):
 * regla de prefijo más larga entre Allow/Disallow para la ruta del feed.
 * Sin robots.txt (o inaccesible) se asume permitido, como es convención.
 */
export function robotsAllows(robotsTxt: string, path: string): boolean {
  const lines = robotsTxt.split(/\r?\n/);
  let applies = false;
  const rules: Array<{ allow: boolean; prefix: string }> = [];

  for (const line of lines) {
    const cleaned = line.replace(/#.*$/, "").trim();
    if (!cleaned) continue;
    const [rawKey, ...rest] = cleaned.split(":");
    const key = rawKey.trim().toLowerCase();
    const value = rest.join(":").trim();
    if (key === "user-agent") {
      applies =
        value === "*" ||
        value.toLowerCase().includes("gestiondemercadobot");
    } else if (applies && (key === "disallow" || key === "allow")) {
      if (value === "" && key === "disallow") continue; // vacío = todo permitido
      rules.push({ allow: key === "allow", prefix: value });
    }
  }

  let winner: { allow: boolean; prefix: string } | null = null;
  for (const rule of rules) {
    if (!path.startsWith(rule.prefix)) continue;
    if (!winner || rule.prefix.length > winner.prefix.length) winner = rule;
  }
  return winner ? winner.allow : true;
}

async function feedAllowedByRobots(feedUrl: string): Promise<boolean> {
  try {
    const url = new URL(feedUrl);
    const response = await fetch(`${url.origin}/robots.txt`, {
      headers: { "user-agent": USER_AGENT },
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) return true;
    return robotsAllows(await response.text(), url.pathname);
  } catch {
    // robots.txt inaccesible: no bloquea la ingesta del feed
    return true;
  }
}

export interface IngestSourceResult {
  source: string;
  added: number;
  duplicated: number;
  /** Presente si la fuente falló (la ingesta continúa con las demás). */
  error?: string;
}

interface FeedItemMedia {
  "media:content"?: { $?: { url?: string } };
}

/** Recorre las fuentes, deduplica por originalUrl y persiste lo nuevo. */
export async function ingestNews(
  prisma: PrismaClient,
  sources: NewsSource[] = NEWS_SOURCES,
): Promise<IngestSourceResult[]> {
  const parser: Parser<Record<string, never>, FeedItemMedia> = new Parser({
    timeout: 15000,
    headers: { "User-Agent": USER_AGENT },
    customFields: { item: ["media:content"] },
  });

  const results: IngestSourceResult[] = [];

  for (const source of sources) {
    try {
      if (!(await feedAllowedByRobots(source.feedUrl))) {
        results.push({
          source: source.name,
          added: 0,
          duplicated: 0,
          error: "bloqueado por robots.txt",
        });
        continue;
      }

      const feed = await parser.parseURL(source.feedUrl);
      const items = (feed.items ?? []).filter(
        (item): item is typeof item & { link: string } =>
          typeof item.link === "string" && item.link.length > 0,
      );

      // Deduplicación por originalUrl en un solo query.
      const urls = items.map((item) => item.link);
      const existing = await prisma.article.findMany({
        where: { originalUrl: { in: urls } },
        select: { originalUrl: true },
      });
      const known = new Set(existing.map((row) => row.originalUrl));

      let added = 0;
      for (const item of items) {
        if (known.has(item.link)) continue;
        known.add(item.link); // feeds con items repetidos

        const title = (item.title ?? "").trim().slice(0, 300);
        if (!title) continue;

        const summary = toSummary(
          item.contentSnippet ?? item.summary ?? item.content,
        );
        const publishedAt = item.isoDate ? new Date(item.isoDate) : new Date();
        const imageUrl =
          item.enclosure?.url ??
          item["media:content"]?.$?.url ??
          null;

        await prisma.article.create({
          data: {
            // Agregador: mismo titular en ambos idiomas (idioma del medio)
            title: { es: title, en: title },
            excerpt: { es: summary ?? title, en: summary ?? title },
            summary,
            sector: classifySector(`${title} ${summary ?? ""}`, source.sector),
            sourceName: source.name,
            sourceUrl: source.siteUrl,
            originalUrl: item.link,
            publishedAt,
            imageUrl,
            isExternal: true,
            readingMinutes: 3,
          },
        });
        added += 1;
      }

      results.push({
        source: source.name,
        added,
        duplicated: items.length - added,
      });
    } catch (error) {
      // Una fuente caída no detiene la ingesta de las demás.
      results.push({
        source: source.name,
        added: 0,
        duplicated: 0,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return results;
}
