"use client";

import { useFormState } from "react-dom";
import { useLocale, useTranslations } from "next-intl";

import {
  BilingualField,
  Field,
  FormError,
  SubmitButton,
} from "@/components/admin/form-fields";
import { Input } from "@/components/ui/input";
import { saveProject, type ActionState } from "@/lib/admin/actions";
import { PROJECT_STATUSES, SECTORS } from "@/lib/constants";
import type { Project } from "@/types";

const SELECT_CLASSES =
  "flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

const INITIAL: ActionState = { error: null };

export function ProjectForm({
  project,
  companyNames,
}: {
  project: Project | null;
  companyNames: string[];
}) {
  const t = useTranslations();
  const locale = useLocale();
  const [state, formAction] = useFormState(
    saveProject.bind(null, locale, project?.id ?? null),
    INITIAL,
  );

  return (
    <form action={formAction} className="max-w-2xl space-y-5">
      <FormError error={state.error} />

      <Field label={t("admin.fields.name")}>
        <Input name="name" defaultValue={project?.name ?? ""} required />
      </Field>

      <Field label={t("admin.fields.companyName")}>
        <>
          <Input
            name="companyName"
            list="admin-company-names"
            defaultValue={project?.company ?? ""}
            required
          />
          <datalist id="admin-company-names">
            {companyNames.map((name) => (
              <option key={name} value={name} />
            ))}
          </datalist>
        </>
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={t("admin.fields.sector")}>
          <select
            name="sector"
            defaultValue={project?.sector ?? "mineria"}
            className={SELECT_CLASSES}
          >
            {SECTORS.map((sector) => (
              <option key={sector} value={sector}>
                {t(`sectors.${sector}`)}
              </option>
            ))}
          </select>
        </Field>
        <Field label={t("admin.fields.status")}>
          <select
            name="status"
            defaultValue={project?.status ?? "evaluation"}
            className={SELECT_CLASSES}
          >
            {PROJECT_STATUSES.map((status) => (
              <option key={status} value={status}>
                {t(`status.${status}`)}
              </option>
            ))}
          </select>
        </Field>
        <Field label={t("admin.fields.region")}>
          <Input name="region" defaultValue={project?.region ?? ""} required />
        </Field>
        <Field label={t("admin.fields.startYear")}>
          <Input
            type="number"
            name="startYear"
            min={2000}
            max={2100}
            defaultValue={project?.startYear ?? 2027}
            required
          />
        </Field>
        <Field label={t("admin.fields.lat")}>
          <Input
            type="number"
            name="lat"
            step="any"
            min={-90}
            max={90}
            defaultValue={project?.lat ?? ""}
            required
          />
        </Field>
        <Field label={t("admin.fields.lng")}>
          <Input
            type="number"
            name="lng"
            step="any"
            min={-180}
            max={180}
            defaultValue={project?.lng ?? ""}
            required
          />
        </Field>
        <Field label={t("admin.fields.investmentUsdM")}>
          <Input
            type="number"
            name="investmentUsdM"
            step="any"
            min={0}
            defaultValue={project?.investmentUsdM ?? ""}
            required
          />
        </Field>
      </div>

      <BilingualField
        name="description"
        label={t("admin.fields.description")}
        defaultValue={project?.description}
        multiline
      />

      <SubmitButton />
    </form>
  );
}
