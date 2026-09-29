"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";
import { authErrorKey } from "@/lib/auth-errors";
import { Field, Notice, PrimaryButton } from "./ui";

export function NewPasswordForm() {
  const t = useTranslations();
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) return setError("passwordShort");
    setBusy(true);
    setError(null);
    const { error } = await createClient().auth.updateUser({ password });
    setBusy(false);
    if (error) setError(authErrorKey(error));
    else setDone(true);
  }

  if (done) {
    return (
      <div className="space-y-6">
        <Notice>{t("auth.passwordSaved")}</Notice>
        <Link href="/account" className="text-accent underline-offset-4 hover:underline">
          {t("account.title")}
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <Field
        label={t("auth.newPassword")}
        type="password"
        autoComplete="new-password"
        required
        minLength={8}
        hint={t("auth.passwordHint")}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <Notice tone="error">{t(`auth.errors.${error}`)}</Notice>}
      <PrimaryButton type="submit" disabled={busy}>
        {busy ? t("auth.loading") : t("auth.savePassword")}
      </PrimaryButton>
    </form>
  );
}
