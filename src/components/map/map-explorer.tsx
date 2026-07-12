"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import {
  Banknote,
  Building2,
  CalendarClock,
  MapPin,
  MousePointerClick,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { SectorBadge } from "@/components/shared/sector-badge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { PROJECTS } from "@/data/projects";
import {
  PROJECT_STATUSES,
  SECTORS,
  STATUS_BADGE,
  STATUS_COLOR,
} from "@/lib/constants";
import { formatUsdM, pickText } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import type { Project, ProjectStatus, SectorId } from "@/types";

// Leaflet accede a `window`: el mapa solo se renderiza en el cliente.
const ProjectMap = dynamic(
  () => import("./project-map").then((m) => m.ProjectMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full animate-pulse items-center justify-center rounded-md bg-muted text-sm text-muted-foreground">
        …
      </div>
    ),
  },
);

const SELECT_CLASSES =
  "h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

/** Ficha del proyecto seleccionado. */
function ProjectSheet({ project }: { project: Project }) {
  const t = useTranslations();
  const locale = useLocale();

  const rows = [
    {
      icon: Building2,
      label: t("map.sheet.company"),
      value: project.company,
    },
    {
      icon: Banknote,
      label: t("map.sheet.investment"),
      value: formatUsdM(project.investmentUsdM, locale),
    },
    {
      icon: MapPin,
      label: t("map.sheet.region"),
      value: project.region,
    },
    {
      icon: CalendarClock,
      label: t("map.sheet.startYear"),
      value: String(project.startYear),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <SectorBadge sector={project.sector} />
        <Badge variant="outline" className={STATUS_BADGE[project.status]}>
          {t(`status.${project.status}`)}
        </Badge>
      </div>
      <h3 className="text-lg font-semibold leading-snug">{project.name}</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">
        {pickText(project.description, locale)}
      </p>
      <dl className="space-y-2.5 border-t pt-4 text-sm">
        {rows.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-center justify-between gap-3">
            <dt className="flex items-center gap-2 text-muted-foreground">
              <Icon className="h-4 w-4" aria-hidden />
              {label}
            </dt>
            <dd className="text-right font-medium">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/** Explorador del mapa: filtros + mapa + panel con ficha y listado. */
export function MapExplorer() {
  const t = useTranslations();

  const [sector, setSector] = useState<SectorId | "all">("all");
  const [region, setRegion] = useState<string>("all");
  const [status, setStatus] = useState<ProjectStatus | "all">("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Regiones presentes en los datos, en orden norte→sur (orden del arreglo).
  const regions = useMemo(
    () => Array.from(new Set(PROJECTS.map((p) => p.region))),
    [],
  );

  const filtered = useMemo(
    () =>
      PROJECTS.filter(
        (p) =>
          (sector === "all" || p.sector === sector) &&
          (region === "all" || p.region === region) &&
          (status === "all" || p.status === status),
      ),
    [sector, region, status],
  );

  const selected = filtered.find((p) => p.id === selectedId) ?? null;

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="flex flex-wrap items-end gap-4">
        <label className="flex flex-col gap-1.5 text-xs font-medium text-muted-foreground">
          {t("map.filterSector")}
          <select
            value={sector}
            onChange={(e) => {
              setSector(e.target.value as SectorId | "all");
              setSelectedId(null);
            }}
            className={SELECT_CLASSES}
          >
            <option value="all">{t("sectors.all")}</option>
            {SECTORS.map((s) => (
              <option key={s} value={s}>
                {t(`sectors.${s}`)}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5 text-xs font-medium text-muted-foreground">
          {t("map.filterRegion")}
          <select
            value={region}
            onChange={(e) => {
              setRegion(e.target.value);
              setSelectedId(null);
            }}
            className={SELECT_CLASSES}
          >
            <option value="all">{t("map.allRegions")}</option>
            {regions.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5 text-xs font-medium text-muted-foreground">
          {t("map.filterStatus")}
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value as ProjectStatus | "all");
              setSelectedId(null);
            }}
            className={SELECT_CLASSES}
          >
            <option value="all">{t("map.allStatuses")}</option>
            {PROJECT_STATUSES.map((s) => (
              <option key={s} value={s}>
                {t(`status.${s}`)}
              </option>
            ))}
          </select>
        </label>

        {/* Leyenda de estados */}
        <div className="ml-auto flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span className="font-medium">{t("map.legend")}:</span>
          {PROJECT_STATUSES.map((s) => (
            <span key={s} className="flex items-center gap-1.5">
              <span
                aria-hidden
                className="h-2.5 w-2.5 rounded-full ring-1 ring-black/10"
                style={{ backgroundColor: STATUS_COLOR[s] }}
              />
              {t(`status.${s}`)}
            </span>
          ))}
        </div>
      </div>

      {/* Mapa + panel lateral */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="overflow-hidden lg:col-span-2">
          <div className="h-[420px] sm:h-[560px]">
            <ProjectMap
              projects={filtered}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          </div>
        </Card>

        <div className="flex max-h-[560px] flex-col gap-4">
          <Card>
            <CardContent className="p-5">
              {selected ? (
                <ProjectSheet project={selected} />
              ) : (
                <p className="flex items-center gap-2 py-4 text-sm text-muted-foreground">
                  <MousePointerClick className="h-5 w-5 shrink-0" aria-hidden />
                  {t("map.selectHint")}
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="flex-1 overflow-hidden">
            <CardContent className="flex h-full flex-col p-0">
              <p className="border-b px-5 py-3 text-sm font-semibold">
                {t("map.projectList", { count: filtered.length })}
              </p>
              <ul className="divide-y overflow-y-auto">
                {filtered.map((p) => (
                  <li key={p.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedId(p.id)}
                      className={cn(
                        "flex w-full items-center gap-3 px-5 py-3 text-left text-sm transition-colors hover:bg-accent/60",
                        p.id === selectedId && "bg-accent",
                      )}
                    >
                      <span
                        aria-hidden
                        className="h-2.5 w-2.5 shrink-0 rounded-full ring-1 ring-black/10"
                        style={{ backgroundColor: STATUS_COLOR[p.status] }}
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-medium">
                          {p.name}
                        </span>
                        <span className="block truncate text-xs text-muted-foreground">
                          {p.region}
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
