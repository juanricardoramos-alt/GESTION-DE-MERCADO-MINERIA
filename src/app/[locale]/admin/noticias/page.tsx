import { Pencil, Plus } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { DeleteButton } from "@/components/admin/delete-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { deleteArticle } from "@/lib/admin/actions";
import { getArticles } from "@/lib/content";
import { formatDate, pickText } from "@/lib/formatters";

export default async function AdminArticlesPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const t = await getTranslations();
  const articles = await getArticles();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{t("admin.nav.articles")}</h2>
        <Button asChild>
          <Link href="/admin/noticias/nuevo">
            <Plus className="h-4 w-4" aria-hidden />
            {t("admin.new")}
          </Link>
        </Button>
      </div>

      <ul className="divide-y rounded-lg border">
        {articles.map((article) => (
          <li
            key={article.id}
            className="flex items-center gap-3 px-4 py-3 text-sm"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">
                {pickText(article.title, locale)}
              </p>
              <p className="text-xs text-muted-foreground">
                {t(`sectors.${article.sector}`)} ·{" "}
                {formatDate(article.date, locale)} · {article.source}
              </p>
            </div>
            {article.featured ? (
              <Badge variant="outline">{t("admin.fields.featured")}</Badge>
            ) : null}
            {article.premium ? (
              <Badge
                variant="outline"
                className="border-amber-200 bg-amber-50 text-amber-700"
              >
                {t("admin.fields.premium")}
              </Badge>
            ) : null}
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/admin/noticias/${article.id}`}>
                <Pencil className="h-4 w-4" aria-hidden />
                <span className="sr-only">{t("admin.edit")}</span>
              </Link>
            </Button>
            <DeleteButton
              action={deleteArticle.bind(null, locale, article.id)}
              label={pickText(article.title, locale)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
