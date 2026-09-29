import Image from "next/image";

type Props = {
  image: string;
  title: string;
  description: string;
};

export function ThemeCard({ image, title, description }: Props) {
  return (
    <div className="overflow-hidden rounded-card border border-subtle bg-surface">
      <div className="relative aspect-[4/3] bg-subtle">
        <Image src={image} alt="" fill sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw" className="object-cover" />
      </div>
      <div className="p-5">
        <h3 className="font-semibold">{title}</h3>
        <p className="mt-1 text-sm text-muted">{description}</p>
      </div>
    </div>
  );
}
