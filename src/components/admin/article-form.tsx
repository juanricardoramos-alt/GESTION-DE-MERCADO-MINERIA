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
import { saveArticle, type ActionState } from "@/lib/admin/actions";
import { SECTORS } from "@/lib/constants";
import type { NewsArticle } from "@/types";

const SELECT_CLASSES =
  "flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

const INITIAL: ActionState = { error: null };

export function ArticleForm({ article }: { article: NewsArticle | null }) {
  const t = useTranslations();
  const locale = useLocale();
  const [state, formAction] = useFormState(
    saveArticle.bind(null, locale, article?.id ?? null),
    INITIAL,
  );

  return (
    <form action={formAction} className="max-w-2xl space-y-5">
      <FormError error={state.error} />

      <BilingualField
        name="title"
        label={t("admin.fields.title")}
        defaultValue={article?.title}
      />
      <BilingualField
        name="excerpt"
        label={t("admin.fields.excerpt")}
        defaultValue={article?.excerpt}
        multiline
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={t("admin.fields.sector")}>
          <select
            name="sector"
            defaultValue={article?.sector ?? "mineria"}
            className={SELECT_CLASSES}
          >
            {SECTORS.map((sector) => (
              <option key={sector} value={sector}>
                {t(`sectors.${sector}`)}
              </option>
            ))}
          </select>
        </Field>
        <Field label={t("admin.fields.source")}>
          <Input
            name="sourceName"
            defaultValue={article?.sourceName ?? ""}
            required
          />
        </Field>
        <Field label={t("admin.fields.date")}>
          <Input
            type="date"
            name="date"
            defaultValue={article?.date ?? ""}
            required
          />
        </Field>
        <Field label={t("admin.fields.readingMinutes")}>
          <Input
            type="number"
            name="readingMinutes"
            min={1}
            max={120}
            defaultValue={article?.readingMinutes ?? 4}
            required
          />
        </Field>
      </div>

      <div className="flex flex-wrap gap-6 text-sm font-medium">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="featured"
            defaultChecked={article?.featured ?? false}
            className="h-4 w-4 accent-brand-600"
          />
          {t("admin.fields.featured")}
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="premium"
            defaultChecked={article?.premium ?? false}
            className="h-4 w-4 accent-brand-600"
          />
          {t("admin.fields.premium")}
        </label>
      </div>

      <SubmitButton />
    </form>
  );
}
