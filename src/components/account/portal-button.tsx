"use client";

import { useState } from "react";
import { ExternalLink, Loader2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";

/** Abre el portal de autogestión de la pasarela (medios de pago, facturas, baja). */
export function PortalButton() {
  const t = useTranslations("account");
  const locale = useLocale();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function openPortal() {
    setLoading(true);
    setError(null);
    const response = await fetch("/api/billing/portal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locale }),
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
        ? t("portalUnavailable")
        : t("portalError"),
    );
    setLoading(false);
  }

  return (
    <div className="space-y-2">
      <Button onClick={() => void openPortal()} disabled={loading}>
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
        ) : (
          <ExternalLink className="h-4 w-4" aria-hidden />
        )}
        {t("manageButton")}
      </Button>
      {error ? (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
