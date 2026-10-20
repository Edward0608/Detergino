import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/site";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "Cum ceri o ofertă de preț",
  description: "Alegi produsele din catalog, trimiți lista pe WhatsApp și primești prețurile pentru bax și palet de la Gabis Fortuna SRL.",
};

export default function HowToPage() {
  return (
    <PageShell title="Cum ceri o ofertă de preț" lead="Site-ul nu afișează prețuri. Oferta o primești direct de la noi, pe WhatsApp sau pe email, în funcție de cantitate.">
      <h2>1. Alegi produsele</h2>
      <p>
        Din orice pagină de categorie sau de produs. Butonul „Cere ofertă” deschide WhatsApp pentru un singur produs. Butonul cu pictograma de listă adaugă produsul în <Link href="/lista-oferta/">lista de ofertă</Link>, unde poți strânge mai multe produse și seta cantitățile.
      </p>
      <h2>2. Trimiți mesajul pe WhatsApp</h2>
      <p>
        Mesajul se completează singur cu numele produselor, ambalajul și codul de bare. Îl poți modifica înainte de trimitere, de exemplu ca să adaugi numele firmei, localitatea sau cantitatea dorită la palet.
      </p>
      <h2>3. Primești prețurile</h2>
      <p>
        Răspundem pe WhatsApp la <a href={`tel:${SITE.phoneTel}`}>{SITE.phoneDisplay}</a> sau pe email la <a href={`mailto:${SITE.email}`}>{SITE.email}</a>, cu prețuri pentru bax și palet.
      </p>
      <h2>Ambalare</h2>
      <p>Pe fiecare pagină de produs, la „Ambalare și logistică”, găsești numărul de bucăți per bax, baxuri per rând de palet, rânduri per palet și baxuri per palet, așa cum sunt în lista noastră de distribuție.</p>
      <p className="text-xs text-muted">[DE COMPLETAT: comanda minimă, condițiile de livrare și termenele de plată, dacă doriți să apară pe site.]</p>
    </PageShell>
  );
}
