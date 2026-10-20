import type { Metadata } from "next";
import { SITE } from "@/lib/site";
import { generalOfferUrl } from "@/lib/whatsapp";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { IconMail, IconPhone, IconPin, IconWhatsApp } from "@/components/icons";

export const metadata: Metadata = {
  title: "Contact",
  description: `${SITE.company}, ${SITE.address}. WhatsApp și telefon ${SITE.phoneDisplay}, email ${SITE.email}.`,
};

export default function ContactPage() {
  const mapQuery = encodeURIComponent("Strada Carierei 158, Brașov");
  return (
    <div className="container-site pt-6">
      <Breadcrumbs items={[{ label: "Contact" }]} />
      <h1 className="mt-6 text-3xl font-semibold text-brand-navy md:text-4xl">Contact</h1>
      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <p className="text-base leading-relaxed text-ink-soft md:text-lg">
            {SITE.company}, {SITE.tagline.toLowerCase()}. Scrie-ne pe WhatsApp pentru o ofertă de preț sau sună-ne.
          </p>
          <ul className="mt-8 space-y-5 text-sm">
            <li className="flex gap-4">
              <IconWhatsApp className="mt-0.5 shrink-0 text-whatsapp-ink" />
              <div>
                <p className="label-caps text-ink-soft">WhatsApp</p>
                <a href={generalOfferUrl()} target="_blank" rel="noopener" className="mt-1 block text-lg font-medium link-underline">
                  {SITE.phoneDisplay}
                </a>
              </div>
            </li>
            <li className="flex gap-4">
              <IconPhone className="mt-0.5 shrink-0" />
              <div>
                <p className="label-caps text-ink-soft">Telefon</p>
                <a href={`tel:${SITE.phoneTel}`} className="mt-1 block text-lg font-medium link-underline">
                  {SITE.phoneDisplay}
                </a>
              </div>
            </li>
            <li className="flex gap-4">
              <IconMail className="mt-0.5 shrink-0" />
              <div>
                <p className="label-caps text-ink-soft">Email</p>
                <a href={`mailto:${SITE.email}`} className="mt-1 block text-lg font-medium link-underline">
                  {SITE.email}
                </a>
              </div>
            </li>
            <li className="flex gap-4">
              <IconPin className="mt-0.5 shrink-0" />
              <div>
                <p className="label-caps text-ink-soft">Adresă</p>
                <p className="mt-1 text-lg font-medium">{SITE.address}</p>
                {SITE.schedule ? <p className="mt-1 text-sm text-ink-soft">Program: {SITE.schedule}</p> : <p className="mt-1 text-xs text-muted">[DE COMPLETAT: programul de lucru, în src/lib/site.ts]</p>}
                {(SITE.cui || SITE.regCom) && <p className="mt-1 text-xs text-muted">{[SITE.cui && `CUI ${SITE.cui}`, SITE.regCom && `Reg. Com. ${SITE.regCom}`].filter(Boolean).join(" · ")}</p>}
              </div>
            </li>
          </ul>
          <a href={generalOfferUrl()} target="_blank" rel="noopener" className="btn-dark mt-10">
            <IconWhatsApp width={18} height={18} />
            Scrie-ne pe WhatsApp
          </a>
        </div>
        <div className="panel aspect-[4/3] overflow-hidden border border-line bg-surface lg:aspect-auto lg:min-h-[420px]">
          <iframe
            title={`Hartă: ${SITE.address}`}
            src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
            className="h-full w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}
