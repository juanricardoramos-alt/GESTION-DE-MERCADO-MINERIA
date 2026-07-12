"use client";

import { useMemo, useState, type ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ANNUAL_PROJECTIONS,
  ENERGY_MIX,
  MONTHLY_MARKET,
  PROJECTION_FROM_YEAR,
} from "@/data/market";
import { CHART } from "@/lib/constants";
import { formatMonth, formatNumber } from "@/lib/formatters";
import { cn } from "@/lib/utils";

type Range = "12" | "24" | "all";

/** Estilo compartido del tooltip (superficie clara, borde hairline). */
const TOOLTIP_STYLE = {
  borderRadius: 8,
  border: `1px solid ${CHART.grid}`,
  boxShadow: "0 4px 12px rgba(15, 23, 42, 0.08)",
  fontSize: 12,
} as const;

const AXIS_TICK = { fontSize: 12, fill: CHART.axis } as const;

/** Tarjeta contenedora de un gráfico, con título y bajada. */
function ChartCard({
  title,
  subtitle,
  action,
  children,
}: {
  title: string;
  subtitle: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between space-y-0 pb-4">
        <div>
          <h3 className="font-semibold">{title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        </div>
        {action}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

/** Producción mensual: dos paneles (cobre / litio), escalas independientes. */
function ProductionChart({ range }: { range: Range }) {
  const t = useTranslations("analytics");
  const locale = useLocale();
  const data = useMemo(() => sliceByRange(MONTHLY_MARKET, range), [range]);

  const panels = [
    {
      key: "copperKt",
      label: t("production.copperSeries"),
      color: CHART.indigo,
      gradientId: "grad-copper",
      decimals: 0,
    },
    {
      key: "lithiumKtLce",
      label: t("production.lithiumSeries"),
      color: CHART.teal,
      gradientId: "grad-lithium",
      decimals: 1,
    },
  ] as const;

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {panels.map((panel) => (
        <div key={panel.key}>
          <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <span
              aria-hidden
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: panel.color }}
            />
            {panel.label}
          </p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart
              data={data}
              margin={{ top: 4, right: 4, bottom: 0, left: -12 }}
            >
              <defs>
                <linearGradient
                  id={panel.gradientId}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor={panel.color} stopOpacity={0.22} />
                  <stop offset="100%" stopColor={panel.color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke={CHART.grid} vertical={false} />
              <XAxis
                dataKey="date"
                tick={AXIS_TICK}
                tickLine={false}
                axisLine={false}
                minTickGap={32}
                tickFormatter={(v) => formatMonth(String(v), locale)}
              />
              <YAxis
                tick={AXIS_TICK}
                tickLine={false}
                axisLine={false}
                domain={["auto", "auto"]}
                tickFormatter={(v) => formatNumber(Number(v), locale)}
              />
              <Tooltip
                contentStyle={TOOLTIP_STYLE}
                labelFormatter={(label) => formatMonth(String(label), locale)}
                formatter={(value) =>
                  formatNumber(Number(value), locale, {
                    minimumFractionDigits: panel.decimals,
                    maximumFractionDigits: panel.decimals,
                  })
                }
              />
              <Area
                type="monotone"
                dataKey={panel.key}
                name={panel.label}
                stroke={panel.color}
                strokeWidth={2}
                fill={`url(#${panel.gradientId})`}
                dot={false}
                activeDot={{ r: 4 }}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ))}
    </div>
  );
}

/** Precios de referencia: pestañas cobre/litio (escalas distintas → nunca doble eje). */
function PriceChart({ range }: { range: Range }) {
  const t = useTranslations("analytics");
  const locale = useLocale();
  const data = useMemo(() => sliceByRange(MONTHLY_MARKET, range), [range]);

  const series = {
    copper: {
      dataKey: "copperUsdLb",
      color: CHART.indigo,
      unit: t("prices.copperUnit"),
      decimals: 2,
    },
    lithium: {
      dataKey: "lithiumUsdT",
      color: CHART.teal,
      unit: t("prices.lithiumUnit"),
      decimals: 0,
    },
  } as const;

  return (
    <Tabs defaultValue="copper">
      <TabsList>
        <TabsTrigger value="copper">{t("copper")}</TabsTrigger>
        <TabsTrigger value="lithium">{t("lithium")}</TabsTrigger>
      </TabsList>
      {(Object.keys(series) as Array<keyof typeof series>).map((key) => {
        const s = series[key];
        return (
          <TabsContent key={key} value={key}>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart
                data={data}
                margin={{ top: 8, right: 4, bottom: 0, left: -4 }}
              >
                <CartesianGrid stroke={CHART.grid} vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={AXIS_TICK}
                  tickLine={false}
                  axisLine={false}
                  minTickGap={32}
                  tickFormatter={(v) => formatMonth(String(v), locale)}
                />
                <YAxis
                  tick={AXIS_TICK}
                  tickLine={false}
                  axisLine={false}
                  domain={["auto", "auto"]}
                  tickFormatter={(v) => formatNumber(Number(v), locale)}
                />
                <Tooltip
                  contentStyle={TOOLTIP_STYLE}
                  labelFormatter={(label) => formatMonth(String(label), locale)}
                  formatter={(value) =>
                    `${formatNumber(Number(value), locale, {
                      minimumFractionDigits: s.decimals,
                      maximumFractionDigits: s.decimals,
                    })} ${s.unit}`
                  }
                />
                <Line
                  type="monotone"
                  dataKey={s.dataKey}
                  name={s.unit}
                  stroke={s.color}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
        );
      })}
    </Tabs>
  );
}

/** Proyección anual: barras, con los años proyectados atenuados. */
function ProjectionChart() {
  const t = useTranslations("analytics");
  const locale = useLocale();

  const series = {
    copper: { dataKey: "copperKt", color: CHART.indigo, decimals: 0 },
    lithium: { dataKey: "lithiumKtLce", color: CHART.teal, decimals: 0 },
  } as const;

  const firstYear = ANNUAL_PROJECTIONS[0].year;
  const lastYear = ANNUAL_PROJECTIONS[ANNUAL_PROJECTIONS.length - 1].year;

  return (
    <Tabs defaultValue="copper">
      <TabsList>
        <TabsTrigger value="copper">{t("copper")}</TabsTrigger>
        <TabsTrigger value="lithium">{t("lithium")}</TabsTrigger>
      </TabsList>
      {(Object.keys(series) as Array<keyof typeof series>).map((key) => {
        const s = series[key];
        return (
          <TabsContent key={key} value={key}>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart
                data={ANNUAL_PROJECTIONS}
                margin={{ top: 8, right: 4, bottom: 0, left: -4 }}
              >
                <CartesianGrid stroke={CHART.grid} vertical={false} />
                <XAxis
                  dataKey="year"
                  tick={AXIS_TICK}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={AXIS_TICK}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => formatNumber(Number(v), locale)}
                />
                <Tooltip
                  contentStyle={TOOLTIP_STYLE}
                  cursor={{ fill: "rgba(148, 163, 184, 0.12)" }}
                  formatter={(value) =>
                    `${formatNumber(Number(value), locale)} kt`
                  }
                />
                <Bar
                  dataKey={s.dataKey}
                  name={key === "copper" ? t("copper") : t("lithium")}
                  radius={[4, 4, 0, 0]}
                  barSize={28}
                  isAnimationActive={false}
                >
                  {ANNUAL_PROJECTIONS.map((point) => (
                    <Cell
                      key={point.year}
                      fill={s.color}
                      // Años futuros: misma tinta, atenuada (es proyección)
                      fillOpacity={point.year >= PROJECTION_FROM_YEAR ? 0.45 : 1}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            {/* Leyenda: histórico vs. proyección */}
            <div className="mt-2 flex flex-wrap gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span
                  aria-hidden
                  className="h-2.5 w-2.5 rounded-sm"
                  style={{ backgroundColor: s.color }}
                />
                {firstYear}–{PROJECTION_FROM_YEAR - 1}
              </span>
              <span className="flex items-center gap-1.5">
                <span
                  aria-hidden
                  className="h-2.5 w-2.5 rounded-sm opacity-45"
                  style={{ backgroundColor: s.color }}
                />
                {PROJECTION_FROM_YEAR}–{lastYear} · {t("projections.note")}
              </span>
            </div>
          </TabsContent>
        );
      })}
    </Tabs>
  );
}

/** Mix de generación eléctrica: áreas apiladas con leyenda. */
function EnergyChart() {
  const t = useTranslations("analytics.energy");
  const locale = useLocale();

  // Orden fijo de series (identidad de color estable, nunca reciclada)
  const series = [
    { key: "solar", label: t("solar"), color: CHART.amber },
    { key: "wind", label: t("wind"), color: CHART.teal },
    { key: "hydro", label: t("hydro"), color: CHART.indigo },
    { key: "thermal", label: t("thermal"), color: CHART.neutral },
  ] as const;

  return (
    <div>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart
          data={ENERGY_MIX}
          margin={{ top: 8, right: 4, bottom: 0, left: -12 }}
        >
          <CartesianGrid stroke={CHART.grid} vertical={false} />
          <XAxis
            dataKey="year"
            tick={AXIS_TICK}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={AXIS_TICK}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => formatNumber(Number(v), locale)}
          />
          <Tooltip
            contentStyle={TOOLTIP_STYLE}
            formatter={(value) =>
              `${formatNumber(Number(value), locale, {
                minimumFractionDigits: 1,
                maximumFractionDigits: 1,
              })} TWh`
            }
          />
          {series.map((s) => (
            <Area
              key={s.key}
              type="monotone"
              stackId="mix"
              dataKey={s.key}
              name={s.label}
              // Trazo blanco: separador visual entre segmentos apilados
              stroke="#ffffff"
              strokeWidth={1.5}
              fill={s.color}
              fillOpacity={0.9}
              isAnimationActive={false}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
      {/* Leyenda HTML propia (el ícono de Legend de Recharts usaría el trazo blanco) */}
      <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
        {series.map((s) => (
          <span key={s.key} className="flex items-center gap-1.5">
            <span
              aria-hidden
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: s.color }}
            />
            {s.label}
          </span>
        ))}
      </div>
    </div>
  );
}

/** Recorta las series mensuales al rango elegido. */
function sliceByRange<T>(data: T[], range: Range): T[] {
  if (range === "all") return data;
  return data.slice(-Number(range));
}

/** Dashboard de mercado: rango temporal compartido + 4 gráficos. */
export function MarketDashboard() {
  const t = useTranslations("analytics");
  const [range, setRange] = useState<Range>("24");

  const ranges: Array<{ value: Range; label: string }> = [
    { value: "12", label: t("range12") },
    { value: "24", label: t("range24") },
    { value: "all", label: t("rangeAll") },
  ];

  const rangeControl = (
    <div
      className="flex rounded-lg bg-muted p-1 text-sm"
      role="group"
      aria-label={t("title")}
    >
      {ranges.map((r) => (
        <button
          key={r.value}
          type="button"
          onClick={() => setRange(r.value)}
          aria-pressed={range === r.value}
          className={cn(
            "rounded-md px-3 py-1 font-medium transition-colors",
            range === r.value
              ? "bg-background text-foreground shadow"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {r.label}
        </button>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <ChartCard
        title={t("production.title")}
        subtitle={t("production.subtitle")}
        action={rangeControl}
      >
        <ProductionChart range={range} />
      </ChartCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title={t("prices.title")} subtitle={t("prices.subtitle")}>
          <PriceChart range={range} />
        </ChartCard>

        <ChartCard
          title={t("projections.title")}
          subtitle={t("projections.subtitle")}
        >
          <ProjectionChart />
        </ChartCard>
      </div>

      <ChartCard title={t("energy.title")} subtitle={t("energy.subtitle")}>
        <EnergyChart />
      </ChartCard>

      <p className="text-xs text-muted-foreground">{t("sourceNote")}</p>
    </div>
  );
}
