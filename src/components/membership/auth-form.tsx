"use client";

import { useState, type FormEvent } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/** Logo de Google (los íconos de marca no vienen en lucide-react). */
function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className}>
      <path
        fill="#4285F4"
        d="M23.5 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.45a5.52 5.52 0 0 1-2.39 3.62v3h3.87c2.26-2.09 3.57-5.16 3.57-8.8Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.07 7.93-2.91l-3.87-3.01c-1.07.72-2.44 1.15-4.06 1.15-3.12 0-5.77-2.11-6.71-4.95H1.29v3.1A11.99 11.99 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.29 14.28a7.2 7.2 0 0 1 0-4.56v-3.1H1.29a12 12 0 0 0 0 10.76l4-3.1Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.77c1.76 0 3.34.6 4.58 1.79l3.44-3.44C17.95 1.19 15.23 0 12 0A11.99 11.99 0 0 0 1.29 6.62l4 3.1C6.23 6.88 8.88 4.77 12 4.77Z"
      />
    </svg>
  );
}

/**
 * Formulario real de acceso/registro: credenciales (bcrypt en el servidor)
 * y Google OAuth cuando está configurado. Tras autenticarse navega con
 * recarga completa para que el layout de servidor tome la sesión.
 */
export function AuthForm({
  mode,
  googleEnabled,
}: {
  mode: "login" | "signup";
  googleEnabled: boolean;
}) {
  const t = useTranslations("auth");
  const locale = useLocale();
  const searchParams = useSearchParams();

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const rawCallback = searchParams.get("callbackUrl");
  // Solo rutas internas: nada de redirigir a orígenes externos.
  const callbackUrl =
    rawCallback && rawCallback.startsWith("/") && !rawCallback.startsWith("//")
      ? rawCallback
      : `/${locale}`;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");

    if (mode === "signup") {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(form.get("name") ?? ""),
          company: String(form.get("company") ?? ""),
          email,
          password,
        }),
      });
      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        setError(
          data?.error === "email_taken"
            ? t("errors.emailTaken")
            : t("errors.generic"),
        );
        setLoading(false);
        return;
      }
    }

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (result?.error) {
      setError(t("errors.invalidCredentials"));
      setLoading(false);
      return;
    }
    window.location.assign(callbackUrl);
  }

  return (
    <div className="space-y-4">
      {googleEnabled ? (
        <>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => void signIn("google", { callbackUrl })}
          >
            <GoogleIcon className="h-4 w-4" />
            {t("google")}
          </Button>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" aria-hidden />
            {t("orSeparator")}
            <span className="h-px flex-1 bg-border" aria-hidden />
          </div>
        </>
      ) : null}

      {error ? (
        <p
          className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2.5 text-sm text-destructive"
          role="alert"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          {error}
        </p>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === "signup" ? (
          <>
            <label className="block space-y-1.5 text-sm font-medium">
              {t("signup.name")}
              <Input name="name" required minLength={2} autoComplete="name" />
            </label>
            <label className="block space-y-1.5 text-sm font-medium">
              {t("signup.company")}
              <Input name="company" autoComplete="organization" />
            </label>
          </>
        ) : null}

        <label className="block space-y-1.5 text-sm font-medium">
          {t(`${mode}.email`)}
          <Input type="email" name="email" required autoComplete="email" />
        </label>
        <label className="block space-y-1.5 text-sm font-medium">
          {t(`${mode}.password`)}
          <Input
            type="password"
            name="password"
            required
            minLength={8}
            maxLength={72}
            autoComplete={
              mode === "login" ? "current-password" : "new-password"
            }
          />
        </label>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          ) : null}
          {t(`${mode}.submit`)}
        </Button>
      </form>
    </div>
  );
}
