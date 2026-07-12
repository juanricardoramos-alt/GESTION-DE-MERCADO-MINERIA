import { Pencil, Plus } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { DeleteButton } from "@/components/admin/delete-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { deleteProject } from "@/lib/admin/actions";
import { getProjects } from "@/lib/content";
import { formatUsdM } from "@/lib/formatters";

export default async function AdminProjectsPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const t = await getTranslations();
  const projects = await getProjects();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{t("admin.nav.projects")}</h2>
        <Button asChild>
          <Link href="/admin/proyectos/nuevo">
            <Plus className="h-4 w-4" aria-hidden />
            {t("admin.new")}
          </Link>
        </Button>
      </div>

      <ul className="divide-y rounded-lg border">
        {projects.map((project) => (
          <li
            key={project.id}
            className="flex items-center gap-3 px-4 py-3 text-sm"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{project.name}</p>
              <p className="truncate text-xs text-muted-foreground">
                {project.company} · {project.region} ·{" "}
                {formatUsdM(project.investmentUsdM, locale)}
              </p>
            </div>
            <Badge variant="outline">{t(`status.${project.status}`)}</Badge>
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/admin/proyectos/${project.id}`}>
                <Pencil className="h-4 w-4" aria-hidden />
                <span className="sr-only">{t("admin.edit")}</span>
              </Link>
            </Button>
            <DeleteButton
              action={deleteProject.bind(null, locale, project.id)}
              label={project.name}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
