import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { CompanyForm } from "@/components/admin/company-form";
import { getCompanyById } from "@/lib/content";

export default async function AdminCompanyEditPage({
  params: { locale, id },
}: {
  params: { locale: string; id: string };
}) {
  setRequestLocale(locale);
  const t = await getTranslations("admin");

  const company = id === "nuevo" ? null : await getCompanyById(id);
  if (id !== "nuevo" && !company) notFound();

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">
        {company ? t("edit") : t("new")} — {t("nav.companies")}
      </h2>
      <CompanyForm company={company} />
    </div>
  );
}
