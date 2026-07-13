"use client";

import { useState } from "react";
import { LogOut, Menu, Mountain, UserRound, X } from "lucide-react";
import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";

import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { LinkedinIcon } from "@/components/shared/social-icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { SITE, TIER_PLAN_ID } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { SessionUser } from "@/types";

/** Anclas de la portada que usa la navegación derecha. */
const NAV_ANCHORS = [
  { key: "team", href: "/#equipo" },
  { key: "contact", href: "/#contacto" },
] as const;

const NAV_LINK_CLASSES =
  "rounded-md px-3 py-2 text-sm font-medium text-white/70 transition-colors hover:text-white";

/** Sesión iniciada: plan + nombre + salir. Anónimo: botón Ingresar. */
function AuthActions({
  user,
  compact,
  onNavigate,
}: {
  user: SessionUser | null;
  compact?: boolean;
  onNavigate?: () => void;
}) {
  const t = useTranslations();

  if (user) {
    return (
      <>
        <Badge
          variant="outline"
          className="max-w-40 gap-1.5 border-white/20 bg-white/5"
        >
          <span className="truncate font-normal text-white/70">
            {user.name ?? user.email}
          </span>
          <span className="text-brand-300">
            {t(`membership.plans.${TIER_PLAN_ID[user.tier]}.name`)}
          </span>
        </Badge>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "text-white/80 hover:bg-white/10 hover:text-white",
            compact && "flex-1",
          )}
          onClick={() => void signOut({ callbackUrl: "/" })}
        >
          <LogOut className="h-4 w-4" aria-hidden />
          {t("nav.signOut")}
        </Button>
      </>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className={cn(
        "border-white/25 bg-transparent text-white hover:bg-white/10 hover:text-white",
        compact && "flex-1",
      )}
      asChild
    >
      <Link href="/login" onClick={onNavigate}>
        <UserRound className="h-4 w-4" aria-hidden />
        {t("header.signIn")}
      </Link>
    </Button>
  );
}

/** Ítem "Brochure": sin destino real aún, se muestra deshabilitado. */
function BrochureItem() {
  const t = useTranslations("header");
  return (
    <span
      className="flex cursor-not-allowed items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-white/40"
      title={t("comingSoon")}
      aria-disabled
    >
      {t("brochure")}
      <Badge
        variant="outline"
        className="border-white/20 px-1.5 py-0 text-[10px] font-normal text-white/50"
      >
        {t("comingSoon")}
      </Badge>
    </span>
  );
}

/**
 * Header oscuro semi-transparente con blur, pensado para flotar sobre el
 * hero de la portada (que se desplaza -mt-16 por debajo).
 */
export function Header({ user }: { user: SessionUser | null }) {
  const t = useTranslations();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-slate-950/75 text-white backdrop-blur supports-[backdrop-filter]:bg-slate-950/60">
      <div className="container flex h-16 items-center justify-between gap-3">
        {/* Izquierda: logo + LinkedIn */}
        <div className="flex min-w-0 items-center gap-2">
          <Link
            href="/"
            className="flex items-center gap-2"
            onClick={() => setOpen(false)}
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-brand-600 text-white">
              <Mountain className="h-4 w-4" aria-hidden />
            </span>
            <span className="truncate text-lg font-bold tracking-tight">
              {t("brand.leading")}{" "}
              <span className="text-brand-300">{t("brand.accent")}</span>
            </span>
          </Link>
          <a
            href={SITE.linkedin}
            target="_blank"
            rel="noreferrer"
            aria-label={t("header.linkedinAria")}
            className="hidden rounded-md p-1.5 text-white/60 transition-colors hover:text-white sm:block"
          >
            <LinkedinIcon className="h-4 w-4" />
          </a>
        </div>

        {/* Centro: CTA de demo */}
        <div className="hidden flex-1 justify-center lg:flex">
          <Button asChild>
            <Link href="/#contacto">{t("header.demo")}</Link>
          </Button>
        </div>

        {/* Derecha: nav + idioma + sesión */}
        <div className="hidden items-center gap-1 lg:flex">
          <nav className="flex items-center" aria-label="Main">
            {NAV_ANCHORS.map((item) => (
              <Link key={item.key} href={item.href} className={NAV_LINK_CLASSES}>
                {t(`header.${item.key}`)}
              </Link>
            ))}
            <BrochureItem />
          </nav>
          <LanguageSwitcher variant="dark" />
          <div className="ml-2 flex items-center gap-2">
            <AuthActions user={user} />
          </div>
        </div>

        {/* Toggle móvil */}
        <div className="flex items-center gap-2 lg:hidden">
          <LanguageSwitcher variant="dark" />
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10 hover:text-white"
            aria-expanded={open}
            aria-label={open ? t("header.closeMenu") : t("header.openMenu")}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Menú móvil */}
      {open ? (
        <nav
          className="border-t border-white/10 bg-slate-950 lg:hidden"
          aria-label="Main mobile"
        >
          <div className="container flex flex-col gap-1 py-4">
            <Button asChild className="mb-2">
              <Link href="/#contacto" onClick={() => setOpen(false)}>
                {t("header.demo")}
              </Link>
            </Button>
            {NAV_ANCHORS.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                onClick={() => setOpen(false)}
                className={NAV_LINK_CLASSES}
              >
                {t(`header.${item.key}`)}
              </Link>
            ))}
            <BrochureItem />
            <a
              href={SITE.linkedin}
              target="_blank"
              rel="noreferrer"
              className={NAV_LINK_CLASSES}
            >
              LinkedIn
            </a>
            <div className="mt-2 flex flex-wrap items-center gap-2 border-t border-white/10 pt-3">
              <AuthActions user={user} compact onNavigate={() => setOpen(false)} />
            </div>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
