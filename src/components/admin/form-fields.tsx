"use client";

import { AlertCircle, Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import type { LocalizedText } from "@/types";

/** Etiqueta + control, con el espaciado estándar del panel. */
export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5 text-sm font-medium">
      {label}
      {children}
    </label>
  );
}

/**
 * Campo bilingüe con tabs es/en. Emite dos controles: <name>_es y <name>_en,
 * que el schema del server action vuelve a unir en Json { es, en }.
 */
export function BilingualField({
  name,
  label,
  defaultValue,
  multiline = false,
  rows = 3,
}: {
  name: string;
  label: string;
  defaultValue?: LocalizedText | null;
  multiline?: boolean;
  rows?: number;
}) {
  return (
    <div className="space-y-1.5 text-sm font-medium">
      <span>{label}</span>
      <Tabs defaultValue="es">
        <TabsList className="h-8">
          <TabsTrigger value="es" className="px-3 py-1 text-xs">
            ES
          </TabsTrigger>
          <TabsTrigger value="en" className="px-3 py-1 text-xs">
            EN
          </TabsTrigger>
        </TabsList>
        {(["es", "en"] as const).map((lang) => (
          <TabsContent key={lang} value={lang} forceMount className="mt-1.5 data-[state=inactive]:hidden">
            {multiline ? (
              <Textarea
                name={`${name}_${lang}`}
                defaultValue={defaultValue?.[lang] ?? ""}
                rows={rows}
                required
                lang={lang}
              />
            ) : (
              <Input
                name={`${name}_${lang}`}
                defaultValue={defaultValue?.[lang] ?? ""}
                required
                lang={lang}
              />
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

/** Error devuelto por el server action (validación Zod u otros). */
export function FormError({ error }: { error: string | null }) {
  if (!error) return null;
  return (
    <p
      className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2.5 text-sm text-destructive"
      role="alert"
    >
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
      {error}
    </p>
  );
}

export function SubmitButton() {
  const t = useTranslations("admin");
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
      {t("save")}
    </Button>
  );
}
