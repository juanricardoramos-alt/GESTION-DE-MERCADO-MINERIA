import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { NewsCard } from "@/components/news/news-card";
import { ListFilterBar } from "@/components/shared/list-filter-bar";
import { Pagination } from "@/components/shared/pagination";
import { Link } from "@/i18n/navigation";
import { searchArticles } from "@/lib/content";
import { firstParam, listSearchParamsSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 9;

type Props = {
  params: { locale: string };
  searchParams: Record<string, string | string[] | undefined>;
};

export async function generateMetadata({
  params: { locale },
}: Props): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "news" });
  return { title: t("title") };
}

export default async function NewsPage({
  params: { locale },
  searchParams,
}: Props) {
  setRequestLocale(locale);
  const t = await getTranslations();

  // Filtros desde la URL, validados con Zod (basura → valores por defecto).
  const filters = listSearchParamsSchema.parse({
    sector: firstParam(searchParams.sector),
    q: firstParam(searchParams.q),
    page: firstParam(searchParams.page),
  });

  const result = await searchArticles({
    locale: locale === "en" ? "en" : "es",
    sector: filters.sector,
    q: filters.q,
    page: filters.page,
    pageSize: PAGE_SIZE,
  });

  const hasFilters = Boolean(filters.sector || filters.q);

  return (
    <div className="container py-12 sm:py-16">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {t("news.title")}
        </h1>
        <p className="mt-3 text-muted-foreground">{t("news.subtitle")}</p>
      </div>

      <div className="mt-10 space-y-6">
        <ListFilterBar placeholder={t("news.searchPlaceholder")} />

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{t("news.resultsCount", { count: result.total })}</span>
          {hasFilters ? (
            <Link href="/noticias" className="font-medium hover:underline">
              {t("common.clearFilters")}
            </Link>
          ) : null}
        </div>

        {result.items.length === 0 ? (
          <p className="rounded-lg border border-dashed py-16 text-center text-sm text-muted-foreground">
            {t("common.noResults")}
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {result.items.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        )}

        <Pagination
          page={result.page}
          pageCount={result.pageCount}
          basePath="/noticias"
          searchParams={{ sector: filters.sector, q: filters.q }}
        />
      </div>
    </div>
  );
}
