import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  CalendarDays,
  Check,
  Globe,
  Mail,
  MapPin,
  Phone,
  Users,
} from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { SectorBadge } from "@/components/shared/sector-badge";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { COMPANIES } from "@/data/companies";
import { PROJECTS } from "@/data/projects";
import { Link } from "@/i18n/navigation";
import { STATUS_BADGE } from "@/lib/constants";
import { formatUsdM, pickText } from "@/lib/formatters";
import { cn, getAvatarColor, getInitials } from "@/lib/utils";

type Props = { params: { locale: string; slug: string } };

export function generateStaticParams() {
  return COMPANIES.map((company) => ({ slug: company.slug }));
}

export async function generateMetadata({
  params: { slug },
}: Props): Promise<Metadata> {
  const company = COMPANIES.find((c) => c.slug === slug);
  return { title: company?.name ?? "—" };
}

export default async function CompanyProfilePage({
  params: { locale, slug },
}: Props) {
  setRequestLocale(locale);
  const t = await getTranslations("directory");
  const tStatus = await getTranslations("status");

  const company = COMPANIES.find((c) => c.slug === slug);
  if (!company) notFound();

  const relatedProjects = PROJECTS.filter((p) => p.company === company.name);

  return (
    <div className="container py-12 sm:py-16">
      <Link
        href="/empresas"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        {t("back")}
      </Link>

      {/* Encabezado del perfil */}
      <div className="mt-6 flex flex-col gap-6 rounded-xl border bg-card p-6 shadow-sm sm:flex-row sm:items-start sm:p-8">
        <span
          className={cn(
            "flex h-16 w-16 shrink-0 items-center justify-center rounded-xl text-xl font-bold text-white",
            getAvatarColor(company.name),
          )}
        >
          {getInitials(company.name)}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {company.name}
            </h1>
            {company.sectors.map((s) => (
              <SectorBadge key={s} sector={s} />
            ))}
          </div>
          <p className="mt-1 font-medium text-primary">
            {pickText(company.industry, locale)}
          </p>
          <p className="mt-3 max-w-3xl leading-relaxed text-muted-foreground">
            {pickText(company.description, locale)}
          </p>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" aria-hidden />
              {company.city}
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="h-4 w-4" aria-hidden />
              {t("employees")}: {company.employees}
            </span>
            <span className="flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4" aria-hidden />
              {t("founded")}: {company.founded}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Columna principal */}
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>{t("servicesTitle")}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid gap-2.5 sm:grid-cols-2">
                {company.services.map((service) => (
                  <li
                    key={service.es}
                    className="flex items-start gap-2 text-sm"
                  >
                    <Check
                      className="mt-0.5 h-4 w-4 shrink-0 text-teal-600"
                      aria-hidden
                    />
                    {pickText(service, locale)}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("executivesTitle")}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid gap-4 sm:grid-cols-2">
                {company.executives.map((executive) => (
                  <li
                    key={executive.email}
                    className="flex items-start gap-3 rounded-lg border p-4"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-50 text-sm font-semibold text-primary">
                      {getInitials(executive.name)}
                    </span>
                    <div className="min-w-0">
                      <p className="font-medium leading-snug">
                        {executive.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {pickText(executive.role, locale)}
                      </p>
                      <a
                        href={`mailto:${executive.email}`}
                        className="mt-1 block truncate text-xs text-primary hover:underline"
                      >
                        {executive.email}
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {relatedProjects.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>{t("projectsTitle")}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="divide-y">
                  {relatedProjects.map((project) => (
                    <li
                      key={project.id}
                      className="flex flex-wrap items-center justify-between gap-2 py-3 first:pt-0 last:pb-0"
                    >
                      <div className="min-w-0">
                        <p className="font-medium leading-snug">
                          {project.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {project.region} · {project.startYear}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge
                          variant="outline"
                          className={STATUS_BADGE[project.status]}
                        >
                          {tStatus(project.status)}
                        </Badge>
                        <span className="text-sm font-medium tabular-nums">
                          {formatUsdM(project.investmentUsdM, locale)}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ) : null}
        </div>

        {/* Columna lateral: contacto */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>{t("contactTitle")}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2.5">
                  <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <a
                    href={`mailto:${company.email}`}
                    className="truncate text-primary hover:underline"
                  >
                    {company.email}
                  </a>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone className="h-4 w-4 shrink-0 text-muted-foreground" />
                  {company.phone}
                </li>
                <li className="flex items-center gap-2.5">
                  <Globe className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noreferrer"
                    className="truncate text-primary hover:underline"
                  >
                    {company.website.replace("https://", "")}
                  </a>
                </li>
                <li className="flex items-center gap-2.5">
                  <Building2 className="h-4 w-4 shrink-0 text-muted-foreground" />
                  {company.city}
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
