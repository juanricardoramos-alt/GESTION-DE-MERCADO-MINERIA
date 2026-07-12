import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { MarketDashboard } from "@/components/charts/market-dashboard";
import { viewerHasTier } from "@/lib/access";
import { PREMIUM_CONTENT_TIER } from "@/lib/constants";

export const dynamic = "force-dynamic";

type Props = { params: { locale: string } };

export async function generateMetadata({
  params: { locale },
}: Props): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "analytics" });
  return { title: t("title") };
}

export default async function AnalyticsPage({ params: { locale } }: Props) {
  setRequestLocale(locale);

  // Gate fino con tier FRESCO desde la base (el middleware ya exigió sesión;
  // el claim del JWT puede quedar atrás justo después de un upgrade).
  if (!(await viewerHasTier(PREMIUM_CONTENT_TIER))) {
    redirect(`/${locale}/membresia`);
  }

  const t = await getTranslations("analytics");

  return (
    <div className="container py-12 sm:py-16">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-3 text-muted-foreground">{t("subtitle")}</p>
      </div>
      <div className="mt-10">
        <MarketDashboard />
      </div>
    </div>
  );
}
