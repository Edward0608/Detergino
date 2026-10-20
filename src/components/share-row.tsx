"use client";

import { useState } from "react";
import { IconLink, IconMail, IconWhatsApp, IconFacebook } from "@/components/icons";
import { track } from "@/lib/analytics";

export function ShareRow({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const text = encodeURIComponent(`${title} ${url}`);
  const copy = async () => {
    track("Distribuie", { canal: "link" });
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      window.prompt("Copiază linkul:", url);
    }
  };
  const btn = "btn-icon h-11 w-11";
  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-sm font-semibold">Distribuie:</span>
      <a href={`https://wa.me/?text=${text}`} target="_blank" rel="noopener" className={`${btn} border-whatsapp bg-whatsapp text-white hover:border-whatsapp-ink hover:bg-whatsapp-ink hover:text-white`} aria-label="Trimite pe WhatsApp" onClick={() => track("Distribuie", { canal: "whatsapp" })}>
        <IconWhatsApp width={20} height={20} />
      </a>
      <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`} target="_blank" rel="noopener" className={`${btn} border-facebook bg-facebook text-white hover:border-facebook-ink hover:bg-facebook-ink hover:text-white`} aria-label="Distribuie pe Facebook" onClick={() => track("Distribuie", { canal: "facebook" })}>
        <IconFacebook width={18} height={18} />
      </a>
      <a href={`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`} className={`${btn} border-brand-navy bg-brand-navy text-white hover:border-brand-dark hover:bg-brand-dark hover:text-white`} aria-label="Trimite pe email" onClick={() => track("Distribuie", { canal: "email" })}>
        <IconMail />
      </a>
      <button type="button" onClick={copy} className={`${btn} border-ink-soft bg-ink-soft text-white hover:border-ink hover:bg-ink hover:text-white`} aria-label="Copiază linkul">
        <IconLink />
      </button>
      <span className="text-xs text-muted" role="status" aria-live="polite">
        {copied ? "Link copiat" : ""}
      </span>
    </div>
  );
}
