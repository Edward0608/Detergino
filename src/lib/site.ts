export const SITE = {
  name: "Detergino",
  url: "https://detergino.ro",
  company: "Gabis Fortuna SRL",
  tagline: "Importator și distribuitor de produse chimice de curățenie și menaj",
  address: "Str. Carierei 158, Brașov",
  city: "Brașov",
  email: "gabisfortuna2018@gmail.com",
  phoneDisplay: "+40 723 767 435",
  phoneTel: "+40723767435",
  whatsappNumber: "40723767435",
  /* Date de identificare: se afișează în footer și în paginile legale doar când sunt completate. */
  cui: "",
  regCom: "",
  /* Program de lucru, de exemplu "Luni - Vineri, 8:00 - 17:00". Se afișează pe Contact doar când este completat. */
  schedule: "",
} as const;

export function whatsappUrl(message: string): string {
  return `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
