import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { StudyForm } from "@/components/admin/study-form";
import { getStudyByIdAdmin } from "@/lib/content";

export default async function AdminStudyEditPage({
  params: { locale, id },
}: {
  params: { locale: string; id: string };
}) {
  setRequestLocale(locale);
  const t = await getTranslations("admin");

  const study = id === "nuevo" ? null : await getStudyByIdAdmin(id);
  if (id !== "nuevo" && !study) notFound();

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">
        {study ? t("edit") : t("new")} — {t("nav.studies")}
      </h2>
      <StudyForm study={study} />
    </div>
  );
}
