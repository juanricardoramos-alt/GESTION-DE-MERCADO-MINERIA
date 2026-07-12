import { Check } from "lucide-react";
import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import type { Plan } from "@/types";

/** Tarjeta de plan. Nombre, descripción y features vienen de i18n. */
export function PricingCard({ plan }: { plan: Plan }) {
  const t = useTranslations("membership");
  // Las features son un arreglo en el JSON de mensajes
  const features = t.raw(`plans.${plan.id}.features`) as string[];

  return (
    <Card
      className={cn(
        "relative flex h-full flex-col",
        plan.popular && "border-primary shadow-lg ring-1 ring-primary",
      )}
    >
      {plan.popular ? (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
          {t("popular")}
        </Badge>
      ) : null}

      <CardContent className="flex flex-1 flex-col gap-5 p-6 pt-8">
        <div>
          <h3 className="text-lg font-semibold">{t(`plans.${plan.id}.name`)}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {t(`plans.${plan.id}.description`)}
          </p>
        </div>

        <p className="flex items-baseline gap-1">
          {plan.priceMonthlyUsd === 0 ? (
            <span className="text-3xl font-bold tracking-tight">
              {t("free")}
            </span>
          ) : (
            <>
              <span className="text-3xl font-bold tracking-tight tabular-nums">
                US$ {plan.priceMonthlyUsd}
              </span>
              <span className="text-sm text-muted-foreground">
                {t("perMonth")}
              </span>
            </>
          )}
        </p>

        <ul className="flex-1 space-y-2.5 border-t pt-5 text-sm">
          {features.map((feature) => (
            <li key={feature} className="flex items-start gap-2">
              <Check
                className="mt-0.5 h-4 w-4 shrink-0 text-teal-600"
                aria-hidden
              />
              {feature}
            </li>
          ))}
        </ul>

        <Button
          className="w-full"
          variant={plan.popular ? "default" : "outline"}
          asChild
        >
          <Link href="/registro">
            {plan.priceMonthlyUsd === 0 ? t("ctaFree") : t("cta")}
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
