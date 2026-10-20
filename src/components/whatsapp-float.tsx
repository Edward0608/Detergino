import { IconWhatsApp } from "@/components/icons";
import { generalOfferUrl } from "@/lib/whatsapp";
import { SITE } from "@/lib/site";

export function WhatsAppFloat() {
  return (
    <a
      href={generalOfferUrl()}
      target="_blank"
      rel="noopener"
      aria-label={`Scrie-ne pe WhatsApp la ${SITE.phoneDisplay}`}
      className="fixed bottom-5 right-5 z-[60] flex h-14 w-14 items-center justify-center rounded-pill bg-whatsapp text-white shadow-card hover:bg-whatsapp-ink md:bottom-7 md:right-7"
    >
      <IconWhatsApp width={28} height={28} />
    </a>
  );
}
