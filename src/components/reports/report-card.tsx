import { Download, FileText, Lock, LockOpen } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { SectorBadge } from "@/components/shared/sector-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import { formatDate, pickText } from "@/lib/formatters";
import type { Report } from "@/types";

/**
 * Tarjeta de estudio. Los reportes `premium` muestran un paywall visual:
 * resumen difuminado + candado + CTA hacia la página de membresía.
 */
export function ReportCard({ report }: { report: Report }) {
  const locale = useLocale();
  const t = useTranslations("reports");

  return (
    <Card className="flex h-full flex-col transition-shadow hover:shadow-md">
      <CardContent className="flex flex-1 flex-col gap-3 p-6">
        <div className="flex items-start justify-between gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-primary">
            <FileText className="h-5 w-5" aria-hidden />
          </span>
          <div className="flex flex-wrap justify-end gap-1.5">
            <SectorBadge sector={report.sector} />
            {report.premium ? (
              <Badge
                variant="outline"
                className="border-violet-200 bg-violet-50 text-violet-700"
              >
                <Lock className="h-3 w-3" aria-hidden />
                {t("premium")}
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="border-green-200 bg-green-50 text-green-700"
              >
                <LockOpen className="h-3 w-3" aria-hidden />
                {t("open")}
              </Badge>
            )}
          </div>
        </div>

        <h3 className="font-semibold leading-snug">
          {pickText(report.title, locale)}
        </h3>

        {report.premium ? (
          // Paywall visual: contenido difuminado + candado superpuesto
          <div className="relative">
            <p className="select-none text-sm leading-relaxed text-muted-foreground blur-[3px]">
              {pickText(report.summary, locale)}
            </p>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="flex items-center gap-1.5 rounded-full bg-background/90 px-3 py-1.5 text-xs font-medium text-foreground shadow-sm ring-1 ring-border">
                <Lock className="h-3.5 w-3.5 text-violet-600" aria-hidden />
                {t("premium")}
              </span>
            </div>
          </div>
        ) : (
          <p className="text-sm leading-relaxed text-muted-foreground">
            {pickText(report.summary, locale)}
          </p>
        )}

        <p className="mt-auto pt-2 text-xs text-muted-foreground">
          {t("pages", { count: report.pages })} ·{" "}
          {formatDate(report.date, locale)}
        </p>

        {report.premium ? (
          <div className="space-y-2">
            <Button className="w-full" asChild>
              <Link href="/membresia">
                <Lock className="h-4 w-4" aria-hidden />
                {t("unlock")}
              </Link>
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              {t("paywallHint")}
            </p>
          </div>
        ) : (
          <Button variant="outline" className="w-full" asChild>
            {/* Descarga simulada: no hay archivos reales en la demo */}
            <a href="#">
              <Download className="h-4 w-4" aria-hidden />
              {t("download")}
            </a>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
