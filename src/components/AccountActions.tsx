"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { deleteAccount, signOut } from "@/app/[locale]/account/actions";
import { Notice, SecondaryButton } from "./ui";

export function SignOutButton({ locale }: { locale: string }) {
  const t = useTranslations("account");
  const [pending, start] = useTransition();
  return (
    <SecondaryButton type="button" disabled={pending} onClick={() => start(() => signOut(locale))} className="sm:w-auto">
      {t("signOut")}
    </SecondaryButton>
  );
}

// Удаление в два шага, чтобы не нажать случайно.
export function DeleteAccount({ locale }: { locale: string }) {
  const t = useTranslations("account");
  const [confirming, setConfirming] = useState(false);
  const [failed, setFailed] = useState(false);
  const [pending, start] = useTransition();

  function onDelete() {
    setFailed(false);
    start(async () => {
      const result = await deleteAccount(locale);
      if (result && !result.ok) setFailed(true);
    });
  }

  return (
    <div className="space-y-4">
      {!confirming ? (
        <button
          type="button"
          onClick={() => setConfirming(true)}
          className="min-h-12 rounded-full border border-red-500/40 px-6 font-medium text-red-600 transition-colors hover:bg-red-500/10 dark:text-red-400"
        >
          {t("deleteButton")}
        </button>
      ) : (
        <div className="space-y-4">
          <p className="font-medium">{t("deleteConfirm")}</p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              disabled={pending}
              onClick={onDelete}
              className="min-h-12 rounded-full bg-red-600 px-6 font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {t("deleteFinal")}
            </button>
            <button
              type="button"
              disabled={pending}
              onClick={() => setConfirming(false)}
              className="min-h-12 rounded-full border border-subtle px-6 font-medium"
            >
              {t("deleteCancel")}
            </button>
          </div>
        </div>
      )}
      {failed && <Notice tone="error">{t("deleteError")}</Notice>}
    </div>
  );
}
