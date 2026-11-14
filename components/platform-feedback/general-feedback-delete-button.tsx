"use client";

import { deleteGeneralFeedbackAction } from "@/features/platform-feedback/general-admin-actions";
import { useTranslations } from "next-intl";
import type { MouseEvent } from "react";

export default function GeneralFeedbackDeleteButton({
  id,
  locale,
}: {
  id: string;
  locale: string;
}) {
  const t = useTranslations("Protected.GeneralFeedbackAdmin");
  const confirmDeletion = (event: MouseEvent<HTMLButtonElement>) => {
    if (!window.confirm(t("confirmDelete"))) event.preventDefault();
  };
  return (
    <form action={deleteGeneralFeedbackAction}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="locale" value={locale} />
      <button
        type="submit"
        onClick={confirmDeletion}
        className="text-xs font-semibold text-red-700 hover:underline"
      >
        {t("delete")}
      </button>
    </form>
  );
}
