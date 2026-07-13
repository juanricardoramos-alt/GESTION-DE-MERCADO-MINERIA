import {
  BarChart3,
  Building2,
  FileText,
  Gavel,
  HardHat,
  Languages,
  Map,
  Newspaper,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { SectionHeading } from "@/components/shared/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

interface Offering {
  key: string;
  icon: LucideIcon;
  /** null = sin destino real todavía → badge "Próximamente", sin link. */
  href: string | null;
  /** true = el CTA alterna el idioma en vez de navegar. */
  switchesLocale?: boolean;
}

const OFFERINGS: Offering[] = [
  { key: "news", icon: Newspaper, href: "/noticias" },
  { key: "projects", icon: HardHat, href: "/mapa" },
  { key: "companies", icon: Building2, href: "/empresas" },
  { key: "people", icon: Users, href: "/empresas" },
  { key: "maps", icon: Map, href: "/mapa" },
  { key: "studies", icon: FileText, href: "/estudios" },
  { key: "analytics", icon: BarChart3, href: "/analisis" },
  { key: "tenders", icon: Gavel, href: null },
  { key: "languages", icon: Languages, href: "/", switchesLocale: true },
];

/** La sección clave de la portada: qué contiene la plataforma, en 9 tarjetas. */
export function OfferingsGrid() {
  const t = useTranslations("home.offerings");
  const locale = useLocale();
  const otherLocale = locale === "es" ? "en" : "es";

  return (
    <section className="container py-16 sm:py-20">
      <SectionHeading title={t("title")} subtitle={t("subtitle")} />

      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {OFFERINGS.map(({ key, icon: Icon, href, switchesLocale }, index) => (
          <div
            key={key}
            className={cn(
              "flex flex-col gap-3 border-border px-6 py-8",
              // Separadores verticales sutiles entre columnas
              index % 3 !== 0 && "lg:border-l",
              index % 2 === 1 && "md:max-lg:border-l",
              // Separador horizontal entre filas
              index >= 3 && "lg:border-t",
              index >= 2 && "md:max-lg:border-t",
              index >= 1 && "max-md:border-t",
            )}
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-primary">
              <Icon className="h-5 w-5" strokeWidth={1.5} aria-hidden />
            </span>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">{t(`items.${key}.title`)}</h3>
              {/* Neutro a propósito: el ámbar queda reservado para premium */}
              {href === null ? (
                <Badge variant="outline" className="text-muted-foreground">
                  {t("comingSoon")}
                </Badge>
              ) : null}
            </div>
            <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
              {t(`items.${key}.description`)}
            </p>
            {href === null ? (
              <Button variant="outline" size="sm" className="w-fit" disabled>
                {t("comingSoon")}
              </Button>
            ) : switchesLocale ? (
              <Button variant="outline" size="sm" className="w-fit" asChild>
                <Link href="/" locale={otherLocale}>
                  {t("items.languages.action")}
                </Link>
              </Button>
            ) : (
              <Button variant="outline" size="sm" className="w-fit" asChild>
                <Link href={href}>{t("viewMore")}</Link>
              </Button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
