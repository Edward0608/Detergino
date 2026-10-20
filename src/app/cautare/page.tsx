import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchResults } from "@/components/search-results";

export const metadata: Metadata = {
  title: "Căutare în catalog",
  description: "Caută după nume, brand, aromă, ambalaj sau cod de bare în catalogul Detergino.",
};

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="container-site pt-6 text-sm text-ink-soft">Se încarcă rezultatele...</div>}>
      <SearchResults />
    </Suspense>
  );
}
