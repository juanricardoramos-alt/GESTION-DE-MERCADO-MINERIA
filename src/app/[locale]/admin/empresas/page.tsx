import { Pencil, Plus } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { DeleteButton } from "@/components/admin/delete-button";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { deleteCompany } from "@/lib/admin/actions";
import { getCompanies } from "@/lib/content";
import { pickText } from "@/lib/formatters";

export default async function AdminCompaniesPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const t = await getTranslations();
  const companies = await getCompanies();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{t("admin.nav.companies")}</h2>
        <Button asChild>
          <Link href="/admin/empresas/nuevo">
            <Plus className="h-4 w-4" aria-hidden />
            {t("admin.new")}
          </Link>
        </Button>
      </div>

      <ul className="divide-y rounded-lg border">
        {companies.map((company) => (
          <li
            key={company.id}
            className="flex items-center gap-3 px-4 py-3 text-sm"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{company.name}</p>
              <p className="truncate text-xs text-muted-foreground">
                {pickText(company.industry, locale)} · {company.city} ·{" "}
                {company.executives.length} exec
              </p>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/admin/empresas/${company.id}`}>
                <Pencil className="h-4 w-4" aria-hidden />
                <span className="sr-only">{t("admin.edit")}</span>
              </Link>
            </Button>
            <DeleteButton
              action={deleteCompany.bind(null, locale, company.id)}
              label={company.name}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
