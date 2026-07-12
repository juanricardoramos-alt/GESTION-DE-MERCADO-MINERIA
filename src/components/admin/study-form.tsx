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
import { saveStudy, type ActionState } from "@/lib/admin/actions";
import { SECTORS } from "@/lib/constants";
import type { AdminStudy } from "@/types";

const SELECT_CLASSES =
  "flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

const INITIAL: ActionState = { error: null };

export function StudyForm({ study }: { study: AdminStudy | null }) {
  const t = useTranslations();
  const locale = useLocale();
  const [state, formAction] = useFormState(
    saveStudy.bind(null, locale, study?.id ?? null),
    INITIAL,
  );

  return (
    <form action={formAction} className="max-w-2xl space-y-5">
      <FormError error={state.error} />

      <BilingualField
        name="title"
        label={t("admin.fields.title")}
        defaultValue={study?.title}
      />
      <BilingualField
        name="summary"
        label={t("admin.fields.summary")}
        defaultValue={study?.summary}
        multiline
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label={t("admin.fields.sector")}>
          <select
            name="sector"
            defaultValue={study?.sector ?? "mineria"}
            className={SELECT_CLASSES}
          >
            {SECTORS.map((sector) => (
              <option key={sector} value={sector}>
                {t(`sectors.${sector}`)}
              </option>
            ))}
          </select>
        </Field>
        <Field label={t("admin.fields.pages")}>
          <Input
            type="number"
            name="pages"
            min={1}
            max={2000}
            defaultValue={study?.pages ?? 40}
            required
          />
        </Field>
        <Field label={t("admin.fields.date")}>
          <Input
            type="date"
            name="date"
            defaultValue={study?.date ?? ""}
            required
          />
        </Field>
      </div>

      <label className="flex items-center gap-2 text-sm font-medium">
        <input
          type="checkbox"
          name="premium"
          defaultChecked={study?.premium ?? false}
          className="h-4 w-4 accent-brand-600"
        />
        {t("admin.fields.premium")}
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={t("admin.fields.pdf")}>
          <Input type="file" name="pdf" accept="application/pdf" />
        </Field>
        <Field label={t("admin.fields.cover")}>
          <Input
            type="file"
            name="cover"
            accept="image/jpeg,image/png,image/webp"
          />
        </Field>
      </div>

      {study?.fileUrl ? (
        <p className="text-xs text-muted-foreground">
          {t("admin.fields.currentPdf")}:{" "}
          <a
            href={study.fileUrl}
            target="_blank"
            rel="noreferrer"
            className="font-medium text-primary hover:underline"
          >
            {study.fileUrl}
          </a>
        </p>
      ) : null}

      <SubmitButton />
    </form>
  );
}
