import { Clock, Lock } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { SectorBadge } from "@/components/shared/sector-badge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate, pickText } from "@/lib/formatters";
import type { NewsArticle } from "@/types";

/** Tarjeta de artículo para el feed de noticias y la portada. */
export function NewsCard({ article }: { article: NewsArticle }) {
  const locale = useLocale();
  const t = useTranslations("common");

  return (
    <Card className="group flex h-full flex-col transition-shadow hover:shadow-md">
      <CardContent className="flex flex-1 flex-col gap-3 p-6">
        <div className="flex flex-wrap items-center gap-2">
          <SectorBadge sector={article.sector} />
          {article.premium ? (
            <Badge
              variant="outline"
              className="border-violet-200 bg-violet-50 text-violet-700"
            >
              <Lock className="h-3 w-3" aria-hidden />
              {t("membersOnly")}
            </Badge>
          ) : null}
        </div>

        <h3 className="text-base font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
          {pickText(article.title, locale)}
        </h3>

        <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
          {pickText(article.excerpt, locale)}
        </p>

        <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 pt-2 text-xs text-muted-foreground">
          <time dateTime={article.date}>{formatDate(article.date, locale)}</time>
          <span aria-hidden>·</span>
          <span>{article.source}</span>
          <span aria-hidden>·</span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3 w-3" aria-hidden />
            {t("minRead", { minutes: article.readingMinutes })}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
