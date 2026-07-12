"use client";

import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePathname, useRouter } from "@/i18n/navigation";
import { SECTORS } from "@/lib/constants";
import { cn } from "@/lib/utils";

/**
 * Filtros de listado con estado en la URL (?sector=&q=&page=): compartibles
 * y navegables con atrás/adelante. Los chips usan push (entradas de
 * historial discretas); el tipeo usa replace con debounce.
 */
export function ListFilterBar({ placeholder }: { placeholder: string }) {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeSector = searchParams.get("sector") ?? "all";
  const urlQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(urlQuery);
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sincroniza el input cuando la URL cambia por atrás/adelante.
  useEffect(() => {
    setQuery(urlQuery);
  }, [urlQuery]);

  function buildParams(next: { sector?: string; q?: string }): string {
    const params = new URLSearchParams();
    const sector = next.sector ?? activeSector;
    const q = next.q ?? urlQuery;
    if (sector !== "all") params.set("sector", sector);
    if (q) params.set("q", q);
    // Cambiar filtros siempre vuelve a la página 1.
    const qs = params.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  }

  function onSectorClick(sector: string) {
    router.push(buildParams({ sector }), { scroll: false });
  }

  function onQueryChange(value: string) {
    setQuery(value);
    if (debounce.current) clearTimeout(debounce.current);
    debounce.current = setTimeout(() => {
      router.replace(buildParams({ q: value }), { scroll: false });
    }, 350);
  }

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Sector">
        {["all", ...SECTORS].map((sector) => (
          <button
            key={sector}
            type="button"
            onClick={() => onSectorClick(sector)}
            aria-pressed={activeSector === sector}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
              activeSector === sector
                ? "border-primary bg-primary text-primary-foreground"
                : "border-input bg-background text-muted-foreground hover:border-brand-300 hover:text-foreground",
            )}
          >
            {t(`sectors.${sector}`)}
          </button>
        ))}
      </div>

      <div className="relative w-full lg:w-80">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder={placeholder}
          aria-label={t("common.search")}
          className="pl-9"
        />
        {query ? (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
            aria-label={t("common.clearFilters")}
            onClick={() => onQueryChange("")}
          >
            <X className="h-4 w-4" aria-hidden />
          </Button>
        ) : null}
      </div>
    </div>
  );
}
