"use client";

import { useCallback, useEffect, useState } from "react";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import Link from "next/link";
import Image from "next/image";
import { IconChevron, IconPause, IconPlay } from "@/components/icons";

export type Slide = {
  title: string;
  /** One factual line under the title, computed from the catalogue (counts, brands, size range). */
  lead?: string;
  cta: string;
  href: string;
  /** Tailwind background class for the panel: a solid brand colour or one of the light tints. */
  tint: string;
  /** True when the panel colour is deep (brand blue, navy): text and controls turn white. */
  dark?: boolean;
  /** Studio photos rendered by scripts/studio-photo.py: a wide one (21:9) from sm up, a square one for phones. */
  photo: { wide: string; square: string; alt: string };
};

/** Full-width carousel like Kiko's: a coloured panel, the text block on the left, large packshots with a ground shadow on the right. */
export function HeroSlider({ slides }: { slides: Slide[] }) {
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [held, setHeld] = useState(false);
  const n = slides.length;
  const reduced = useReducedMotion();
  const dark = Boolean(slides[i]?.dark);

  useEffect(() => {
    if (!playing || held || reduced) return;
    const t = window.setTimeout(() => setI((x) => (x + 1) % n), 7000);
    return () => window.clearTimeout(t);
  }, [playing, held, reduced, n, i]);

  const go = useCallback((k: number) => setI(((k % n) + n) % n), [n]);

  const arrow = `btn-icon h-11 w-11 border-0 bg-transparent ${dark ? "text-white hover:bg-white/15 hover:text-white" : "text-brand-navy hover:bg-white/70"}`;

  return (
    <section
      aria-roledescription="carusel"
      aria-label="Game de produse"
      className="container-site pt-4 md:pt-6"
      onMouseEnter={() => setHeld(true)}
      onMouseLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setHeld(false);
      }}
    >
      <div className="relative overflow-hidden">
        <ul className="flex transition-transform duration-500 ease-out" style={{ transform: `translateX(-${i * 100}%)` }}>
          {slides.map((s, k) => {
            return (
              <li key={k} className="w-full shrink-0" aria-hidden={k !== i} aria-roledescription="slide" aria-label={`${k + 1} din ${n}: ${s.title}`}>
                <div className={`panel relative aspect-square overflow-hidden sm:aspect-[2/1] md:aspect-[21/9] ${s.tint} ${s.dark ? "text-white" : "text-brand-navy"}`}>
                  {/* The whole panel is one studio photo: products on a floor with shadows and reflections, the left part left free for the text. */}
                  <Image src={s.photo.wide} alt={s.photo.alt} fill priority={k === 0} loading="eager" sizes="(min-width: 1440px) 1400px, 100vw" className="hidden animate-kenburns object-cover object-[70%_50%] origin-right motion-reduce:animate-none sm:block md:object-right" />
                  <Image src={s.photo.square} alt={s.photo.alt} fill priority={k === 0} loading="eager" sizes="100vw" className="animate-kenburns object-cover origin-bottom motion-reduce:animate-none sm:hidden" />

                  {/* Phones: title top, CTA bottom-left. Larger: one text block centred in the left column. */}
                  <div className="absolute inset-x-4 top-5 z-10 sm:inset-y-0 sm:left-6 sm:right-auto sm:top-auto sm:flex sm:w-[34%] sm:flex-col sm:justify-center sm:pb-14 md:left-10">
                    <h2 className="text-2xl font-light leading-[1.1] tracking-tight sm:text-3xl lg:text-[2.6rem]">{s.title}</h2>
                    {s.lead && <p className={`mt-3 hidden max-w-[88%] text-sm leading-relaxed md:block md:text-base ${s.dark ? "text-white/85" : "text-ink-soft"}`}>{s.lead}</p>}
                    <Link href={s.href} tabIndex={k === i ? 0 : -1} className={`${s.dark ? "btn-light" : "btn-dark"} mt-6 hidden min-w-[170px] self-start sm:inline-flex`}>
                      {s.cta}
                    </Link>
                  </div>
                  {/* Phones only: the same CTA pinned bottom-left, under the packshots. */}
                  <Link href={s.href} tabIndex={k === i ? 0 : -1} className={`${s.dark ? "btn-light" : "btn-dark"} absolute bottom-4 left-4 z-10 min-w-[170px] sm:hidden`}>
                    {s.cta}
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
        <div className="z-10 mt-2 flex items-center justify-center gap-1 sm:absolute sm:bottom-4 sm:left-6 sm:mt-0 md:left-10" role="group" aria-label="Controale carusel">
          <button type="button" onClick={() => go(i - 1)} className={arrow} aria-label="Imaginea anterioară">
            <IconChevron className="rotate-180" width={16} height={16} />
          </button>
          {slides.map((s, k) => (
            <button
              key={k}
              type="button"
              aria-label={`Imaginea ${k + 1}: ${s.title}`}
              aria-current={k === i ? "true" : undefined}
              onClick={() => go(k)}
              className="flex h-11 w-6 items-center justify-center"
            >
              <span className={`block h-2.5 w-2.5 rounded-pill border ${dark ? `border-white ${k === i ? "bg-white" : "bg-transparent"}` : `border-brand ${k === i ? "bg-brand" : "bg-white"}`}`} />
            </button>
          ))}
          <button type="button" onClick={() => go(i + 1)} className={arrow} aria-label="Imaginea următoare">
            <IconChevron width={16} height={16} />
          </button>
          <button type="button" onClick={() => setPlaying(!playing)} className="btn-icon h-11 w-11 bg-white" aria-label={playing ? "Oprește derularea automată" : "Pornește derularea automată"}>
            {playing ? <IconPause /> : <IconPlay />}
          </button>
        </div>
      </div>
    </section>
  );
}
