import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { NewsExplorer } from "@/components/news/news-explorer";

type Props = { params: { locale: string } };

export async function generateMetadata({
  params: { locale },
}: Props): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "news" });
  return { title: t("title") };
}

export default async function NewsPage({ params: { locale } }: Props) {
  setRequestLocale(locale);
  const t = await getTranslations("news");

  return (
    <div className="container py-12 sm:py-16">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-3 text-muted-foreground">{t("subtitle")}</p>
      </div>
      <div className="mt-10">
        <NewsExplorer />
      </div>
    </div>
  );
}
