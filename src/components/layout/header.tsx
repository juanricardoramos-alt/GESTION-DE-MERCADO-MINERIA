"use client";

import { useState } from "react";
import { LogOut, Menu, Mountain, X } from "lucide-react";
import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";

import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link, usePathname } from "@/i18n/navigation";
import { TIER_PLAN_ID } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { SessionUser } from "@/types";

/** Rutas principales del sitio (las etiquetas viven en `nav.*`). */
const NAV_ITEMS = [
  { key: "news", href: "/noticias" },
  { key: "map", href: "/mapa" },
  { key: "directory", href: "/empresas" },
  { key: "analytics", href: "/analisis" },
  { key: "reports", href: "/estudios" },
  { key: "membership", href: "/membresia" },
] as const;

/** Sesión iniciada: plan + nombre + salir. Anónimo: entrar / crear cuenta. */
function AuthActions({
  user,
  compact,
  onNavigate,
}: {
  user: SessionUser | null;
  compact?: boolean;
  onNavigate?: () => void;
}) {
  const t = useTranslations("nav");
  const tPlans = useTranslations("membership.plans");

  if (user) {
    return (
      <>
        <Badge variant="outline" className="max-w-40 gap-1.5">
          <span className="truncate font-normal text-muted-foreground">
            {user.name ?? user.email}
          </span>
          <span className="text-brand-700">
            {tPlans(`${TIER_PLAN_ID[user.tier]}.name`)}
          </span>
        </Badge>
        <Button
          variant={compact ? "outline" : "ghost"}
          size="sm"
          className={compact ? "flex-1" : undefined}
          onClick={() => void signOut({ callbackUrl: "/" })}
        >
          <LogOut className="h-4 w-4" aria-hidden />
          {t("signOut")}
        </Button>
      </>
    );
  }

  return (
    <>
      <Button
        variant={compact ? "outline" : "ghost"}
        size="sm"
        className={compact ? "flex-1" : undefined}
        asChild
      >
        <Link href="/login" onClick={onNavigate}>
          {t("login")}
        </Link>
      </Button>
      <Button size="sm" className={compact ? "flex-1" : undefined} asChild>
        <Link href="/registro" onClick={onNavigate}>
          {t("signup")}
        </Link>
      </Button>
    </>
  );
}

export function Header({ user }: { user: SessionUser | null }) {
  const t = useTranslations("nav");
  const tBrand = useTranslations("brand");
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
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-600 text-white">
            <Mountain className="h-4 w-4" aria-hidden />
          </span>
          <span className="text-lg font-bold tracking-tight">
            {tBrand("leading")}{" "}
            <span className="text-primary">{tBrand("accent")}</span>
          </span>
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
          <AuthActions user={user} />
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
            <div className="mt-2 flex flex-wrap items-center gap-2 border-t pt-3">
              <AuthActions user={user} compact onNavigate={() => setOpen(false)} />
            </div>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
