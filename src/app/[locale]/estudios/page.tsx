import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { ReportCard } from "@/components/reports/report-card";
import { viewerHasTier } from "@/lib/access";
import { getStudies } from "@/lib/content";
import { PREMIUM_CONTENT_TIER } from "@/lib/constants";

export const dynamic = "force-dynamic";

type Props = { params: { locale: string } };

export async function generateMetadata({
  params: { locale },
}: Props): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "reports" });
  return { title: t("title") };
}

export default async function ReportsPage({ params: { locale } }: Props) {
  setRequestLocale(locale);
  const t = await getTranslations("reports");
  // La autorización se decide aquí, en el servidor: si el usuario no tiene
  // el plan requerido, los resúmenes premium nunca salen hacia el cliente.
  const revealPremium = await viewerHasTier(PREMIUM_CONTENT_TIER);
  const studies = await getStudies({ revealPremium });

  return (
    <div className="container py-12 sm:py-16">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-3 text-muted-foreground">{t("subtitle")}</p>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {studies.map((report) => (
          <ReportCard key={report.id} report={report} />
        ))}
      </div>
    </div>
  );
}
