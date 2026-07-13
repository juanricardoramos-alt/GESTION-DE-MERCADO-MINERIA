import { useTranslations } from "next-intl";

import { PricingCard } from "@/components/membership/pricing-card";
import { SectionHeading } from "@/components/shared/section-heading";
import { PLANS } from "@/data/plans";
import type { Viewer } from "@/lib/access";
import { actionForPlan } from "@/lib/plan-actions";

/** Los tres planes de membresía en la portada (el popular resaltado). */
export function PlansSection({ viewer }: { viewer: Viewer | null }) {
  const t = useTranslations("membership");

  return (
    <section className="border-t bg-slate-50/70">
      <div className="container py-16 sm:py-20">
        <SectionHeading title={t("title")} subtitle={t("subtitle")} />
        <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-3">
          {PLANS.map((plan) => (
            <PricingCard
              key={plan.id}
              plan={plan}
              action={actionForPlan(plan.id, viewer)}
            />
          ))}
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          {t("note")}
        </p>
      </div>
    </section>
  );
}
