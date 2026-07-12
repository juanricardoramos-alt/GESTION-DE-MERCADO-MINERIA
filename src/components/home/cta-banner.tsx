import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

/** Llamado a la acción principal: membresía + boletín gratuito. */
export function CtaBanner() {
  const t = useTranslations("home.cta");

  return (
    <section className="container py-16 sm:py-20">
      <div className="flex flex-col items-center rounded-xl border bg-card px-6 py-12 text-center shadow-sm sm:px-12">
        <h2 className="max-w-2xl text-2xl font-semibold tracking-tight sm:text-3xl">
          {t("title")}
        </h2>
        <p className="mt-3 max-w-xl text-muted-foreground">{t("subtitle")}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button size="lg" asChild>
            <Link href="/membresia">
              {t("button")}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </Button>
          <Button size="lg" variant="ghost" asChild>
            <a href="#newsletter">{t("secondary")}</a>
          </Button>
        </div>
      </div>
    </section>
  );
}
