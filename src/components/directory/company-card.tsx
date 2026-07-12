import { ArrowRight, MapPin, Users } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { SectorBadge } from "@/components/shared/sector-badge";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import { pickText } from "@/lib/formatters";
import { getInitials } from "@/lib/utils";
import type { Company } from "@/types";

export function CompanyCard({ company }: { company: Company }) {
  const locale = useLocale();
  const t = useTranslations("directory");

  return (
    <Link href={`/empresas/${company.slug}`} className="group block h-full">
      <Card className="h-full transition-all hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md">
        <CardContent className="flex h-full flex-col gap-3 p-6">
          <div className="flex items-start justify-between gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 text-sm font-bold text-white">
              {getInitials(company.name)}
            </span>
            <div className="flex flex-wrap justify-end gap-1.5">
              {company.sectors.map((s) => (
                <SectorBadge key={s} sector={s} />
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold leading-snug transition-colors group-hover:text-primary">
              {company.name}
            </h3>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {pickText(company.industry, locale)}
            </p>
          </div>

          <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {pickText(company.description, locale)}
          </p>

          <div className="mt-auto flex items-center justify-between border-t pt-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" aria-hidden />
                {company.city}
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" aria-hidden />
                {company.employees}
              </span>
            </span>
            <span className="flex items-center gap-1 font-medium text-primary">
              {t("viewProfile")}
              <ArrowRight
                className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                aria-hidden
              />
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
