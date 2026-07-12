import { setRequestLocale } from "next-intl/server";

import { CtaBanner } from "@/components/home/cta-banner";
import { FeaturedNews } from "@/components/home/featured-news";
import { Hero } from "@/components/home/hero";
import { KpiStrip } from "@/components/home/kpi-strip";
import { SectionsGrid } from "@/components/home/sections-grid";
import { NewsletterSignup } from "@/components/shared/newsletter-signup";
import { getFeaturedArticles, getPortfolioStats } from "@/lib/content";

// El contenido vive en Postgres: render dinámico para reflejar cambios al instante.
export const dynamic = "force-dynamic";

export default async function HomePage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);

  const [featured, portfolio] = await Promise.all([
    getFeaturedArticles(3),
    getPortfolioStats(),
  ]);

  return (
    <>
      <Hero />
      <KpiStrip
        portfolioUsdM={portfolio.totalInvestmentUsdM}
        projectCount={portfolio.projectCount}
      />
      <SectionsGrid />
      <FeaturedNews articles={featured} />
      <CtaBanner />
      <div id="newsletter" className="container pb-16 sm:pb-20">
        <NewsletterSignup />
      </div>
    </>
  );
}
