import type { Metadata } from "next";
import { Suspense } from "react";
import { ProductShell } from "@/components/product-shell";

export const metadata: Metadata = {
  title: "Produs",
  robots: { index: false, follow: true },
};

export default function ProdusPage() {
  return (
    <Suspense fallback={<div className="container-site py-20 text-center text-sm text-ink-soft">Se încarcă produsul…</div>}>
      <ProductShell />
    </Suspense>
  );
}
