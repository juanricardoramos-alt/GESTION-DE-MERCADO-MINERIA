"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2, Mail } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/** Bloque de suscripción al boletín semanal (persiste en la base). */
export function NewsletterSignup() {
  const t = useTranslations("newsletter");
  const locale = useLocale();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [sending, setSending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim() || sending) return;
    setSending(true);
    const response = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, locale }),
    }).catch(() => null);
    setSending(false);
    if (response?.ok) setSubscribed(true);
  }

  return (
    <section className="rounded-xl bg-gradient-to-br from-brand-600 to-teal-700 px-6 py-10 text-white sm:px-10">
      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/15">
          <Mail className="h-5 w-5" aria-hidden />
        </span>
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {t("title")}
        </h2>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/85 sm:text-base">
          {t("subtitle")}
        </p>

        {subscribed ? (
          <p
            className="mt-6 flex items-center gap-2 rounded-md bg-white/15 px-4 py-3 text-sm font-medium"
            role="status"
          >
            <CheckCircle2 className="h-5 w-5 shrink-0" aria-hidden />
            {t("success")}
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-6 flex w-full max-w-md flex-col gap-3 sm:flex-row"
          >
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("placeholder")}
              aria-label={t("placeholder")}
              className="h-11 border-transparent bg-white text-slate-900 placeholder:text-slate-500"
            />
            <Button
              type="submit"
              size="lg"
              className="h-11 bg-slate-950 text-white hover:bg-slate-900"
            >
              {t("button")}
            </Button>
          </form>
        )}

        <p className="mt-4 text-xs text-white/70">{t("privacy")}</p>
      </div>
    </section>
  );
}
