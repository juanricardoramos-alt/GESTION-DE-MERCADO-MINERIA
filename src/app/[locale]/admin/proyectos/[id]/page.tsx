import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { ProjectForm } from "@/components/admin/project-form";
import { getCompanyNames, getProjectById } from "@/lib/content";

export default async function AdminProjectEditPage({
  params: { locale, id },
}: {
  params: { locale: string; id: string };
}) {
  setRequestLocale(locale);
  const t = await getTranslations("admin");

  const [project, companyNames] = await Promise.all([
    id === "nuevo" ? Promise.resolve(null) : getProjectById(id),
    getCompanyNames(),
  ]);
  if (id !== "nuevo" && !project) notFound();

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">
        {project ? t("edit") : t("new")} — {t("nav.projects")}
      </h2>
      <ProjectForm project={project} companyNames={companyNames} />
    </div>
  );
}
