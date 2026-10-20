import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/site";
import { PageShell } from "@/components/page-shell";
import { IdLine, LegalNotice } from "@/components/legal-notice";

export const metadata: Metadata = {
  title: "Termeni și condiții",
  description: "Condițiile de utilizare a catalogului detergino.ro: site de prezentare fără prețuri afișate, ofertele se transmit prin WhatsApp sau email de către Gabis Fortuna SRL.",
};

export default function TermsPage() {
  return (
    <PageShell title="Termeni și condiții" lead="Condițiile de utilizare a site-ului detergino.ro și de colaborare cu Gabis Fortuna SRL.">
      <LegalNotice />
      <h2>1. Cine suntem</h2>
      <p>
        Site-ul detergino.ro este administrat de {SITE.company}, <IdLine cui={SITE.cui} regCom={SITE.regCom} />, {SITE.address}, {SITE.tagline.toLowerCase()}.
      </p>
      <h2>2. Ce este site-ul</h2>
      <p>
        Un catalog de prezentare pentru vânzare en-gros. Site-ul nu afișează prețuri și nu permite comenzi sau plăți online. Prețurile, disponibilitatea și condițiile de livrare se comunică prin ofertă, pe WhatsApp sau email, în urma cererii tale. Vezi{" "}
        <Link href="/cum-comanzi/">cum ceri o ofertă</Link>.
      </p>
      <h2>3. Oferte și comenzi</h2>
      <p>O cerere de ofertă trimisă de pe site nu este o comandă. Oferta noastră devine obligatorie doar după confirmarea scrisă a comenzii de către ambele părți, în condițiile stabilite în ofertă. Informațiile despre ambalare (bucăți per bax, baxuri per palet) provin din listele noastre de distribuție și pot fi actualizate.</p>
      <h2>4. Informațiile despre produse</h2>
      <p>Denumirile, cantitățile și codurile de bare sunt preluate din listele de distribuție și de pe ambalajele producătorilor. Imaginile sunt orientative; ambalajul livrat poate diferi ca grafică. Ne străduim să menținem datele corecte și corectăm erorile semnalate la {SITE.email}.</p>
      <h2>5. Proprietate intelectuală</h2>
      <p>Structura și textele site-ului aparțin {SITE.company}. Mărcile și imaginile produselor aparțin producătorilor respectivi și sunt folosite pentru identificarea produselor distribuite.</p>
      <h2>6. Răspundere</h2>
      <p>Site-ul este oferit „ca atare”, ca instrument de informare. Nu răspundem pentru indisponibilitatea temporară a site-ului sau a serviciilor terțe prin care comunici cu noi (WhatsApp, email, Google Maps).</p>
      <h2>7. Legea aplicabilă și litigii</h2>
      <p>
        Se aplică legea română. Litigiile se rezolvă pe cale amiabilă, iar dacă nu este posibil, de instanțele competente din România. Consumatorii pot apela la{" "}
        <a href="https://anpc.ro/ce-este-sal/" target="_blank" rel="noopener">
          soluționarea alternativă a litigiilor (ANPC, SAL)
        </a>{" "}
        sau la{" "}
        <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener">
          platforma europeană SOL
        </a>
        .
      </p>
      <h2>8. Modificări</h2>
      <p>Putem actualiza acești termeni; versiunea curentă este cea publicată pe această pagină. [DE COMPLETAT: data ultimei actualizări.]</p>
    </PageShell>
  );
}
