// Общие элементы форм, чтобы все формы выглядели одинаково.
import type { ButtonHTMLAttributes, InputHTMLAttributes } from "react";

export function Field({ label, hint, ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string }) {
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      <input
        {...props}
        className="mt-2 block min-h-12 w-full rounded-xl border border-subtle bg-surface px-4 text-base outline-none transition-colors focus:border-accent"
      />
      {hint && <span className="mt-1 block text-sm text-muted">{hint}</span>}
    </label>
  );
}

export function PrimaryButton({ className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`inline-flex min-h-12 w-full items-center justify-center rounded-full bg-accent px-8 font-medium text-accent-fg transition-opacity hover:opacity-90 disabled:opacity-50 ${className}`}
    />
  );
}

export function SecondaryButton({ className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-full border border-subtle bg-surface px-8 font-medium transition-colors hover:border-fg/30 disabled:opacity-50 ${className}`}
    />
  );
}

export function Notice({ tone = "info", children }: { tone?: "info" | "error"; children: React.ReactNode }) {
  return (
    <p
      role={tone === "error" ? "alert" : "status"}
      className={`rounded-xl px-4 py-3 text-sm ${
        tone === "error" ? "bg-red-500/10 text-red-700 dark:text-red-300" : "bg-accent/10 text-fg"
      }`}
    >
      {children}
    </p>
  );
}
