import { useTranslations } from "next-intl";

import { NewsCard } from "@/components/news/news-card";
import { SectionHeading } from "@/components/shared/section-heading";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import type { NewsArticle } from "@/types";

/** Selección editorial: artículos marcados como `featured` en la base. */
export function FeaturedNews({ articles }: { articles: NewsArticle[] }) {
  const t = useTranslations("home.featured");
  const tCommon = useTranslations("common");

  return (
    <section className="border-y bg-slate-50/70">
      <div className="container py-16 sm:py-20">
        <SectionHeading
          title={t("title")}
          subtitle={t("subtitle")}
          action={
            <Button variant="outline" asChild>
              <Link href="/noticias">{tCommon("viewAll")}</Link>
            </Button>
          }
        />
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {articles.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    </section>
  );
}
