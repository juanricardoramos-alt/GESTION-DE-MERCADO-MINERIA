import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Card, CardContent } from "@/components/ui/card";
import { MONTHLY_MARKET } from "@/data/market";
import { formatMonthLong, formatNumber } from "@/lib/formatters";
import { cn } from "@/lib/utils";

/** Variación porcentual con signo, ya formateada. */
function pct(current: number, previous: number): number {
  return ((current - previous) / previous) * 100;
}

function Delta({
  value,
  note,
  locale,
}: {
  value: number;
  note: string;
  locale: string;
}) {
  const up = value >= 0;
  const Icon = up ? ArrowUpRight : ArrowDownRight;
  return (
    <p
      className={cn(
        "flex items-center gap-1 text-xs font-medium",
        up ? "text-green-700" : "text-red-600",
      )}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden />
      <span className="tabular-nums">
        {up ? "+" : ""}
        {formatNumber(value, locale, {
          minimumFractionDigits: 1,
          maximumFractionDigits: 1,
        })}
        %
      </span>
      <span className="font-normal text-muted-foreground">{note}</span>
    </p>
  );
}

/**
 * Indicadores destacados del mercado: series de ejemplo (precios/producción)
 * + agregados de la cartera de proyectos calculados en la base.
 */
export function KpiStrip({
  portfolioUsdM,
  projectCount,
}: {
  portfolioUsdM: number;
  projectCount: number;
}) {
  const t = useTranslations("home.kpis");
  const locale = useLocale();

  const last = MONTHLY_MARKET[MONTHLY_MARKET.length - 1];
  const prev = MONTHLY_MARKET[MONTHLY_MARKET.length - 2];
  const yearAgo = MONTHLY_MARKET[MONTHLY_MARKET.length - 13];

  const kpis = [
    {
      label: t("copperPrice"),
      unit: t("copperPriceUnit"),
      value: formatNumber(last.copperUsdLb, locale, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      delta: (
        <Delta
          value={pct(last.copperUsdLb, prev.copperUsdLb)}
          note={t("vsPrevMonth")}
          locale={locale}
        />
      ),
    },
    {
      label: t("copperProduction"),
      unit: t("copperProductionUnit"),
      value: formatNumber(last.copperKt, locale),
      delta: (
        <Delta
          value={pct(last.copperKt, yearAgo.copperKt)}
          note={t("vsPrevYear")}
          locale={locale}
        />
      ),
    },
    {
      label: t("lithiumPrice"),
      unit: t("lithiumPriceUnit"),
      value: formatNumber(last.lithiumUsdT, locale),
      delta: (
        <Delta
          value={pct(last.lithiumUsdT, prev.lithiumUsdT)}
          note={t("vsPrevMonth")}
          locale={locale}
        />
      ),
    },
    {
      label: t("portfolio"),
      unit: t("portfolioUnit"),
      value: `US$ ${formatNumber(portfolioUsdM, locale)} M`,
      delta: (
        <p className="text-xs text-muted-foreground">
          {t("projectsTracked", { count: projectCount })}
        </p>
      ),
    },
  ];

  return (
    // relative + z-10: el hero es `relative` y sin esto pintaría sobre las tarjetas
    <section className="container relative z-10 -mt-10 pb-4 sm:-mt-12">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label} className="shadow-md">
            <CardContent className="space-y-1.5 p-5">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {kpi.label}
              </p>
              <p className="text-2xl font-semibold tracking-tight text-foreground">
                {kpi.value}
              </p>
              <p className="text-xs text-muted-foreground">{kpi.unit}</p>
              {kpi.delta}
            </CardContent>
          </Card>
        ))}
      </div>
      <p className="mt-3 text-right text-xs text-muted-foreground">
        {t("updated", { date: formatMonthLong(last.date, locale) })}
      </p>
    </section>
  );
}
