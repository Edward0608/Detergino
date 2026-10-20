import type { Metadata } from "next";
import { SITE } from "@/lib/site";
import { PageShell } from "@/components/page-shell";
import { IdLine, LegalNotice } from "@/components/legal-notice";

export const metadata: Metadata = {
  title: "Politica de cookie-uri",
  description: "detergino.ro nu setează cookie-uri proprii; salvează doar lista de ofertă în browserul tău și poate folosi statistici fără cookie-uri.",
};

export default function CookiesPage() {
  return (
    <PageShell title="Politica de cookie-uri" lead="Ce stochează site-ul detergino.ro în browserul tău.">
      <LegalNotice />
      <h2>1. Cookie-uri proprii</h2>
      <p>Site-ul nu setează cookie-uri proprii: nu există conturi de utilizator, coș de cumpărături sau sesiuni autentificate.</p>
      <h2>2. Spațiul local al browserului</h2>
      <p>Lista de ofertă (produsele alese și cantitățile) se salvează în spațiul local al browserului tău (local storage), pe dispozitivul tău, până o golești din pagina „Lista de ofertă” sau ștergi datele site-ului din browser. Aceste date nu sunt transmise către noi.</p>
      <h2>3. Statistici</h2>
      <p>Dacă sunt activate, folosim Plausible, un serviciu de statistici care nu folosește cookie-uri și nu creează profiluri individuale. Se înregistrează doar date agregate: pagini vizitate, țara, tipul dispozitivului și evenimente precum „cerere de ofertă pornită”.</p>
      <h2>4. Servicii terțe</h2>
      <p>Harta de pe pagina de contact este încărcată de Google Maps, care poate seta propriile cookie-uri conform politicii Google. Butoanele de distribuire deschid WhatsApp, Facebook sau aplicația de email doar la apăsare; nu încarcă scripturi ale acestor servicii în pagină.</p>
      <h2>5. Cum le controlezi</h2>
      <p>Datele site-ului se pot șterge oricând din setările browserului (Confidențialitate, date ale site-urilor). Pentru întrebări: {SITE.company}, <IdLine cui={SITE.cui} regCom={SITE.regCom} />, <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.</p>
    </PageShell>
  );
}
