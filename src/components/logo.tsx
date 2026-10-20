import Link from "next/link";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" aria-label="Detergino, pagina principală" className={`inline-flex flex-col items-center leading-none ${className}`}>
      <span className="text-[19px] font-bold tracking-[0.18em] text-brand-navy sm:text-[24px] md:text-[30px] md:tracking-[0.22em]">DETERGINO</span>
      <span className="mt-1 hidden text-[10px] font-semibold uppercase tracking-[0.4em] text-brand md:block">Gabis Fortuna</span>
    </Link>
  );
}
