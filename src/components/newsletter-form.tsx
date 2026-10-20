"use client";

import { useId, useState } from "react";
import { SITE } from "@/lib/site";

export function NewsletterForm({ tone = "light" }: { tone?: "light" | "dark" }) {
  const soft = tone === "dark" ? "text-brand-100" : "text-ink-soft";
  const faint = tone === "dark" ? "text-brand-100/80" : "text-muted";
  const id = useId();
  const [email, setEmail] = useState("");
  const [agree, setAgree] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agree || !email) return;
    const subject = encodeURIComponent("Abonare newsletter Detergino");
    const body = encodeURIComponent(`Bună,\r\n\r\nDoresc să primesc noutăți din catalogul Detergino la adresa: ${email}\r\n\r\nMulțumesc.`);
    window.location.href = `mailto:${SITE.email}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <form onSubmit={submit} className="mt-6 max-w-sm">
      <label htmlFor={`${id}-email`} className={`label-caps block ${soft}`}>
        Adresa ta de email
      </label>
      <input
        id={`${id}-email`}
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="nume@firma.ro"
        className="field mt-2"
      />
      <label className={`mt-4 flex items-start gap-3 text-xs leading-relaxed ${soft}`}>
        <input type="checkbox" required checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 accent-brand" />
        <span>
          Sunt de acord ca {SITE.company} să îmi trimită prin email noutăți despre produse și oferte. Mă pot dezabona oricând printr-un răspuns la email.
        </span>
      </label>
      <button type="submit" className={tone === "dark" ? "btn mt-4 bg-white text-brand-navy hover:bg-brand-50" : "btn-dark mt-4"}>
        Abonează-te
      </button>
      <p className={`mt-3 text-xs ${faint}`} aria-live="polite">
        {sent ? (
          <>
            Dacă nu s-a deschis aplicația de email, scrie-ne direct la{" "}
            <a href={`mailto:${SITE.email}`} className={`underline underline-offset-4 ${tone === "dark" ? "text-white" : "text-ink"}`}>
              {SITE.email}
            </a>{" "}
            cu adresa ta.
          </>
        ) : (
          `Cererea se trimite prin email la ${SITE.email}.`
        )}
      </p>
    </form>
  );
}
