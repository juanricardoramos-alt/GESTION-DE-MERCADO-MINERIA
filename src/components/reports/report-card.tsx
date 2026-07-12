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
 * Tarjeta de estudio. Para reportes premium sin acceso, `summary` llega
 * como null porque el SERVIDOR lo retuvo (paywall real, no visual): aquí
 * solo se pinta el panel de bloqueo con el CTA hacia la membresía.
 */
export function ReportCard({ report }: { report: Report }) {
  const locale = useLocale();
  const t = useTranslations("reports");

  return (
    <Card className="flex h-full flex-col transition-shadow hover:shadow-md">
      <CardContent className="flex flex-1 flex-col gap-3 p-6">
        <div className="flex items-start justify-between gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-primary">
            <FileText className="h-5 w-5" aria-hidden />
          </span>
          <div className="flex flex-wrap justify-end gap-1.5">
            <SectorBadge sector={report.sector} />
            {report.premium ? (
              <Badge
                variant="outline"
                className="border-amber-200 bg-amber-50 text-amber-700"
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

        {report.summary ? (
          <p className="text-sm leading-relaxed text-muted-foreground">
            {pickText(report.summary, locale)}
          </p>
        ) : (
          <div className="flex items-start gap-2.5 rounded-md border border-dashed border-amber-300 bg-amber-50/60 px-3 py-3">
            <Lock className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" aria-hidden />
            <p className="text-sm leading-relaxed text-amber-900">
              {t("lockedSummary")}
            </p>
          </div>
        )}

        <p className="mt-auto pt-2 text-xs text-muted-foreground">
          {t("pages", { count: report.pages })} ·{" "}
          {formatDate(report.date, locale)}
        </p>

        {report.locked ? (
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
            {/* Si no hay PDF subido aún, el botón queda como placeholder */}
            <a
              href={report.fileUrl ?? "#"}
              {...(report.fileUrl ? { target: "_blank", rel: "noreferrer" } : {})}
            >
              <Download className="h-4 w-4" aria-hidden />
              {t("download")}
            </a>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
