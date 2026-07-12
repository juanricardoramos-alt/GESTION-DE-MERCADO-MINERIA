"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { CompanyCard } from "@/components/directory/company-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SECTORS } from "@/lib/constants";
import { pickText } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import type { Company, SectorId } from "@/types";

type SectorFilter = SectorId | "all";

/** Directorio buscable de empresas, filtrable por sector. */
export function CompanyDirectory({ companies }: { companies: Company[] }) {
  const t = useTranslations();
  const locale = useLocale();

  const [sector, setSector] = useState<SectorFilter>("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return companies.filter((company) => {
      if (sector !== "all" && !company.sectors.includes(sector)) return false;
      if (!term) return true;
      const haystack = [
        company.name,
        company.city,
        pickText(company.industry, locale),
        pickText(company.description, locale),
        ...company.services.map((s) => pickText(s, locale)),
        ...company.executives.map((e) => e.name),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(term);
    });
  }, [companies, sector, query, locale]);

  const hasFilters = sector !== "all" || query.trim() !== "";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Sector">
          {(["all", ...SECTORS] as SectorFilter[]).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSector(s)}
              aria-pressed={sector === s}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                sector === s
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-input bg-background text-muted-foreground hover:border-brand-300 hover:text-foreground",
              )}
            >
              {t(`sectors.${s}`)}
            </button>
          ))}
        </div>

        <div className="relative w-full lg:w-80">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("directory.searchPlaceholder")}
            aria-label={t("common.search")}
            className="pl-9"
          />
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>{t("directory.resultsCount", { count: filtered.length })}</span>
        {hasFilters ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSector("all");
              setQuery("");
            }}
          >
            <X className="h-4 w-4" aria-hidden />
            {t("common.clearFilters")}
          </Button>
        ) : null}
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-lg border border-dashed p-10 text-center text-muted-foreground">
          {t("common.noResults")}
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>
      )}
    </div>
  );
}
