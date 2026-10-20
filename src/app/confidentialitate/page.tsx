import type { Metadata } from "next";
import { SITE } from "@/lib/site";
import { PageShell } from "@/components/page-shell";
import { IdLine, LegalNotice } from "@/components/legal-notice";

export const metadata: Metadata = {
  title: "Politica de confidențialitate",
  description: "Ce date de contact prelucrează Gabis Fortuna SRL prin detergino.ro (WhatsApp, email, newsletter), în ce scop, cât timp și care sunt drepturile tale.",
};

export default function PrivacyPage() {
  return (
    <PageShell title="Politica de confidențialitate" lead="Cum prelucrează Gabis Fortuna SRL datele de contact primite prin WhatsApp, email și formularul de newsletter de pe detergino.ro.">
      <LegalNotice />
      <h2>1. Operatorul</h2>
      <p>
        {SITE.company}, <IdLine cui={SITE.cui} regCom={SITE.regCom} />, {SITE.address}. Email: <a href={`mailto:${SITE.email}`}>{SITE.email}</a>, telefon: <a href={`tel:${SITE.phoneTel}`}>{SITE.phoneDisplay}</a>.
      </p>
      <h2>2. Ce date prelucrăm și de unde provin</h2>
      <ul className="list-disc space-y-2 pl-5">
        <li>
          <strong>Cereri de ofertă pe WhatsApp:</strong> numărul de telefon, numele afișat în profilul WhatsApp și conținutul mesajului (produsele cerute, cantitățile, datele firmei pe care ni le scrii). Mesajul se compune pe site, dar este trimis din aplicația ta WhatsApp; noi îl primim când apeși „trimite”.
        </li>
        <li>
          <strong>Cereri de ofertă și newsletter pe email:</strong> adresa de email, numele și conținutul mesajului. Formularul de newsletter deschide aplicația ta de email cu o cerere de abonare pregătită; nu stocăm adresa până nu primim emailul.
        </li>
        <li>
          <strong>Lista de ofertă:</strong> produsele alese și cantitățile se salvează doar în browserul tău (local storage) și nu ajung la noi decât în mesajul pe care îl trimiți tu.
        </li>
        <li>
          <strong>Statistici de trafic:</strong> dacă sunt activate, folosim un serviciu de statistici fără cookie-uri (Plausible), care înregistrează pagini vizitate și evenimente agregate (de exemplu câte cereri de ofertă au fost pornite), fără identificatori personali persistenți.
        </li>
        <li>
          <strong>Harta de pe pagina de contact:</strong> este încărcată de Google Maps; la afișare, Google poate prelucra adresa ta IP conform politicii proprii.
        </li>
      </ul>
      <h2>3. Scopuri și temeiuri</h2>
      <ul className="list-disc space-y-2 pl-5">
        <li>Răspunsul la cererea de ofertă și negocierea unei comenzi: demersuri precontractuale la cererea ta (art. 6 alin. 1 lit. b GDPR).</li>
        <li>Păstrarea corespondenței comerciale și a evidențelor cerute de lege: obligație legală și interes legitim (art. 6 alin. 1 lit. c și f).</li>
        <li>Trimiterea de noutăți din catalog: consimțământul tău, exprimat prin cererea de abonare; îl poți retrage oricând printr-un răspuns la email (art. 6 alin. 1 lit. a).</li>
      </ul>
      <h2>4. Cât timp păstrăm datele</h2>
      <p>Corespondența legată de oferte și comenzi, pe durata relației comerciale și apoi pe termenul cerut de legislația fiscală și comercială. Abonarea la noutăți, până la dezabonare.</p>
      <h2>5. Cui transmitem datele</h2>
      <p>Furnizorilor serviciilor prin care comunici cu noi (WhatsApp, furnizorul de email), furnizorului de statistici (dacă este activat) și, pentru hartă, Google. Nu vindem și nu închiriem date de contact.</p>
      <h2>6. Drepturile tale</h2>
      <p>
        Acces, rectificare, ștergere, restricționare, portabilitate, opoziție și retragerea consimțământului, printr-un mesaj la <a href={`mailto:${SITE.email}`}>{SITE.email}</a>. Ai dreptul să depui o plângere la Autoritatea Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal,{" "}
        <a href="https://www.dataprotection.ro/" target="_blank" rel="noopener">
          dataprotection.ro
        </a>
        .
      </p>
      <h2>7. Actualizări</h2>
      <p>Această politică se actualizează când se schimbă modul în care funcționează site-ul. [DE COMPLETAT: data ultimei actualizări.]</p>
    </PageShell>
  );
}
