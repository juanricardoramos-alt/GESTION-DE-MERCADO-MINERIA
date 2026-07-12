import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { PricingCard } from "@/components/membership/pricing-card";
import { NewsletterSignup } from "@/components/shared/newsletter-signup";
import { PLANS } from "@/data/plans";

type Props = { params: { locale: string } };

export async function generateMetadata({
  params: { locale },
}: Props): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "membership" });
  return { title: t("title") };
}

export default async function MembershipPage({ params: { locale } }: Props) {
  setRequestLocale(locale);
  const t = await getTranslations("membership");

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
          <PricingCard key={plan.id} plan={plan} />
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
