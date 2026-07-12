"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2, Info } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/**
 * Formulario de acceso/registro SOLO de interfaz (mock).
 * No hay backend: el envío muestra un estado de éxito simulado.
 */
export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const t = useTranslations("auth");
  const [done, setDone] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setDone(true);
  }

  return (
    <div className="space-y-4">
      {/* Aviso de demo */}
      <p className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs leading-relaxed text-amber-800">
        <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
        {t("demoNotice")}
      </p>

      {done ? (
        <p
          className="flex items-start gap-2 rounded-md border border-green-200 bg-green-50 px-3 py-3 text-sm font-medium text-green-800"
          role="status"
        >
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          {t(`${mode}.success`)}
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" ? (
            <>
              <label className="block space-y-1.5 text-sm font-medium">
                {t("signup.name")}
                <Input name="name" required autoComplete="name" />
              </label>
              <label className="block space-y-1.5 text-sm font-medium">
                {t("signup.company")}
                <Input name="company" required autoComplete="organization" />
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
              autoComplete={
                mode === "login" ? "current-password" : "new-password"
              }
            />
          </label>

          <Button type="submit" className="w-full">
            {t(`${mode}.submit`)}
          </Button>
        </form>
      )}
    </div>
  );
}
