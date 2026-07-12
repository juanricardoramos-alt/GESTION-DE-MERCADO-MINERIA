import { setRequestLocale } from "next-intl/server";

import { CtaBanner } from "@/components/home/cta-banner";
import { FeaturedNews } from "@/components/home/featured-news";
import { Hero } from "@/components/home/hero";
import { KpiStrip } from "@/components/home/kpi-strip";
import { SectionsGrid } from "@/components/home/sections-grid";
import { NewsletterSignup } from "@/components/shared/newsletter-signup";

export default function HomePage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <KpiStrip />
      <SectionsGrid />
      <FeaturedNews />
      <CtaBanner />
      <div id="newsletter" className="container pb-16 sm:pb-20">
        <NewsletterSignup />
      </div>
    </>
  );
}
