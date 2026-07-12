import { ArrowRight, MapPinned, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

export function Hero() {
  const t = useTranslations("home.hero");

  return (
    <section className="relative overflow-hidden border-b bg-gradient-to-b from-brand-50/80 via-background to-background">
      {/* Retícula decorativa sutil */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(79,70,229,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(79,70,229,0.06)_1px,transparent_1px)] bg-[size:48px_48px]"
      />
      <div className="container relative flex flex-col items-center py-20 text-center sm:py-28">
        <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white px-4 py-1.5 text-xs font-medium text-brand-700 shadow-sm">
          <Sparkles className="h-3.5 w-3.5" aria-hidden />
          {t("badge")}
        </span>

        <h1 className="max-w-4xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          {t("title")}
        </h1>
        <p className="mt-4 max-w-3xl text-lg font-medium text-primary sm:text-xl">
          {t("titleHighlight")}
        </p>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          {t("subtitle")}
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button size="lg" asChild>
            <Link href="/membresia">
              {t("ctaPrimary")}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/mapa">
              <MapPinned className="h-4 w-4" aria-hidden />
              {t("ctaSecondary")}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
