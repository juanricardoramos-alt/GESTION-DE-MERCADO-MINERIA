import { FileText, Pencil, Plus } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { DeleteButton } from "@/components/admin/delete-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { deleteStudy } from "@/lib/admin/actions";
import { getStudies } from "@/lib/content";
import { formatDate, pickText } from "@/lib/formatters";

export default async function AdminStudiesPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const t = await getTranslations();
  // Panel admin: siempre sin paywall (la ruta ya exige rol ADMIN).
  const studies = await getStudies({ revealPremium: true });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{t("admin.nav.studies")}</h2>
        <Button asChild>
          <Link href="/admin/estudios/nuevo">
            <Plus className="h-4 w-4" aria-hidden />
            {t("admin.new")}
          </Link>
        </Button>
      </div>

      <ul className="divide-y rounded-lg border">
        {studies.map((study) => (
          <li
            key={study.id}
            className="flex items-center gap-3 px-4 py-3 text-sm"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">
                {pickText(study.title, locale)}
              </p>
              <p className="text-xs text-muted-foreground">
                {t(`sectors.${study.sector}`)} ·{" "}
                {formatDate(study.date, locale)} ·{" "}
                {t("reports.pages", { count: study.pages })}
              </p>
            </div>
            {study.fileUrl ? (
              <a
                href={study.fileUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="PDF"
                className="text-muted-foreground hover:text-foreground"
              >
                <FileText className="h-4 w-4" aria-hidden />
              </a>
            ) : null}
            {study.premium ? (
              <Badge
                variant="outline"
                className="border-amber-200 bg-amber-50 text-amber-700"
              >
                {t("admin.fields.premium")}
              </Badge>
            ) : null}
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/admin/estudios/${study.id}`}>
                <Pencil className="h-4 w-4" aria-hidden />
                <span className="sr-only">{t("admin.edit")}</span>
              </Link>
            </Button>
            <DeleteButton
              action={deleteStudy.bind(null, locale, study.id)}
              label={pickText(study.title, locale)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
