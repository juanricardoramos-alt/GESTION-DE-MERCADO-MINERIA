import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

/**
 * Paginación por links (server component): conserva los filtros activos en
 * la URL, así cada página es compartible y navegable con atrás/adelante.
 */
export function Pagination({
  page,
  pageCount,
  basePath,
  searchParams,
}: {
  page: number;
  pageCount: number;
  basePath: string;
  searchParams: { sector?: string; q?: string; origin?: string };
}) {
  const t = useTranslations("common");
  if (pageCount <= 1) return null;

  function hrefFor(target: number): string {
    const params = new URLSearchParams();
    if (searchParams.sector) params.set("sector", searchParams.sector);
    if (searchParams.origin) params.set("origin", searchParams.origin);
    if (searchParams.q) params.set("q", searchParams.q);
    if (target > 1) params.set("page", String(target));
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  }

  return (
    <nav
      className="flex items-center justify-center gap-4"
      aria-label="Pagination"
    >
      <Button variant="outline" size="sm" disabled={page <= 1} asChild={page > 1}>
        {page > 1 ? (
          <Link href={hrefFor(page - 1)} rel="prev">
            <ChevronLeft className="h-4 w-4" aria-hidden />
            {t("previous")}
          </Link>
        ) : (
          <span className="flex items-center gap-1">
            <ChevronLeft className="h-4 w-4" aria-hidden />
            {t("previous")}
          </span>
        )}
      </Button>

      <span className="text-sm tabular-nums text-muted-foreground">
        {t("pageOf", { page, total: pageCount })}
      </span>

      <Button
        variant="outline"
        size="sm"
        disabled={page >= pageCount}
        asChild={page < pageCount}
      >
        {page < pageCount ? (
          <Link href={hrefFor(page + 1)} rel="next">
            {t("next")}
            <ChevronRight className="h-4 w-4" aria-hidden />
          </Link>
        ) : (
          <span className="flex items-center gap-1">
            {t("next")}
            <ChevronRight className="h-4 w-4" aria-hidden />
          </span>
        )}
      </Button>
    </nav>
  );
}
