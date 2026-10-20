import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { OfferListActions, OfferListRows } from "@/components/offer-list";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Lista de ofertă",
  description: "Produsele alese din catalog, trimise într-un singur mesaj pe WhatsApp pentru o ofertă de preț.",
};

export default function OfferListPage() {
  return (
    <div className="container-site pt-6">
      <Breadcrumbs items={[{ label: "Lista de ofertă" }]} />
      <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_360px]">
        <div>
          <h1 className="text-3xl font-semibold text-brand-navy md:text-4xl">Lista de ofertă</h1>
          <p className="mt-2 max-w-xl text-sm text-ink-soft">Lista rămâne salvată în acest browser până o golești. Nu se trimite nimic fără apăsarea butonului de WhatsApp.</p>
          <div className="mt-6">
            <OfferListRows />
          </div>
        </div>
        <aside className="panel h-fit border border-line bg-brand-50 p-6">
          <h2 className="label-caps">Trimite cererea</h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">
            Mesajul ajunge la {SITE.company} pe WhatsApp, la {SITE.phoneDisplay}. Răspundem cu prețuri pentru bax și palet.
          </p>
          <div className="mt-5">
            <OfferListActions />
          </div>
        </aside>
      </div>
    </div>
  );
}
