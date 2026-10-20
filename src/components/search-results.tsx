"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { searchProducts } from "@/lib/catalog";
import { CatalogView } from "@/components/catalog-view";
import { useExtras } from "@/components/extras-provider";

export function SearchResults() {
  const params = useSearchParams();
  const q = (params.get("q") ?? "").trim();
  const { extras } = useExtras();
  // eslint-disable-next-line react-hooks/exhaustive-deps -- extras changes the search corpus (setExtraProducts ran before the state update)
  const results = useMemo(() => searchProducts(q, 200), [q, extras]);
  return (
    <CatalogView
      key={q}
      title={q ? `Rezultate pentru „${q}”` : "Căutare în catalog"}
      intro={q ? (results.length === 0 ? `Niciun produs nu conține „${q}”. Încearcă un brand (Super Wash, Free, Golf, Fibril), o aromă sau un cod de bare.` : undefined) : "Scrie în câmpul de căutare din antet un nume de produs, un brand, o aromă sau un cod de bare."}
      crumbs={[{ label: "Căutare" }]}
      products={results}
    />
  );
}
