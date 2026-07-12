import { getTranslations, setRequestLocale } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { requireAdmin } from "@/lib/admin/guard";

export const dynamic = "force-dynamic";

const NAV = [
  { key: "dashboard", href: "/admin" },
  { key: "articles", href: "/admin/noticias" },
  { key: "studies", href: "/admin/estudios" },
  { key: "companies", href: "/admin/empresas" },
  { key: "projects", href: "/admin/proyectos" },
] as const;

export default async function AdminLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  setRequestLocale(locale);
  // Defensa en profundidad: el middleware ya filtró por rol del JWT,
  // aquí se re-verifica con el rol fresco de la base.
  await requireAdmin();
  const t = await getTranslations("admin");

  return (
    <div className="container py-10">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-5">
        <h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>
        <nav className="flex flex-wrap gap-1" aria-label="Admin">
          {NAV.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {t(`nav.${item.key}`)}
            </Link>
          ))}
        </nav>
      </div>
      <div className="py-8">{children}</div>
    </div>
  );
}
