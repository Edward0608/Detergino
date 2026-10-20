export function LegalNotice() {
  return (
    <p className="panel border border-brand-100 bg-brand-50 px-4 py-3 text-xs text-ink-soft">
      <strong className="text-ink">Text propus.</strong> Descrie exact ce face site-ul acum și urmează să fie verificat de Gabis Fortuna SRL (și, dacă e cazul, de un consilier juridic) înainte de publicare. Câmpurile marcate [DE COMPLETAT] se completează în{" "}
      <code>src/lib/site.ts</code>.
    </p>
  );
}

export function IdLine({ cui, regCom }: { cui: string; regCom: string }) {
  return (
    <>
      {cui ? `CUI ${cui}` : "CUI [DE COMPLETAT]"}, {regCom ? `Nr. Reg. Com. ${regCom}` : "Nr. Reg. Com. [DE COMPLETAT]"}
    </>
  );
}
