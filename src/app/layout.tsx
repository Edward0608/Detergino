import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import Script from "next/script";
import { ANALYTICS_DOMAIN } from "@/lib/analytics";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { OfferListProvider } from "@/components/offer-list";
import { ExtrasProvider } from "@/components/extras-provider";
import { WhatsAppFloat } from "@/components/whatsapp-float";
import { SITE } from "@/lib/site";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Detergino | Detergenți și produse de curățenie en-gros, Brașov",
    template: "%s | Detergino",
  },
  description:
    "Catalog en-gros de detergenți, balsam de rufe, detergent de vase, odorizante, articole de curățenie, șervețele umede și dulciuri. Importator și distribuitor Gabis Fortuna SRL, Brașov. Cere ofertă pe WhatsApp.",
  openGraph: {
    type: "website",
    locale: "ro_RO",
    siteName: "Detergino",
    images: [{ url: "/og/home.jpg", width: 1200, height: 630, alt: "Detergino, catalog en-gros de detergenți și produse de curățenie" }],
  },
  twitter: { card: "summary_large_image" },
};

const PLAUSIBLE_SRC = process.env.NEXT_PUBLIC_PLAUSIBLE_SRC || "https://plausible.io/js/script.js";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ro" className={`${montserrat.variable} h-full`}>
      <body className="min-h-full flex flex-col">
        <a href="#continut" className="skip-link btn-dark">
          Sari la conținut
        </a>
        <ExtrasProvider>
        <OfferListProvider>
          <SiteHeader />
          <main id="continut" tabIndex={-1} className="flex-1 outline-none">
            {children}
          </main>
          <SiteFooter />
          <WhatsAppFloat />
        </OfferListProvider>
        </ExtrasProvider>
        {ANALYTICS_DOMAIN && (
          <>
            <Script id="plausible-queue" strategy="afterInteractive">{`window.plausible = window.plausible || function () { (window.plausible.q = window.plausible.q || []).push(arguments) };`}</Script>
            <Script defer data-domain={ANALYTICS_DOMAIN} src={PLAUSIBLE_SRC} strategy="afterInteractive" />
          </>
        )}
      </body>
    </html>
  );
}
