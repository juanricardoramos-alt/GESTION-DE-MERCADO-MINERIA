"use client";

import { useState, type FormEvent } from "react";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CONTACT_TOPICS } from "@/lib/constants";
import { isValidRut } from "@/lib/validation";

const INPUT_CLASSES =
  "border-transparent bg-white text-slate-900 placeholder:text-slate-500";

function LeadField({
  label,
  optional,
  children,
}: {
  label: string;
  optional?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5 text-sm font-medium text-white">
      <span>
        {label}{" "}
        {optional ? (
          <span className="font-normal text-white/60">{optional}</span>
        ) : null}
      </span>
      {children}
    </label>
  );
}

/** Formulario de leads: dos columnas (datos + temas de interés) sobre fondo oscuro. */
export function ContactForm() {
  const t = useTranslations("home.contact");
  const locale = useLocale();
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return;
    setError(null);

    const form = new FormData(event.currentTarget);
    const topics = form.getAll("topics").map(String);
    if (topics.length === 0) {
      setError(t("errors.topicsRequired"));
      return;
    }
    const personRut = String(form.get("personRut") ?? "").trim();
    const companyRut = String(form.get("companyRut") ?? "").trim();
    if ((personRut && !isValidRut(personRut)) || (companyRut && !isValidRut(companyRut))) {
      setError(t("errors.invalidRut"));
      return;
    }

    setSending(true);
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        company: form.get("company"),
        email: form.get("email"),
        personRut,
        companyRut,
        phone: String(form.get("phone") ?? "").trim(),
        topics,
        locale,
      }),
    }).catch(() => null);
    setSending(false);

    if (response?.ok) {
      setSent(true);
      return;
    }
    setError(t("errors.generic"));
  }

  if (sent) {
    return (
      <p
        role="status"
        className="flex items-start gap-2 rounded-lg bg-white/10 px-5 py-6 text-white ring-1 ring-white/20"
      >
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-teal-300" aria-hidden />
        {t("success")}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-2">
      {/* Columna izquierda: datos de contacto */}
      <div className="space-y-4">
        <LeadField label={t("name")}>
          <Input name="name" required minLength={2} className={INPUT_CLASSES} autoComplete="name" />
        </LeadField>
        <LeadField label={t("company")}>
          <Input name="company" required minLength={2} className={INPUT_CLASSES} autoComplete="organization" />
        </LeadField>
        <LeadField label={t("email")}>
          <Input type="email" name="email" required className={INPUT_CLASSES} autoComplete="email" />
        </LeadField>
        <LeadField label={t("personRut")} optional={t("optional")}>
          <Input name="personRut" placeholder="12.345.678-5" className={INPUT_CLASSES} />
        </LeadField>
        <LeadField label={t("companyRut")} optional={t("optional")}>
          <Input name="companyRut" placeholder="76.543.210-K" className={INPUT_CLASSES} />
        </LeadField>
        <LeadField label={t("phone")} optional={t("optional")}>
          <Input type="tel" name="phone" className={INPUT_CLASSES} autoComplete="tel" />
        </LeadField>
      </div>

      {/* Columna derecha: temas de interés */}
      <fieldset>
        <legend className="text-sm font-medium text-white">
          {t("topicsTitle")}
        </legend>
        <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
          {CONTACT_TOPICS.map((topic) => (
            <label
              key={topic}
              className="flex items-start gap-2.5 rounded-md bg-white/5 px-3 py-2.5 text-sm text-white/90 ring-1 ring-white/15 transition-colors hover:bg-white/10"
            >
              <input
                type="checkbox"
                name="topics"
                value={topic}
                className="mt-0.5 h-4 w-4 accent-teal-400"
              />
              {t(`topics.${topic}`)}
            </label>
          ))}
        </div>

        {error ? (
          <p
            role="alert"
            className="mt-4 flex items-start gap-2 rounded-md bg-red-950/60 px-3 py-2.5 text-sm text-red-200 ring-1 ring-red-400/40"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            {error}
          </p>
        ) : null}

        <Button
          type="submit"
          size="lg"
          disabled={sending}
          className="mt-6 w-full sm:w-auto"
        >
          {sending ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          ) : null}
          {t("submit")}
        </Button>
      </fieldset>
    </form>
  );
}
