import { Clock, ExternalLink, Lock, Rss } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { SectorBadge } from "@/components/shared/sector-badge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate, pickText } from "@/lib/formatters";
import type { NewsArticle } from "@/types";

/**
 * Tarjeta de artículo. Las noticias agregadas por RSS muestran la fuente de
 * forma visible y el click abre SIEMPRE el artículo original en pestaña
 * nueva (somos agregador: no existe página de detalle propia ni se guarda
 * el cuerpo del artículo).
 */
export function NewsCard({ article }: { article: NewsArticle }) {
  const locale = useLocale();
  const t = useTranslations("common");
  const tNews = useTranslations("news");

  const body = (
    <Card className="group flex h-full flex-col transition-shadow hover:shadow-md">
      {article.isExternal && article.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={article.imageUrl}
          alt=""
          loading="lazy"
          referrerPolicy="no-referrer"
          className="h-36 w-full rounded-t-lg border-b object-cover"
        />
      ) : null}
      <CardContent className="flex flex-1 flex-col gap-3 p-6">
        <div className="flex flex-wrap items-center gap-2">
          <SectorBadge sector={article.sector} />
          {article.isExternal ? (
            <Badge
              variant="outline"
              className="gap-1 border-teal-200 bg-teal-50 text-teal-700"
            >
              <Rss className="h-3 w-3" aria-hidden />
              {article.sourceName}
            </Badge>
          ) : null}
          {article.premium ? (
            <Badge
              variant="outline"
              className="border-amber-200 bg-amber-50 text-amber-700"
            >
              <Lock className="h-3 w-3" aria-hidden />
              {t("membersOnly")}
            </Badge>
          ) : null}
        </div>

        <h3 className="text-base font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
          {pickText(article.title, locale)}
          {article.isExternal ? (
            <ExternalLink
              className="ml-1.5 inline h-3.5 w-3.5 align-baseline text-muted-foreground"
              aria-hidden
            />
          ) : null}
        </h3>

        <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
          {article.isExternal
            ? (article.summary ?? pickText(article.excerpt, locale))
            : pickText(article.excerpt, locale)}
        </p>

        <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 pt-2 text-xs text-muted-foreground">
          <time dateTime={article.date}>{formatDate(article.date, locale)}</time>
          <span aria-hidden>·</span>
          <span>{article.sourceName}</span>
          {article.isExternal ? null : (
            <>
              <span aria-hidden>·</span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3 w-3" aria-hidden />
                {t("minRead", { minutes: article.readingMinutes })}
              </span>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (article.isExternal && article.originalUrl) {
    return (
      <a
        href={article.originalUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={tNews("externalAria", { source: article.sourceName })}
        className="block h-full"
      >
        {body}
      </a>
    );
  }
  return body;
}
