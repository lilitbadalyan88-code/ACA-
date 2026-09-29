"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { authErrorKey } from "@/lib/auth-errors";
import { Field, Notice, PrimaryButton, SecondaryButton } from "./ui";
import { GoogleIcon } from "./GoogleIcon";

type Mode = "signIn" | "signUp" | "reset";

export function AuthForm({ next, locale, initialError }: { next: string; locale: string; initialError?: string }) {
  const t = useTranslations("auth");
  const [mode, setMode] = useState<Mode>("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(initialError ?? null);
  const [sentTo, setSentTo] = useState<string | null>(null);

  const callback = (to: string) =>
    `${window.location.origin}/api/auth/callback?next=${encodeURIComponent(to)}`;

  function switchMode(m: Mode) {
    setMode(m);
    setError(null);
    setSentTo(null);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (mode === "signUp" && password.length < 8) return setError("passwordShort");

    setBusy(true);
    const supabase = createClient();
    try {
      if (mode === "signIn") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        window.location.assign(next);
        return;
      }
      if (mode === "signUp") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: callback(next) },
        });
        if (error) throw error;
        // Если подтверждение email выключено, пользователь сразу входит.
        if (data.session) {
          window.location.assign(next);
          return;
        }
        setSentTo(email);
      }
      if (mode === "reset") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: callback(`/${locale}/account/password`),
        });
        if (error) throw error;
        setSentTo(email);
      }
    } catch (err) {
      setError(authErrorKey(err));
    }
    setBusy(false);
  }

  async function onGoogle() {
    setError(null);
    setBusy(true);
    const { error } = await createClient().auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: callback(next) },
    });
    // При успехе браузер уходит на страницу Google.
    if (error) {
      setError(authErrorKey(error));
      setBusy(false);
    }
  }

  const title = { signIn: t("signInTitle"), signUp: t("signUpTitle"), reset: t("resetTitle") }[mode];
  const submit = { signIn: t("signIn"), signUp: t("signUp"), reset: t("sendReset") }[mode];

  return (
    <div className="mx-auto w-full max-w-[400px]">
      <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
      {mode === "reset" && <p className="mt-3 text-muted">{t("resetText")}</p>}

      {sentTo ? (
        <div className="mt-8 space-y-6">
          <Notice>{t("checkEmail", { email: sentTo })}</Notice>
          <button type="button" onClick={() => switchMode("signIn")} className="text-accent underline-offset-4 hover:underline">
            {t("backToSignIn")}
          </button>
        </div>
      ) : (
        <>
          {mode !== "reset" && (
            <>
              <SecondaryButton type="button" onClick={onGoogle} disabled={busy} className="mt-8">
                <GoogleIcon />
                {t("google")}
              </SecondaryButton>
              <div className="my-6 flex items-center gap-4 text-sm text-muted">
                <span className="h-px flex-1 bg-subtle" />
                {t("or")}
                <span className="h-px flex-1 bg-subtle" />
              </div>
            </>
          )}

          <form onSubmit={onSubmit} className={`space-y-5 ${mode === "reset" ? "mt-8" : ""}`}>
            <Field
              label={t("email")}
              type="email"
              name="email"
              autoComplete="email"
              inputMode="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {mode !== "reset" && (
              <Field
                label={t("password")}
                type="password"
                name="password"
                autoComplete={mode === "signUp" ? "new-password" : "current-password"}
                required
                minLength={mode === "signUp" ? 8 : undefined}
                hint={mode === "signUp" ? t("passwordHint") : undefined}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            )}
            {error && <Notice tone="error">{t(`errors.${error}`)}</Notice>}
            <PrimaryButton type="submit" disabled={busy}>
              {busy ? t("loading") : submit}
            </PrimaryButton>
          </form>

          <div className="mt-8 space-y-3 text-sm">
            {mode === "signIn" && (
              <>
                <button type="button" onClick={() => switchMode("reset")} className="block text-muted hover:text-fg">
                  {t("forgot")}
                </button>
                <p className="text-muted">
                  {t("noAccount")}{" "}
                  <button type="button" onClick={() => switchMode("signUp")} className="font-medium text-accent">
                    {t("signUp")}
                  </button>
                </p>
              </>
            )}
            {mode === "signUp" && (
              <p className="text-muted">
                {t("haveAccount")}{" "}
                <button type="button" onClick={() => switchMode("signIn")} className="font-medium text-accent">
                  {t("signIn")}
                </button>
              </p>
            )}
            {mode === "reset" && (
              <button type="button" onClick={() => switchMode("signIn")} className="font-medium text-accent">
                {t("backToSignIn")}
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
