import { ArrowRight, Lock, LockOpen } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { HScrollCarousel } from "@/components/shared/hscroll-carousel";
import { SectionHeading } from "@/components/shared/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { formatDate, pickText } from "@/lib/formatters";
import type { Report } from "@/types";

/**
 * Carrusel de estudios con portadas placeholder generadas (gradiente
 * brand→teal + título) hasta contar con imágenes reales de portada.
 */
export function StudiesCarousel({ studies }: { studies: Report[] }) {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <section className="border-y bg-slate-50/70">
      <div className="container py-16 sm:py-20">
        <SectionHeading
          title={t("home.studiesCarousel.title")}
          subtitle={t("home.studiesCarousel.subtitle")}
        />

        <div className="mt-16">
          <HScrollCarousel
            label={t("home.studiesCarousel.title")}
            prevLabel={t("home.studiesCarousel.prev")}
            nextLabel={t("home.studiesCarousel.next")}
          >
            {studies.map((study) => (
              <Link
                key={study.id}
                href="/estudios"
                className="group w-60 shrink-0 snap-start"
              >
                {/* Portada placeholder: gradiente de marca + título */}
                <div className="relative flex aspect-[3/4] flex-col justify-between overflow-hidden rounded-lg bg-gradient-to-br from-brand-600 to-teal-700 p-4 shadow-sm transition-transform group-hover:-translate-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <Badge className="border-white/25 bg-white/15 text-white hover:bg-white/15">
                      {t(`sectors.${study.sector}`)}
                    </Badge>
                    {study.premium ? (
                      <Badge className="gap-1 border-amber-300/40 bg-amber-400/90 text-amber-950 hover:bg-amber-400/90">
                        <Lock className="h-3 w-3" aria-hidden />
                        {t("reports.premium")}
                      </Badge>
                    ) : (
                      <Badge className="gap-1 border-white/25 bg-white/15 text-white hover:bg-white/15">
                        <LockOpen className="h-3 w-3" aria-hidden />
                        {t("reports.open")}
                      </Badge>
                    )}
                  </div>
                  <p className="text-lg font-semibold leading-snug text-white [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:5] overflow-hidden">
                    {pickText(study.title, locale)}
                  </p>
                </div>
                <p className="mt-2.5 text-xs text-muted-foreground">
                  {t("reports.pages", { count: study.pages })} ·{" "}
                  {formatDate(study.date, locale)}
                </p>
              </Link>
            ))}
          </HScrollCarousel>
        </div>

        <div className="mt-6 text-center">
          <Button variant="outline" asChild>
            <Link href="/estudios">
              {t("home.studiesCarousel.viewAll")}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
