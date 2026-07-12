import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { ArticleForm } from "@/components/admin/article-form";
import { getArticleById } from "@/lib/content";

/** id = "nuevo" crea; cualquier otro id edita. */
export default async function AdminArticleEditPage({
  params: { locale, id },
}: {
  params: { locale: string; id: string };
}) {
  setRequestLocale(locale);
  const t = await getTranslations("admin");

  const article = id === "nuevo" ? null : await getArticleById(id);
  if (id !== "nuevo" && !article) notFound();

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">
        {article ? t("edit") : t("new")} — {t("nav.articles")}
      </h2>
      <ArticleForm article={article} />
    </div>
  );
}
