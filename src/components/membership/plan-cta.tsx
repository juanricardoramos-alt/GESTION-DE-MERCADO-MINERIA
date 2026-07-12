"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

/** Acción del CTA de un plan, decidida por el servidor según el viewer. */
export type PlanAction =
  | { kind: "signup" }
  | { kind: "current" }
  | { kind: "manage" }
  | { kind: "checkout"; tier: "PROFESIONAL" | "CORPORATIVO" };

/**
 * CTA de la tarjeta de plan. El caso "checkout" llama al API de billing y
 * redirige a la página de pago hospedada de la pasarela.
 */
export function PlanCta({
  action,
  popular,
  freePlan,
}: {
  action: PlanAction;
  popular: boolean;
  freePlan: boolean;
}) {
  const t = useTranslations("membership");
  const locale = useLocale();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const variant = popular ? "default" : "outline";

  async function startCheckout(tier: "PROFESIONAL" | "CORPORATIVO") {
    setLoading(true);
    setError(null);
    const response = await fetch("/api/billing/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tier, locale }),
    }).catch(() => null);

    const data = (await response?.json().catch(() => null)) as {
      url?: string;
      error?: string;
    } | null;

    if (response?.ok && data?.url) {
      window.location.assign(data.url);
      return;
    }
    setError(
      data?.error === "payments_unconfigured"
        ? t("checkoutUnavailable")
        : t("checkoutError"),
    );
    setLoading(false);
  }

  return (
    <div className="space-y-2">
      {action.kind === "signup" ? (
        <Button className="w-full" variant={variant} asChild>
          <Link href="/registro">{freePlan ? t("ctaFree") : t("cta")}</Link>
        </Button>
      ) : null}

      {action.kind === "current" ? (
        <Button className="w-full" variant="outline" disabled>
          {t("currentPlan")}
        </Button>
      ) : null}

      {action.kind === "manage" ? (
        <Button className="w-full" variant={variant} asChild>
          <Link href="/cuenta">{t("manage")}</Link>
        </Button>
      ) : null}

      {action.kind === "checkout" ? (
        <Button
          className="w-full"
          variant={variant}
          disabled={loading}
          onClick={() => void startCheckout(action.tier)}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          ) : null}
          {t("cta")}
        </Button>
      ) : null}

      {error ? (
        <p className="text-center text-xs text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
