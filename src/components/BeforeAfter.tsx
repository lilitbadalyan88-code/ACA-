"use client";

import Image from "next/image";
import { useState } from "react";

type Props = {
  before: string;
  after: string;
  beforeLabel: string;
  afterLabel: string;
  sliderLabel: string;
};

// Сравнение «до/после»: картинка «после» лежит сверху и обрезается по ползунку.
export function BeforeAfter({ before, after, beforeLabel, afterLabel, sliderLabel }: Props) {
  const [pos, setPos] = useState(50);

  return (
    <div className="relative aspect-[4/5] w-full select-none overflow-hidden rounded-card bg-subtle">
      <Image src={before} alt={beforeLabel} fill sizes="(min-width: 640px) 480px, 100vw" className="object-cover" />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 0 0 ${pos}%)` }}>
        <Image src={after} alt={afterLabel} fill sizes="(min-width: 640px) 480px, 100vw" className="object-cover" />
      </div>

      <div className="pointer-events-none absolute inset-y-0 w-0.5 bg-white/90" style={{ left: `${pos}%` }}>
        <div className="absolute left-1/2 top-1/2 grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-neutral-900 shadow-sm">
          <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
            <path d="m9 7-5 5 5 5M15 7l5 5-5 5" />
          </svg>
        </div>
      </div>

      <span className="absolute left-3 top-3 rounded-full bg-black/55 px-3 py-1 text-xs text-white">{beforeLabel}</span>
      <span className="absolute right-3 top-3 rounded-full bg-black/55 px-3 py-1 text-xs text-white">{afterLabel}</span>

      {/* Невидимый ползунок поверх картинки: работает пальцем, мышью и клавиатурой. */}
      <input
        type="range"
        min={0}
        max={100}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-label={sliderLabel}
        className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
      />
    </div>
  );
}
