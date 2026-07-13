"use client";

import { useLocale } from "next-intl";
import { useParams } from "next/navigation";

import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

/** Selector ES/EN: reemplaza el locale conservando la ruta actual. */
export function LanguageSwitcher({
  variant = "light",
}: {
  /** "dark" para superficies oscuras (header sobre el hero). */
  variant?: "light" | "dark";
}) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  function switchTo(next: Locale) {
    if (next === locale) return;
    // @ts-expect-error -- params es compatible con la ruta activa
    router.replace({ pathname, params }, { locale: next });
  }

  return (
    <div
      className={cn(
        "flex items-center rounded-md border p-0.5 text-xs font-semibold",
        variant === "dark"
          ? "border-white/20 bg-white/5"
          : "border-border bg-background",
      )}
      role="group"
      aria-label="Language"
    >
      {routing.locales.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => switchTo(l)}
          aria-pressed={l === locale}
          className={cn(
            "rounded px-2 py-1 uppercase transition-colors",
            l === locale
              ? "bg-primary text-primary-foreground"
              : variant === "dark"
                ? "text-white/70 hover:text-white"
                : "text-muted-foreground hover:text-foreground",
          )}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
