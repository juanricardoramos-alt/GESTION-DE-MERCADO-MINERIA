"use client";

import { Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";

/** Botón de borrado con confirmación, que invoca el server action recibido. */
export function DeleteButton({
  action,
  label,
}: {
  action: () => Promise<void>;
  label: string;
}) {
  const t = useTranslations("admin");

  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!window.confirm(t("confirmDelete", { name: label }))) {
          event.preventDefault();
        }
      }}
    >
      <Button
        type="submit"
        variant="ghost"
        size="sm"
        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
      >
        <Trash2 className="h-4 w-4" aria-hidden />
        <span className="sr-only">{t("delete")}</span>
      </Button>
    </form>
  );
}
