"use client";

import { useState } from "react";
import { Menu, Mountain, X } from "lucide-react";
import { useTranslations } from "next-intl";

import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { Button } from "@/components/ui/button";
import { Link, usePathname } from "@/i18n/navigation";
import { SITE } from "@/lib/constants";
import { cn } from "@/lib/utils";

/** Rutas principales del sitio (las etiquetas viven en `nav.*`). */
const NAV_ITEMS = [
  { key: "news", href: "/noticias" },
  { key: "map", href: "/mapa" },
  { key: "directory", href: "/empresas" },
  { key: "analytics", href: "/analisis" },
  { key: "reports", href: "/estudios" },
  { key: "membership", href: "/membresia" },
] as const;

export function Header() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75">
      <div className="container flex h-16 items-center justify-between gap-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2"
          onClick={() => setOpen(false)}
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-indigo-600 to-violet-600 text-white">
            <Mountain className="h-4 w-4" aria-hidden />
          </span>
          <span className="text-lg font-bold tracking-tight">
            Andes<span className="text-primary">Intel</span>
          </span>
          <span className="sr-only">{SITE.name}</span>
        </Link>

        {/* Navegación escritorio */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive(item.href)
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
              )}
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <LanguageSwitcher />
          <Button variant="ghost" size="sm" asChild>
            <Link href="/login">{t("login")}</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/registro">{t("signup")}</Link>
          </Button>
        </div>

        {/* Toggle móvil */}
        <div className="flex items-center gap-2 lg:hidden">
          <LanguageSwitcher />
          <Button
            variant="ghost"
            size="icon"
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Menú móvil */}
      {open ? (
        <nav
          className="border-t bg-background lg:hidden"
          aria-label="Main mobile"
        >
          <div className="container flex flex-col gap-1 py-3">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium",
                  isActive(item.href)
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
                )}
              >
                {t(item.key)}
              </Link>
            ))}
            <div className="mt-2 flex gap-2 border-t pt-3">
              <Button variant="outline" size="sm" className="flex-1" asChild>
                <Link href="/login" onClick={() => setOpen(false)}>
                  {t("login")}
                </Link>
              </Button>
              <Button size="sm" className="flex-1" asChild>
                <Link href="/registro" onClick={() => setOpen(false)}>
                  {t("signup")}
                </Link>
              </Button>
            </div>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
