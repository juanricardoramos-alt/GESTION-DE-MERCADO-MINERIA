import { getTranslations, setRequestLocale } from "next-intl/server";

import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import { prisma } from "@/lib/db";

export default async function AdminDashboardPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const t = await getTranslations("admin");

  const [articles, studies, companies, projects, subscribers, users] =
    await Promise.all([
      prisma.article.count(),
      prisma.study.count(),
      prisma.company.count(),
      prisma.project.count(),
      prisma.newsletterSubscriber.count(),
      prisma.user.count(),
    ]);

  const cards = [
    { label: t("nav.articles"), count: articles, href: "/admin/noticias" },
    { label: t("nav.studies"), count: studies, href: "/admin/estudios" },
    { label: t("nav.companies"), count: companies, href: "/admin/empresas" },
    { label: t("nav.projects"), count: projects, href: "/admin/proyectos" },
  ];

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Link key={card.href} href={card.href} className="group">
            <Card className="transition-all group-hover:-translate-y-0.5 group-hover:border-brand-200 group-hover:shadow-md">
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground">{card.label}</p>
                <p className="mt-1 text-3xl font-semibold tabular-nums">
                  {card.count}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <p className="text-sm text-muted-foreground">
        {t("stats", { subscribers, users })}
      </p>
    </div>
  );
}
