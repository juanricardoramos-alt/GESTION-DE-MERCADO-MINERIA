import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import type { PlanAction } from "@/components/membership/plan-cta";
import { PricingCard } from "@/components/membership/pricing-card";
import { NewsletterSignup } from "@/components/shared/newsletter-signup";
import { PLANS } from "@/data/plans";
import { getViewer, type Viewer } from "@/lib/access";
import { TIER_PLAN_ID } from "@/lib/constants";

export const dynamic = "force-dynamic";

type Props = { params: { locale: string } };

export async function generateMetadata({
  params: { locale },
}: Props): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "membership" });
  return { title: t("title") };
}

/** Decide la acción del CTA de cada plan según el estado del viewer. */
function actionFor(planId: string, viewer: Viewer | null): PlanAction {
  if (!viewer) return { kind: "signup" };
  const currentPlanId = TIER_PLAN_ID[viewer.tier];
  if (planId === currentPlanId) return { kind: "current" };
  if (planId === "profesional") return { kind: "checkout", tier: "PROFESIONAL" };
  if (planId === "corporativo") return { kind: "checkout", tier: "CORPORATIVO" };
  // Volver al plan gratuito se gestiona cancelando desde el portal.
  return { kind: "manage" };
}

export default async function MembershipPage({ params: { locale } }: Props) {
  setRequestLocale(locale);
  const t = await getTranslations("membership");
  const viewer = await getViewer();

  return (
    <div className="container py-12 sm:py-16">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-3 text-muted-foreground">{t("subtitle")}</p>
      </div>

      <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-3">
        {PLANS.map((plan) => (
          <PricingCard
            key={plan.id}
            plan={plan}
            action={actionFor(plan.id, viewer)}
          />
        ))}
      </div>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        {t("note")}
      </p>

      <div className="mt-16">
        <NewsletterSignup />
      </div>
    </div>
  );
}
