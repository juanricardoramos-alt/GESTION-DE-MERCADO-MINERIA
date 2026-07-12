"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useFormState } from "react-dom";
import { useLocale, useTranslations } from "next-intl";

import {
  BilingualField,
  Field,
  FormError,
  SubmitButton,
} from "@/components/admin/form-fields";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { saveCompany, type ActionState } from "@/lib/admin/actions";
import { SECTORS } from "@/lib/constants";
import type { Company } from "@/types";

const INITIAL: ActionState = { error: null };

interface ExecutiveRow {
  name: string;
  roleEs: string;
  roleEn: string;
  email: string;
}

function toRows(company: Company | null): ExecutiveRow[] {
  if (!company) return [];
  return company.executives.map((executive) => ({
    name: executive.name,
    roleEs: executive.role.es,
    roleEn: executive.role.en,
    email: executive.email,
  }));
}

export function CompanyForm({ company }: { company: Company | null }) {
  const t = useTranslations();
  const locale = useLocale();
  const [state, formAction] = useFormState(
    saveCompany.bind(null, locale, company?.id ?? null),
    INITIAL,
  );
  const [executives, setExecutives] = useState<ExecutiveRow[]>(() =>
    toRows(company),
  );

  function updateRow(index: number, patch: Partial<ExecutiveRow>) {
    setExecutives((rows) =>
      rows.map((row, i) => (i === index ? { ...row, ...patch } : row)),
    );
  }

  return (
    <form action={formAction} className="max-w-3xl space-y-5">
      <FormError error={state.error} />

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={t("admin.fields.name")}>
          <Input name="name" defaultValue={company?.name ?? ""} required />
        </Field>
        <Field label={t("admin.fields.slug")}>
          <Input
            name="slug"
            defaultValue={company?.slug ?? ""}
            placeholder={t("admin.fields.slugHint")}
            pattern="[a-z0-9-]*"
          />
        </Field>
      </div>

      <fieldset className="space-y-1.5 text-sm font-medium">
        <legend>{t("admin.fields.sectors")}</legend>
        <div className="flex flex-wrap gap-4">
          {SECTORS.map((sector) => (
            <label key={sector} className="flex items-center gap-2 font-normal">
              <input
                type="checkbox"
                name="sectors"
                value={sector}
                defaultChecked={company?.sectors.includes(sector) ?? false}
                className="h-4 w-4 accent-brand-600"
              />
              {t(`sectors.${sector}`)}
            </label>
          ))}
        </div>
      </fieldset>

      <BilingualField
        name="industry"
        label={t("admin.fields.industry")}
        defaultValue={company?.industry}
      />
      <BilingualField
        name="description"
        label={t("admin.fields.description")}
        defaultValue={company?.description}
        multiline
        rows={4}
      />

      {/* Servicios: una línea por servicio, pareados por posición es/en */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={`${t("admin.fields.services")} (ES)`}>
          <Textarea
            name="services_es"
            rows={4}
            required
            defaultValue={company?.services.map((s) => s.es).join("\n") ?? ""}
          />
        </Field>
        <Field label={`${t("admin.fields.services")} (EN)`}>
          <Textarea
            name="services_en"
            rows={4}
            required
            defaultValue={company?.services.map((s) => s.en).join("\n") ?? ""}
          />
        </Field>
      </div>
      <p className="-mt-3 text-xs text-muted-foreground">
        {t("admin.fields.servicesHint")}
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={t("admin.fields.website")}>
          <Input
            type="url"
            name="website"
            defaultValue={company?.website ?? ""}
            required
          />
        </Field>
        <Field label={t("admin.fields.email")}>
          <Input
            type="email"
            name="email"
            defaultValue={company?.email ?? ""}
            required
          />
        </Field>
        <Field label={t("admin.fields.phone")}>
          <Input name="phone" defaultValue={company?.phone ?? ""} required />
        </Field>
        <Field label={t("admin.fields.city")}>
          <Input name="city" defaultValue={company?.city ?? ""} required />
        </Field>
        <Field label={t("admin.fields.employees")}>
          <Input
            name="employees"
            defaultValue={company?.employees ?? ""}
            required
          />
        </Field>
        <Field label={t("admin.fields.founded")}>
          <Input
            type="number"
            name="founded"
            min={1800}
            max={2100}
            defaultValue={company?.founded ?? 2000}
            required
          />
        </Field>
      </div>

      {/* Ejecutivos: filas dinámicas serializadas a un input oculto */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">
            {t("admin.fields.executives")}
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              setExecutives((rows) => [
                ...rows,
                { name: "", roleEs: "", roleEn: "", email: "" },
              ])
            }
          >
            <Plus className="h-4 w-4" aria-hidden />
            {t("admin.addExecutive")}
          </Button>
        </div>

        {executives.map((row, index) => (
          <div
            key={index}
            className="grid gap-2 rounded-md border p-3 sm:grid-cols-[1fr_1fr_1fr_1fr_auto]"
          >
            <Input
              placeholder={t("admin.fields.name")}
              value={row.name}
              onChange={(e) => updateRow(index, { name: e.target.value })}
              required
            />
            <Input
              placeholder={`${t("admin.fields.role")} (ES)`}
              value={row.roleEs}
              onChange={(e) => updateRow(index, { roleEs: e.target.value })}
              required
            />
            <Input
              placeholder={`${t("admin.fields.role")} (EN)`}
              value={row.roleEn}
              onChange={(e) => updateRow(index, { roleEn: e.target.value })}
              required
            />
            <Input
              type="email"
              placeholder={t("admin.fields.email")}
              value={row.email}
              onChange={(e) => updateRow(index, { email: e.target.value })}
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={t("admin.delete")}
              onClick={() =>
                setExecutives((rows) => rows.filter((_, i) => i !== index))
              }
            >
              <Trash2 className="h-4 w-4 text-destructive" aria-hidden />
            </Button>
          </div>
        ))}

        <input
          type="hidden"
          name="executives"
          value={JSON.stringify(executives)}
        />
      </div>

      <SubmitButton />
    </form>
  );
}
