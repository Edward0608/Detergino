"use client";

import { useState } from "react";
import type { Product } from "@/lib/catalog";
import { productOfferMailto, productOfferUrl } from "@/lib/whatsapp";
import { track } from "@/lib/analytics";
import { useOfferList } from "@/components/offer-list";
import { QtyField } from "@/components/qty-field";
import { IconCheck, IconList, IconWhatsApp } from "@/components/icons";

export function ProductActions({ product }: { product: Product }) {
  const { add, has, hydrated } = useOfferList();
  const [qty, setQty] = useState(1);
  const inList = hydrated && has(product.slug);
  return (
    <div>
      {/* Third selector after variant and size: the quantity goes into both the WhatsApp message and the offer list. */}
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-navy">Cantitate: {qty} buc.</p>
      <div className="mt-3">
        <QtyField value={qty} onChange={setQty} label="Cantitate în bucăți" showUnit={false} />
      </div>

      <a href={productOfferUrl(product, qty)} target="_blank" rel="noopener" className="btn-dark mt-6 h-12 w-full px-6 text-xs" onClick={() => track("Cere oferta", { produs: product.slug, canal: "whatsapp", sursa: "produs" })}>
        <IconWhatsApp width={18} height={18} />
        Cere ofertă pe WhatsApp
      </a>
      <p className="mt-2 text-center text-xs text-ink-soft">
        sau{" "}
        <a href={productOfferMailto(product, qty)} className="text-ink underline underline-offset-4" onClick={() => track("Cere oferta", { produs: product.slug, canal: "email", sursa: "produs" })}>
          trimite cererea pe email
        </a>
      </p>

      <button
        type="button"
        onClick={() => {
          add(product.slug, qty);
          track("Adauga in lista", { produs: product.slug, sursa: "produs" });
        }}
        className="btn-light mt-4 h-12 w-full px-4 text-xs"
      >
        {inList ? <IconCheck width={16} height={16} /> : <IconList width={18} height={18} />}
        {inList ? "Este în listă. Adaugă din nou" : "Adaugă în lista de ofertă"}
      </button>
      <p className="mt-3 text-xs text-muted">Lista de ofertă trimite toate produsele alese într-un singur mesaj pe WhatsApp.</p>
    </div>
  );
}
