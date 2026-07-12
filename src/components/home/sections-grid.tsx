import {
  ArrowRight,
  BarChart3,
  Building2,
  FileText,
  Map,
  Newspaper,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { SectionHeading } from "@/components/shared/section-heading";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";

const MODULES = [
  { key: "news", href: "/noticias", icon: Newspaper },
  { key: "map", href: "/mapa", icon: Map },
  { key: "directory", href: "/empresas", icon: Building2 },
  { key: "analytics", href: "/analisis", icon: BarChart3 },
  { key: "reports", href: "/estudios", icon: FileText },
] as const;

/** Resumen de los módulos de la plataforma, con enlace a cada sección. */
export function SectionsGrid() {
  const t = useTranslations("home.sections");

  return (
    <section className="container py-16 sm:py-20">
      <SectionHeading title={t("title")} subtitle={t("subtitle")} />

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MODULES.map(({ key, href, icon: Icon }) => (
          <Link key={key} href={href} className="group">
            <Card className="h-full transition-all hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md">
              <CardContent className="flex h-full flex-col gap-3 p-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-primary">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="font-semibold text-foreground">
                  {t(`${key}.title`)}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {t(`${key}.description`)}
                </p>
                <span className="mt-auto inline-flex items-center gap-1 pt-1 text-sm font-medium text-primary">
                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
