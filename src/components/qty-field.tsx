"use client";

import { useId, useState } from "react";
import { IconMinus, IconPlus } from "@/components/icons";

export const MAX_QTY = 999;

export function clampQty(n: number): number {
  if (!Number.isFinite(n)) return 1;
  return Math.max(1, Math.min(MAX_QTY, Math.floor(n)));
}

/** Stepper with a free-text draft: the value is committed on blur/Enter so the field can be cleared while typing. */
export function QtyField({ value, onChange, label, size = "md", showUnit = true }: { value: number; onChange: (n: number) => void; label: string; size?: "sm" | "md"; showUnit?: boolean }) {
  const id = useId();
  const [draft, setDraft] = useState(String(value));
  const [prev, setPrev] = useState(value);
  if (prev !== value) {
    // value changed from outside (stepper, store): resync the draft during render
    setPrev(value);
    setDraft(String(value));
  }
  const commit = () => {
    const n = clampQty(Number(draft));
    setDraft(String(n));
    if (n !== value) onChange(n);
  };
  const h = size === "sm" ? "h-9" : "h-12";
  const w = size === "sm" ? "w-9" : "w-11";
  return (
    <div className="flex items-center gap-2">
      <div className={`inline-flex ${h} items-center overflow-hidden rounded-pill border border-line bg-white`}>
        <button type="button" className={`flex h-full ${w} items-center justify-center hover:bg-surface`} aria-label="Scade cantitatea" onClick={() => onChange(clampQty(value - 1))}>
          <IconMinus width={14} height={14} />
        </button>
        <input
          id={id}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={draft}
          onChange={(e) => setDraft(e.target.value.replace(/[^0-9]/g, ""))}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              commit();
            }
          }}
          aria-label={label}
          className={`h-full ${size === "sm" ? "w-12" : "w-14"} border-x border-line text-center text-sm`}
        />
        <button type="button" className={`flex h-full ${w} items-center justify-center hover:bg-surface`} aria-label="Crește cantitatea" onClick={() => onChange(clampQty(value + 1))}>
          <IconPlus width={14} height={14} />
        </button>
      </div>
      <label htmlFor={id} className={showUnit ? "text-xs text-muted" : "sr-only"}>
        buc.
      </label>
    </div>
  );
}
