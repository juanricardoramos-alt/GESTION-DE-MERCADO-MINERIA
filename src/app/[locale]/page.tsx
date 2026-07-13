import { setRequestLocale } from "next-intl/server";

import { AboutSection } from "@/components/home/about-section";
import { ContactSection } from "@/components/home/contact-section";
import { FeaturedNews } from "@/components/home/featured-news";
import { HeroCarousel } from "@/components/home/hero-carousel";
import { KpiStrip } from "@/components/home/kpi-strip";
import { OfferingsGrid } from "@/components/home/offerings-grid";
import { PlansSection } from "@/components/home/plans-section";
import { StudiesCarousel } from "@/components/home/studies-carousel";
import { TeamCarousel } from "@/components/home/team-carousel";
import { NewsletterSignup } from "@/components/shared/newsletter-signup";
import { getViewer, tierSatisfies } from "@/lib/access";
import { PREMIUM_CONTENT_TIER } from "@/lib/constants";
import {
  getFeaturedArticles,
  getPortfolioStats,
  getStudies,
  getTopProjects,
} from "@/lib/content";

// El contenido vive en Postgres: render dinámico para reflejar cambios al instante.
export const dynamic = "force-dynamic";

/*
 * Nota: por decisión de marca NO se incluye sección de logos de clientes
 * ni conferencias (sin derechos de uso). Si en el futuro se agrega, va aquí
 * entre PlansSection y TeamCarousel.
 */
export default async function HomePage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);

  const viewer = await getViewer();
  const revealPremium =
    viewer !== null &&
    (viewer.role === "ADMIN" || tierSatisfies(viewer.tier, PREMIUM_CONTENT_TIER));

  const [featured, portfolio, studies, topProjects] = await Promise.all([
    getFeaturedArticles(3),
    getPortfolioStats(),
    getStudies({ revealPremium }),
    getTopProjects(8),
  ]);

  return (
    <>
      <HeroCarousel />
      <KpiStrip
        portfolioUsdM={portfolio.totalInvestmentUsdM}
        projectCount={portfolio.projectCount}
      />
      <AboutSection projects={topProjects} />
      <OfferingsGrid />
      <StudiesCarousel studies={studies} />
      <FeaturedNews articles={featured} />
      <PlansSection viewer={viewer} />
      <TeamCarousel />
      <ContactSection />
      <div id="newsletter" className="container py-16 sm:py-20">
        <NewsletterSignup />
      </div>
    </>
  );
}
