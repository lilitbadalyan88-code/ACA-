import { Link } from "@/i18n/navigation";

// Временная страница для разделов, которые появятся на следующих этапах.
export function ComingSoon({ title, text, back }: { title: string; text: string; back: string }) {
  return (
    <section className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 sm:py-24">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
      <p className="mt-4 max-w-[65ch] text-muted">{text}</p>
      <Link href="/" className="mt-8 inline-block text-accent underline-offset-4 hover:underline">
        {back}
      </Link>
    </section>
  );
}
